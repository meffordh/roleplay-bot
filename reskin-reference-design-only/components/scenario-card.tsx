import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ScenarioCard() {
  return (
    <Card className="border-purple-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Current Scenario</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium mb-2">Anxiety Assessment</h3>
        <p className="text-sm text-muted-foreground">
          Conduct an initial assessment with a patient reporting increased anxiety over the past few months. Gather relevant information and build rapport.
        </p>
      </CardContent>
    </Card>
  )
}

