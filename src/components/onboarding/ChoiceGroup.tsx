import { RadioGroup } from "@/components/ui/radio-group";
import { SingleChoice } from "./SingleChoice";
import { MultipleChoice } from "./MultipleChoice";
import type { OnboardingQuestion } from "@/types/onboarding";

interface ChoiceGroupProps {
  question: OnboardingQuestion;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

export const ChoiceGroup = ({ question, value, onChange }: ChoiceGroupProps) => {
  if (question.type === 'single') {
    return (
      <RadioGroup
        value={value as string}
        onValueChange={onChange}
        className="flex flex-wrap gap-4"
      >
        {question.options?.map((option) => (
          <SingleChoice
            key={option.value}
            option={option}
          />
        ))}
      </RadioGroup>
    );
  }

  if (question.type === 'multiple') {
    return (
      <div className="flex flex-wrap gap-4">
        {question.options?.map((option) => (
          <MultipleChoice
            key={option.value}
            option={option}
            isChecked={(value as string[] || []).includes(option.value)}
            onCheckedChange={(checked) => {
              const currentValues = value as string[] || [];
              const newValues = checked
                ? [...currentValues, option.value]
                : currentValues.filter(v => v !== option.value);
              onChange(newValues);
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};