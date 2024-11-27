import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface AIPerceptionsProps {
  perceptions: { [key: string]: string };
}

export function AIPerceptions({ perceptions }: AIPerceptionsProps) {
  const perceptionEntries = Object.entries(perceptions)
    .filter(([key]) => key.startsWith('perception_'))
    .sort((a, b) => a[0].localeCompare(b[0]));

  if (perceptionEntries.length === 0) {
    return null;
  }

  return (
    <div className="border border-border/40 bg-background rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border/40">
        <h3 className="font-medium">AI Perceptions</h3>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {perceptionEntries.map(([key, value]) => (
            <div key={key} className="text-sm text-muted-foreground">
              {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
