import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { OnboardingOption } from "@/types/onboarding";

interface SingleChoiceProps {
  option: OnboardingOption;
}

export const SingleChoice = ({ option }: SingleChoiceProps) => {
  return (
    <div className="flex items-center space-x-2 bg-background/5 px-4 py-2 rounded-lg hover:bg-background/10 transition-colors">
      <RadioGroupItem value={option.value} id={option.value} className="border-2" />
      <Label htmlFor={option.value} className="cursor-pointer">
        <span className="mr-2">{option.emoji}</span>
        {option.label}
      </Label>
    </div>
  );
};