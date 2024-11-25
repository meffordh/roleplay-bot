import { Button } from "@/components/ui/button"
import { Send, Sparkles } from 'lucide-react'
import { LibraryDialog } from "./library-dialog"
import { SubmitDialog } from "./submit-dialog"

export function NavBar() {
  return (
    <div className="flex items-center justify-between w-full border-b border-border/40 px-6 py-4 bg-background/50 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <h1 className="text-xl font-semibold">Rolepl.ai</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <LibraryDialog />
        <SubmitDialog>
          <Button size="sm" variant="outline" className="border-purple-200">
            <Send className="w-4 h-4 mr-2" />
            Submit
          </Button>
        </SubmitDialog>
      </div>
    </div>
  )
}

