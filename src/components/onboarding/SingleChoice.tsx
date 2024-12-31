import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { OnboardingOption } from "@/types/onboarding";
import { cn } from "@/lib/utils";

interface SingleChoiceProps {
  option: OnboardingOption;
}

export const SingleChoice = ({ option }: SingleChoiceProps) => {
  return (
    <div className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 px-4 py-3 rounded-lg transition-all border border-white/10">
      <RadioGroupItem value={option.value} id={option.value} className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
      <Label htmlFor={option.value} className="cursor-pointer">
        <span className="mr-2">{option.emoji}</span>
        {option.label}
      </Label>
    </div>
  );
};