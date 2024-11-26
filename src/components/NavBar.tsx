import { Button } from './ui/button';
import { Send, Sparkles, Library } from 'lucide-react';
import { LibraryDialog } from './LibraryDialog';
import { SubmitDialog } from './SubmitDialog';

interface NavBarProps {
  onLibrarySelect: (id: number) => void;
}

export function NavBar({ onLibrarySelect }: NavBarProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-gray-900 text-white">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <h1 className="text-xl font-semibold">Rolepl.ai</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <LibraryDialog onSelect={onLibrarySelect}>
          <Button variant="outline" size="sm" className="border-purple-200 bg-purple-600 text-white hover:bg-purple-700">
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
  );
} 