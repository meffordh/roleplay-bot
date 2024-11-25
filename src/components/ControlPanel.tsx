import { Button } from './ui/button';
import { Mic, Power } from 'lucide-react';
import { VoiceVisualization } from './VoiceVisualization';

interface ControlPanelProps {
  isConnected: boolean;
  isRecording: boolean;
  canPushToTalk: boolean;
  onVadToggle: (value: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onDisconnect: () => void;
  clientCanvasRef: React.RefObject<HTMLCanvasElement>;
  serverCanvasRef: React.RefObject<HTMLCanvasElement>;
}

export function ControlPanel({
  isConnected,
  isRecording,
  canPushToTalk,
  onVadToggle,
  onStartRecording,
  onStopRecording,
  onDisconnect,
  clientCanvasRef,
  serverCanvasRef
}: ControlPanelProps) {
  return (
    <div className="border-t border-border/40 bg-background/50 backdrop-blur-xl">
      <div className="flex items-center justify-between w-full px-6 py-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-24 h-9"
          onClick={() => onVadToggle(canPushToTalk ? 'server_vad' : 'none')}
        >
          VAD
        </Button>
        {isConnected && canPushToTalk && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-48 h-9"
            onMouseDown={onStartRecording}
            onMouseUp={onStopRecording}
          >
            <Mic className="w-4 h-4 mr-2" />
            {isRecording ? 'Release to send' : 'Push to talk'}
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-32 h-9 text-red-500 hover:text-red-600 hover:border-red-200"
          onClick={onDisconnect}
        >
          <Power className="w-4 h-4 mr-2" />
          {isConnected ? 'Disconnect' : 'Connect'}
        </Button>
      </div>
      <div className="flex justify-between items-center px-6 py-2 bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">You</span>
          <VoiceVisualization 
            isActive={isRecording} 
            type="user" 
            canvasRef={clientCanvasRef}
          />
        </div>
        <div className="flex items-center gap-2">
          <VoiceVisualization 
            isActive={isConnected} 
            type="assistant" 
            canvasRef={serverCanvasRef}
          />
          <span className="text-sm text-muted-foreground">The Patient</span>
        </div>
      </div>
    </div>
  );
}