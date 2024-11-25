import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useEffect, useState } from 'react';
import { scenarios } from '../utils/scenario_config';

interface ScenarioCardProps {
  currentInstructions: string;
}

export function ScenarioCard({ currentInstructions }: ScenarioCardProps) {
  const [currentScenario, setCurrentScenario] = useState(scenarios[0]);

  useEffect(() => {
    const scenario = scenarios.find(s => s.instruction === currentInstructions) || scenarios[0];
    setCurrentScenario(scenario);
  }, [currentInstructions]);

  return (
    <div className="card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Current Scenario</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium mb-2">{currentScenario.title}</h3>
        <p className="text-sm text-muted-foreground">
          {currentScenario.description}
        </p>
      </CardContent>
    </div>
  );
} 