import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { OnboardingOption } from "@/types/onboarding";

interface SingleChoiceProps {
  option: OnboardingOption;
}

export const SingleChoice = ({ option }: SingleChoiceProps) => {
  return (
    <div className="flex items-center space-x-2 bg-background/10 hover:bg-background/20 px-4 py-3 rounded-lg transition-all">
      <RadioGroupItem value={option.value} id={option.value} className="border-2" />
      <Label htmlFor={option.value} className="cursor-pointer">
        <span className="mr-2">{option.emoji}</span>
        {option.label}
      </Label>
    </div>
  );
};