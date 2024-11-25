import { Button } from './ui/button';
import { Send, Sparkles } from 'lucide-react';
import { LibraryDialog } from './LibraryDialog';
import { SubmitDialog } from './SubmitDialog';

interface NavBarProps {
  children?: React.ReactNode;
}

export function NavBar({ children }: NavBarProps) {
  return (
    <div className="flex items-center justify-between w-full border-b border-border/40 px-6 py-4 bg-background/50 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <h1 className="text-xl font-semibold">Rolepl.ai</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {children}
      </div>
    </div>
  );
} 