import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { scenarios } from '../utils/scenario_config';

interface ScenarioCardProps {
  currentScenarioId: number;
  currentInstructions?: string;
}

export function ScenarioCard({ currentScenarioId, currentInstructions }: ScenarioCardProps) {
  const currentScenario = scenarios.find(s => s.id === currentScenarioId) || scenarios[0];

  return (
    <div className="border border-border/40 bg-background rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border/40">
        <h3 className="font-medium">Current Scenario</h3>
      </div>
      <div className="p-4">
        <h4 className="font-medium mb-2">{currentScenario.title}</h4>
        <p className="text-sm text-muted-foreground">{currentScenario.description}</p>
      </div>
    </div>
  );
} 