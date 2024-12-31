import { Lightbulb, Quote, MessageSquare, Video, Gift, User } from "lucide-react";

export type CustomField = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
};

export type PostType = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  customFields?: CustomField[];
};

export const createPromptWithUserContext = (basePrompt: string, aiPersonalitySummary: string | null, aiBusinessSummary: string | null) => {
  let fullPrompt = basePrompt;

  if (aiPersonalitySummary) {
    fullPrompt = `Voici ma personnalité: ${aiPersonalitySummary}\n\n${fullPrompt}`;
  }

  if (aiBusinessSummary) {
    fullPrompt = `Voici ma business: ${aiBusinessSummary}\n\n${fullPrompt}`;
  }

  return fullPrompt;
};