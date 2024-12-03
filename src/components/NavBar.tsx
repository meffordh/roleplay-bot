import { Button } from './ui/button';
import { Library } from 'lucide-react';
import { LibraryDialog } from './LibraryDialog';

interface NavBarProps {
  onLibrarySelect: (id: number) => void;
  currentScenarioId: number;
}

export function NavBar({ onLibrarySelect, currentScenarioId }: NavBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <a className="flex items-center space-x-2" href="/">
            <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
            <span className="font-bold">roleplay.app</span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <LibraryDialog onSelect={onLibrarySelect} currentScenarioId={currentScenarioId}>
            <Button size="sm" variant="outline">
              <Library className="w-4 h-4 mr-2" />
              Library
            </Button>
          </LibraryDialog>
        </div>
      </div>
    </header>
  );
} 