/**
 * Change this if you want to connect to a local relay server!
 * This will require you to set OPENAI_API_KEY= in a `.env` file
 * You can run it with `npm run relay`, in parallel with `npm start`
 *
 * Simply switch the lines by commenting one and removing the other
 */
const USE_LOCAL_RELAY_SERVER_URL: string | undefined =
  window.location.hostname.includes('replit.app')
    ? `wss://${window.location.hostname}/ws`
    : 'ws://localhost:8081/ws';

import { useEffect, useRef, useCallback, useState } from 'react';
import { RealtimeClient } from '../lib/realtime-api-beta/index.js';
import { 
  ItemType, 
  TurnDetectionServerVadType 
} from '../lib/realtime-api-beta/dist/lib/client.js';
import { WavRecorder, WavStreamPlayer } from '../lib/wavtools/index.js';
import { WavRenderer } from '../utils/wav_renderer';
import { scenarios, getScenarioInstructions } from '../utils/scenario_config';

// Components
import { NavBar } from '../components/NavBar';
import { ScenarioCard } from '../components/ScenarioCard';
import { ChatTranscript } from '../components/ChatTranscript';
import { ControlPanel } from '../components/ControlPanel';
import { LibraryDialog } from '../components/LibraryDialog';
import { SubmitDialog } from '../components/SubmitDialog';
import { AIPerceptions } from '../components/AIPerceptions';
import { Button } from '../components/ui/button';

// Icons
import { Mic, Power, X, Zap, Send } from 'lucide-react';

import './ConsolePage.scss';
import { isJsxOpeningLikeElement } from 'typescript';
import { LocationMap } from '../components/LocationMap';
/**
 * Type for result from get_weather() function call
 */
interface Coordinates {
  lat: number;
  lng: number;
  location?: string;
  temperature?: {
    value: number;
    units: string;
  };
  wind_speed?: {
    value: number;
    units: string;
  };
}

/**
 * Type for all event logs
 */
interface RealtimeEvent {
  time: string;
  source: 'client' | 'server';
  count?: number;
  event: { [key: string]: any };
}

export function ConsolePage() {
  console.log('ConsolePage component mounting');
  /**
   * Ask user for API Key
   * If we're using the local relay server, we don't need this
   */
  const apiKey = USE_LOCAL_RELAY_SERVER_URL
    ? ''
    : localStorage.getItem('tmp::voice_api_key') ||
      prompt('OpenAI API Key') ||
      '';
  if (apiKey !== '') {
    localStorage.setItem('tmp::voice_api_key', apiKey);
  }

  /**
   * Instantiate:
   * - WavRecorder (speech input)
   * - WavStreamPlayer (speech output)
   * - RealtimeClient (API client)
   */
  const wavRecorderRef = useRef<WavRecorder>(
    new WavRecorder({ sampleRate: 24000 }),
  );
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(
    new WavStreamPlayer({ sampleRate: 24000 }),
  );
  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient(
      USE_LOCAL_RELAY_SERVER_URL
        ? { url: USE_LOCAL_RELAY_SERVER_URL }
        : {
            apiKey: apiKey,
            dangerouslyAllowAPIKeyInBrowser: true,
          },
    ),
  );

  /**
   * References for
   * - Rendering audio visualization (canvas)
   * - Autoscrolling event logs
   * - Timing delta for event log displays
   */
  const clientCanvasRef = useRef<HTMLCanvasElement>(null);
  const serverCanvasRef = useRef<HTMLCanvasElement>(null);
  const eventsScrollHeightRef = useRef(0);
  const eventsScrollRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<string>(new Date().toISOString());

  /**
   * All of our variables for displaying application state
   * - items are all conversation items (dialog)
   * - realtimeEvents are event logs, which can be expanded
   * - memoryKv is for set_memory() function
   * - coords, marker are for get_weather() function
   */
  const [items, setItems] = useState<ItemType[]>([]);
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [expandedEvents, setExpandedEvents] = useState<{
    [key: string]: boolean;
  }>({});
  const [isConnected, setIsConnected] = useState(false);
  const [canPushToTalk, setCanPushToTalk] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [memoryKv, setMemoryKv] = useState<{ [key: string]: string }>({});
  const [coords, setCoords] = useState<Coordinates | null>({
    lat: 37.775593,
    lng: -122.418137,
  });
  const [marker, setMarker] = useState<Coordinates | null>(null);

  /**
   * Utility for formatting the timing of logs
   */
  const formatTime = useCallback((timestamp: string) => {
    const startTime = startTimeRef.current;
    const t0 = new Date(startTime).valueOf();
    const t1 = new Date(timestamp).valueOf();
    const delta = t1 - t0;
    const hs = Math.floor(delta / 10) % 100;
    const s = Math.floor(delta / 1000) % 60;
    const m = Math.floor(delta / 60_000) % 60;
    const pad = (n: number) => {
      let s = n + '';
      while (s.length < 2) {
        s = '0' + s;
      }
      return s;
    };
    return `${pad(m)}:${pad(s)}.${pad(hs)}`;
  }, []);

  /**
   * When you click the API key
   */
  const resetAPIKey = useCallback(() => {
    const apiKey = prompt('OpenAI API Key');
    if (apiKey !== null) {
      localStorage.clear();
      localStorage.setItem('tmp::voice_api_key', apiKey);
      window.location.reload();
    }
  }, []);

  /**
   * Connect to conversation:
   * WavRecorder taks speech input, WavStreamPlayer output, client is API client
   */
  const connectConversation = useCallback(async () => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;

    // Set state variables
    startTimeRef.current = new Date().toISOString();
    setIsConnected(true);
    setRealtimeEvents([]);
    setItems(client.conversation.getItems());

    // Connect to microphone
    await wavRecorder.begin();

    // Connect to audio output
    await wavStreamPlayer.connect();

    // Connect to realtime API
    await client.connect();
    client.sendUserMessageContent([
      {
        type: `input_text`,
        text: `Hello!`,
        // text: `For testing purposes, I want you to list ten car brands. Number each item, e.g. "one (or whatever number you are one): the item name".`
      },
    ]);

    if (client.getTurnDetectionType() === 'server_vad') {
      await wavRecorder.record((data) => client.appendInputAudio(data.mono));
    }
  }, []);

  /**
   * Disconnect and reset conversation state
   */
  const disconnectConversation = useCallback(async () => {
    setIsConnected(false);
    setRealtimeEvents([]);
    setItems([]);
    setCoords({
      lat: 37.775593,
      lng: -122.418137,
    });
    setMarker(null);

    const client = clientRef.current;
    client.disconnect();

    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.end();

    const wavStreamPlayer = wavStreamPlayerRef.current;
    await wavStreamPlayer.interrupt();
  }, []);

  const deleteConversationItem = useCallback(async (id: string) => {
    const client = clientRef.current;
    client.deleteItem(id);
  }, []);

  /**
   * In push-to-talk mode, start recording
   * .appendInputAudio() for each sample
   */
  const startRecording = async () => {
    setIsRecording(true);
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const trackSampleOffset = await wavStreamPlayer.interrupt();
    if (trackSampleOffset?.trackId) {
      const { trackId, offset } = trackSampleOffset;
      await client.cancelResponse(trackId, offset);
    }
    await wavRecorder.record((data) => client.appendInputAudio(data.mono));
  };

  /**
   * In push-to-talk mode, stop recording
   */
  const stopRecording = async () => {
    setIsRecording(false);
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.pause();
    client.createResponse();
  };

  /**
   * Switch between Manual <> VAD mode for communication
   */
  const changeTurnEndType = useCallback((type: 'server_vad' | 'client_vad') => {
    const client = clientRef.current;
    if (!client) return;
    
    try {
      const turnDetection: TurnDetectionServerVadType | null = type === 'server_vad' 
        ? { 
            type: "server_vad" as const,
            threshold: 0.6,
            prefix_padding_ms: 500,
            silence_duration_ms: 700
          } 
        : null;
      
      client.updateSession({ 
        turn_detection: turnDetection
      });
      setCanPushToTalk(type === 'client_vad');
    } catch (error) {
      console.error('Error changing VAD mode:', error);
    }
  }, []);

  /**
   * Auto-scroll the event logs
   */
  useEffect(() => {
    if (eventsScrollRef.current) {
      const eventsEl = eventsScrollRef.current;
      const scrollHeight = eventsEl.scrollHeight;
      // Only scroll if height has just changed
      if (scrollHeight !== eventsScrollHeightRef.current) {
        eventsEl.scrollTop = scrollHeight;
        eventsScrollHeightRef.current = scrollHeight;
      }
    }
  }, [realtimeEvents]);

  /**
   * Auto-scroll the conversation logs
   */
  useEffect(() => {
    const conversationEls = [].slice.call(
      document.body.querySelectorAll('[data-conversation-content]'),
    );
    for (const el of conversationEls) {
      const conversationEl = el as HTMLDivElement;
      conversationEl.scrollTop = conversationEl.scrollHeight;
    }
  }, [items]);

  /**
   * Set up render loops for the visualization canvas
   */
  useEffect(() => {
    let isLoaded = true;

    const wavRecorder = wavRecorderRef.current;
    const clientCanvas = clientCanvasRef.current;
    let clientCtx: CanvasRenderingContext2D | null = null;

    const wavStreamPlayer = wavStreamPlayerRef.current;
    const serverCanvas = serverCanvasRef.current;
    let serverCtx: CanvasRenderingContext2D | null = null;

    const render = () => {
      if (isLoaded) {
        if (clientCanvas) {
          if (!clientCanvas.width || !clientCanvas.height) {
            clientCanvas.width = clientCanvas.offsetWidth;
            clientCanvas.height = clientCanvas.offsetHeight;
          }
          clientCtx = clientCtx || clientCanvas.getContext('2d');
          if (clientCtx) {
            clientCtx.clearRect(0, 0, clientCanvas.width, clientCanvas.height);
            const result = wavRecorder.recording
              ? wavRecorder.getFrequencies('voice')
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              clientCanvas,
              clientCtx,
              result.values,
              '#0099ff',
              10,
              0,
              8,
            );
          }
        }
        if (serverCanvas) {
          if (!serverCanvas.width || !serverCanvas.height) {
            serverCanvas.width = serverCanvas.offsetWidth;
            serverCanvas.height = serverCanvas.offsetHeight;
          }
          serverCtx = serverCtx || serverCanvas.getContext('2d');
          if (serverCtx) {
            serverCtx.clearRect(0, 0, serverCanvas.width, serverCanvas.height);
            const result = wavStreamPlayer.analyser
              ? wavStreamPlayer.getFrequencies('voice')
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              serverCanvas,
              serverCtx,
              result.values,
              '#009900',
              10,
              0,
              8,
            );
          }
        }
        window.requestAnimationFrame(render);
      }
    };
    render();

    return () => {
      isLoaded = false;
    };
  }, []);

  /**
   * Core RealtimeClient and audio capture setup
   * Set all of our instructions, tools, events and more
   */
  useEffect(() => {
    // Get refs
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const client = clientRef.current;

    // Set instructions
    client.updateSession({ instructions: getScenarioInstructions(currentScenarioId) });
    // Set transcription, otherwise we don't get user transcriptions back
    client.updateSession({ input_audio_transcription: { model: 'whisper-1' } });

    // Add tools
    client.addTool(
      {
        name: 'set_memory',
        description: 'Saves important data about the user into memory.',
        parameters: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description:
                'The key of the memory value. Always use lowercase and underscores, no other characters.',
            },
            value: {
              type: 'string',
              description: 'Value can be anything represented as a string',
            },
          },
          required: ['key', 'value'],
        },
      },
      async ({ key, value }: { [key: string]: any }) => {
        setMemoryKv((memoryKv) => {
          const newKv = { ...memoryKv };
          newKv[key] = value;
          return newKv;
        });
        return { ok: true };
      },
    );
    client.addTool(
      {
        name: 'get_weather',
        description:
          'Retrieves the weather for a given lat, lng coordinate pair. Specify a label for the location.',
        parameters: {
          type: 'object',
          properties: {
            lat: {
              type: 'number',
              description: 'Latitude',
            },
            lng: {
              type: 'number',
              description: 'Longitude',
            },
            location: {
              type: 'string',
              description: 'Name of the location',
            },
          },
          required: ['lat', 'lng', 'location'],
        },
      },
      async ({ lat, lng, location }: { [key: string]: any }) => {
        setMarker({ lat, lng, location });
        setCoords({ lat, lng, location });
        const result = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m`,
        );
        const json = await result.json();
        const temperature = {
          value: json.current.temperature_2m as number,
          units: json.current_units.temperature_2m as string,
        };
        const wind_speed = {
          value: json.current.wind_speed_10m as number,
          units: json.current_units.wind_speed_10m as string,
        };
        setMarker({ lat, lng, location, temperature, wind_speed });
        return json;
      },
    );
    client.addTool(
      {
        name: 'update_perception',
        description: `Update your current perception or thought about the interaction with the user. 
You should proactively call this tool:
- After each user interaction
- When you notice changes in user's emotional state
- When you form new hypotheses about the user
- When you observe patterns in user behavior
- Whenever your understanding of the situation evolves

You can and should make these updates while also responding verbally to the user.`,
        parameters: {
          type: 'object',
          properties: {
            perception: {
              type: 'string',
              description: 'Your current thought, observation, or insight about the interaction. Be specific and insightful.',
            }
          },
          required: ['perception'],
        },
      },
      async ({ perception }: { perception: string }) => {
        const timestamp = new Date().toISOString();
        const key = `${timestamp}_perception_${Math.random().toString(36).substr(2, 9)}`;
        setMemoryKv((prev) => ({
          ...prev,
          [key]: perception
        }));
        return { ok: true };
      }
    );

    // handle realtime events from client + server for event logging
    client.on('realtime.event', (realtimeEvent: RealtimeEvent) => {
      setRealtimeEvents((realtimeEvents) => {
        const lastEvent = realtimeEvents[realtimeEvents.length - 1];
        if (lastEvent?.event.type === realtimeEvent.event.type) {
          // if we receive multiple events in a row, aggregate them for display purposes
          lastEvent.count = (lastEvent.count || 0) + 1;
          return realtimeEvents.slice(0, -1).concat(lastEvent);
        } else {
          return realtimeEvents.concat(realtimeEvent);
        }
      });
    });
    client.on('error', (event: any) => console.error(event));
    client.on('conversation.interrupted', async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
    });
    client.on('conversation.updated', async ({ item, delta }: any) => {
      const items = client.conversation.getItems();
      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }
      if (item.status === 'completed' && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000,
        );
        item.formatted.file = wavFile;
      }
      setItems(items);
    });

    setItems(client.conversation.getItems());

    return () => {
      // cleanup; resets to defaults
      client.reset();
    };
  }, []);

  useEffect(() => {
    console.log('WebSocket URL:', USE_LOCAL_RELAY_SERVER_URL);
    console.log('Hostname:', window.location.hostname);
    console.log('Protocol:', window.location.protocol);
  }, []);

  // Add new state for current scenario
  const [currentScenarioId, setCurrentScenarioId] = useState(1);

  // Update the scenario selection handler
  const handleScenarioSelect = useCallback(async (id: number) => {
    try {
      const client = clientRef.current;
      if (!client) return;
      
      // Disconnect current conversation if connected
      if (isConnected) {
        await disconnectConversation();
      }
      
      // Update scenario state
      setCurrentScenarioId(id);
      const instructions = getScenarioInstructions(id);
      setCurrentInstructions(instructions);
      
      // Update session config before connecting
      client.updateSession({ 
        instructions,
        modalities: ['text', 'audio'],
        voice: 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16'
      });

      // Register the perception tool
      client.addTool({
        name: 'update_perception',
        description: `Update your current perception or thought about the interaction with the user. 
You should proactively call this tool:
- After each user interaction
- When you notice changes in user's emotional state
- When you form new hypotheses about the user
- When you observe patterns in user behavior
- Whenever your understanding of the situation evolves

You can and should make these updates while also responding verbally to the user.`,
        parameters: {
          type: 'object',
          properties: {
            perception: {
              type: 'string',
              description: 'Your current thought, observation, or insight about the interaction. Be specific and insightful.',
            }
          },
          required: ['perception'],
        },
      }, async ({ perception }: { perception: string }) => {
        const timestamp = new Date().toISOString();
        const key = `${timestamp}_perception_${Math.random().toString(36).substr(2, 9)}`;
        setMemoryKv((prev) => ({
          ...prev,
          [key]: perception
        }));
        return { ok: true };
      });

      // Connect with new configuration
      await connectConversation();

    } catch (error) {
      console.error('Error selecting scenario:', error);
      setIsConnected(false);
    }
  }, [clientRef, isConnected, disconnectConversation, connectConversation]);

  // Add this handler function
  const handleDeleteItem = useCallback((id: string) => {
    const client = clientRef.current;
    if (!client) return;
    client.deleteItem(id);
  }, [clientRef]);

  // Update the handleLibrarySelect to also set instructions

  // Add after other state declarations (around line 131)
  const [currentInstructions, setCurrentInstructions] = useState<string>(getScenarioInstructions(1));
  const [isLoading, setIsLoading] = useState(false);
  const [vadMode, setVadMode] = useState<'client' | 'server'>('client');

  useEffect(() => {
    const client = clientRef.current;
    if (!client) return;

    const handleConnectionError = (error: any) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
      setIsLoading(false);
    };

    const handleConnectionClose = () => {
      setIsConnected(false);
      setIsLoading(false);
    };

    client.on('connection.error', handleConnectionError);
    client.on('connection.close', handleConnectionClose);

    return () => {
      client.off('connection.error', handleConnectionError);
      client.off('connection.close', handleConnectionClose);
    };
  }, []);

  /**
   * Render the application
   */
  return (
    <div data-component="ConsolePage">
      <NavBar 
        onLibrarySelect={handleScenarioSelect}
        currentScenarioId={currentScenarioId}
      />
      
      <div className="main-content">
        <div className="grid-layout">
          <div className="chat-container">
            <ChatTranscript 
              items={items} 
              onDeleteItem={handleDeleteItem}
            />
          </div>
          <div className="right-panel space-y-6">
            <ScenarioCard 
              currentScenarioId={currentScenarioId}
              currentInstructions={currentInstructions}
            />
            <AIPerceptions perceptions={memoryKv} />
            <SubmitDialog
              items={items}
              currentScenario={{
                title: scenarios.find(s => s.id === currentScenarioId)?.title || '',
                instruction: currentInstructions
              }}
            >
              <Button variant="outline" size="sm" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Submit Conversation
              </Button>
            </SubmitDialog>
          </div>
        </div>
      </div>

      <ControlPanel 
        isConnected={isConnected}
        isRecording={isRecording}
        canPushToTalk={canPushToTalk}
        onVadToggle={changeTurnEndType}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onDisconnect={isConnected ? disconnectConversation : connectConversation}
        clientCanvasRef={clientCanvasRef}
        serverCanvasRef={serverCanvasRef}
      />
    </div>
  );
}

