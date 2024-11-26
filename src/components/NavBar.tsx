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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="font-bold">roleplay.app</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
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