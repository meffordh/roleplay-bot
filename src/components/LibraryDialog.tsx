import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Library } from 'lucide-react';
import { Scenario, scenarios } from '../utils/scenario_config';
import { Check } from 'lucide-react';

interface LibraryDialogProps {
  onSelect: (id: number) => void;
  currentScenarioId: number;
  children: React.ReactNode;
}

export function LibraryDialog({ onSelect, currentScenarioId, children }: LibraryDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Roleplay Scenarios</DialogTitle>
          <DialogDescription>
            Choose a scenario to practice your skills.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-4 py-4 px-1">
            {scenarios.map((scenario) => (
              <Button
                key={scenario.id}
                variant="outline"
                className="w-full justify-between h-auto items-start p-4 gap-2 relative group text-left"
                onClick={() => onSelect(scenario.id)}
              >
                <div className="flex flex-col items-start w-[90%]">
                  <div className="font-semibold break-words">{scenario.title}</div>
                  <div className="text-sm text-muted-foreground break-words whitespace-normal">
                    {scenario.description}
                  </div>
                </div>
                {currentScenarioId === scenario.id && (
                  <Check className="h-4 w-4 text-primary absolute right-4 top-4" />
                )}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 