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

  if (selectedPostType?.customFields) {
    const fieldValues = selectedPostType.customFields
      .map(field => customFieldValues[field.name])
      .filter(Boolean);
    
    if (fieldValues.length > 0) {
      fullPrompt += " " + fieldValues.join(" ");
    }
  }

  return fullPrompt;
};