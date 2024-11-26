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
    <div className="border-t border-border/40 bg-gray-900 text-white">
      <div className="flex items-center justify-between w-full px-6 py-4">
        <Button 
          variant="outline" 
          size="sm" 
          className={`w-24 h-9 ${
            !canPushToTalk 
              ? 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700' 
              : 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => onVadToggle(canPushToTalk ? 'server_vad' : 'none')}
        >
          VAD {!canPushToTalk ? 'ON' : 'OFF'}
        </Button>
        
        {isConnected && canPushToTalk && (
          <Button 
            variant="outline" 
            size="sm" 
            className={`w-48 h-9 ${
              isRecording 
                ? 'bg-green-600 text-white border-green-500 hover:bg-green-700' 
                : 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
            }`}
            onMouseDown={onStartRecording}
            onMouseUp={onStopRecording}
            onMouseLeave={onStopRecording}
          >
            <Mic className="w-4 h-4 mr-2" />
            {isRecording ? 'Release to send' : 'Push to talk'}
          </Button>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          className={`w-32 h-9 ${
            isConnected 
              ? 'bg-red-600 text-white border-red-500 hover:bg-red-700'
              : 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700'
          }`}
          onClick={onDisconnect}
        >
          <Power className="w-4 h-4 mr-2" />
          {isConnected ? 'Disconnect' : 'Connect'}
        </Button>
      </div>

      <div className="flex justify-between items-center px-6 py-2 bg-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">You</span>
          <canvas ref={clientCanvasRef} className="h-8 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <canvas ref={serverCanvasRef} className="h-8 w-32" />
          <span className="text-sm text-gray-300">The Patient</span>
        </div>
      </div>
    </div>
  );
}