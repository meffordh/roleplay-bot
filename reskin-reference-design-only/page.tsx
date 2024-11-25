import { NavBar } from "./components/nav-bar"
import { ScenarioCard } from "./components/scenario-card"
import { ChatTranscript } from "./components/chat-transcript"
import { ControlPanel } from "./components/control-panel"

export default function Page() {
  return (
    <div className="flex flex-col h-screen bg-white">
      <NavBar />
      <div className="grid grid-cols-3 gap-6 p-6" style={{ height: "calc(100vh - 130px)" }}>
        <div className="col-span-2 border border-border/40 bg-background">
          <ChatTranscript />
        </div>
        <div className="space-y-6">
          <ScenarioCard />
          <div className="border border-border/40 bg-background p-4">
            <h3 className="font-medium mb-3">Map View</h3>
            <div className="w-full h-40 bg-gray-50 border border-gray-100 flex items-center justify-center text-sm text-muted-foreground">
              Interactive Map
            </div>
          </div>
          <div className="border border-border/40 bg-background p-4">
            <h3 className="font-medium mb-3">Set Memory</h3>
            <div className="w-full h-40 bg-gray-50 border border-gray-100 flex items-center justify-center text-sm text-muted-foreground">
              Memory Interface
            </div>
          </div>
        </div>
      </div>
      <ControlPanel />
    </div>
  )
}

