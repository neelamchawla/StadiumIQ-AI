import { createAIProvider } from "@/services/ai/provider";
import type { AIFeature, ChatMessage } from "@/types";

export async function askStadiumAI(input: {
  feature: AIFeature;
  message: string;
  history?: ChatMessage[];
  language?: string;
  context?: Record<string, unknown>;
}) {
  const provider = createAIProvider();
  return provider.generate({
    feature: input.feature,
    message: input.message,
    history: input.history,
    language: input.language,
    context: input.context,
  });
}
