import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Library } from 'lucide-react';
import { Scenario, scenarios } from '../utils/scenario_config';

interface LibraryDialogProps {
  onSelect: (id: number) => void;
  children: React.ReactNode;
}

export function LibraryDialog({ onSelect, children }: LibraryDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Roleplay Scenarios</DialogTitle>
          <DialogDescription>
            Choose a scenario to practice your skills.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {scenarios.map((scenario) => (
            <Button
              key={scenario.id}
              variant="outline"
              className="w-full justify-start h-auto flex-col items-start p-4 gap-2"
              onClick={() => onSelect(scenario.id)}
            >
              <div className="font-semibold">{scenario.title}</div>
              <div className="text-sm text-muted-foreground">
                {scenario.description}
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 