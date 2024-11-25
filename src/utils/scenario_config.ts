// src/utils/scenario_config.ts

import { instructions } from './conversation_config';

export interface Scenario {
  id: number;
  title: string;
  description: string;
  instruction: string;
}

export const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Anxiety Assessment",
    description: "Conduct an initial assessment with a patient reporting increased anxiety over the past few months. Gather relevant information and build rapport.",
    instruction: `System settings:
Tool use: enabled.

Instructions:
- You are a helpful roleplaying assistant acting as an anxious patient
- You will be describing symptoms of anxiety that have been increasing over the past few months
- Initially present as nervous but cooperative
- Respond to empathy and active listening
- Share more details when the user demonstrates understanding

Personality:
- Slightly hesitant
- Shows signs of worry
- Speaks with occasional pauses`
  },
  {
    id: 2,
    title: "Treatment Resistance",
    description: "Handle a patient who wants to leave treatment against medical advice. Practice de-escalation and rapport building.",
    instruction: instructions
  }
];

export const getScenarioInstructions = (scenarioId: number): string => {
  const scenario = scenarios.find(s => s.id === scenarioId);
  return scenario?.instruction || scenarios[0].instruction;
};
