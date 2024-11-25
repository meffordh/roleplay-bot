import { Button } from "@/components/ui/button"
import { Mic, Power } from 'lucide-react'
import { VoiceVisualization } from "./voice-visualization"

export function ControlPanel() {
  return (
    <div className="border-t border-border/40 bg-background/50 backdrop-blur-xl">
      <div className="flex items-center justify-between w-full px-6 py-4">
        <Button variant="outline" size="sm" className="w-24 h-9">
          VAD
        </Button>
        <Button variant="outline" size="sm" className="w-48 h-9">
          <Mic className="w-4 h-4 mr-2" />
          Push to talk
        </Button>
        <Button variant="outline" size="sm" className="w-32 h-9 text-red-500 hover:text-red-600 hover:border-red-200">
          <Power className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>
      <div className="flex justify-between items-center px-6 py-2 bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">You</span>
          <VoiceVisualization isActive={true} type="user" />
        </div>
        <div className="flex items-center gap-2">
          <VoiceVisualization isActive={true} type="assistant" />
          <span className="text-sm text-muted-foreground">Assistant</span>
        </div>
      </div>
    </div>
  )
}

