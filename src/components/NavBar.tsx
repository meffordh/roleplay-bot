import { Button } from './ui/button';
import { Send, Sparkles, Library } from 'lucide-react';
import { LibraryDialog } from './LibraryDialog';
import { SubmitDialog } from './SubmitDialog';

interface NavBarProps {
  onLibrarySelect: (id: number) => void;
  currentScenarioId: number;
}

export function NavBar({ onLibrarySelect, currentScenarioId }: NavBarProps) {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-6">
        <a href="/" className="font-semibold">
          Rolepl.ai
        </a>
        <div className="ml-auto flex items-center gap-4">
          <LibraryDialog onSelect={onLibrarySelect} currentScenarioId={currentScenarioId}>
            <Button size="sm" variant="outline">
              <Library className="w-4 h-4 mr-2" />
              Library
            </Button>
          </LibraryDialog>
          <SubmitDialog>
            <Button variant="outline" size="sm" className="border-emerald-200 bg-emerald-600 text-white hover:bg-emerald-700">
              <Send className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </SubmitDialog>
        </div>
      </div>
    </header>
  );
} 