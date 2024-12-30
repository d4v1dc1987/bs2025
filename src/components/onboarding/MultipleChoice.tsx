import { Label } from "@/components/ui/label";
import type { OnboardingOption } from "@/types/onboarding";
import { cn } from "@/lib/utils";

interface MultipleChoiceProps {
  option: OnboardingOption;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const MultipleChoice = ({ option, isChecked, onCheckedChange }: MultipleChoiceProps) => {
  return (
    <div
      onClick={() => onCheckedChange(!isChecked)}
      className={cn(
        "flex items-center space-x-2 bg-background/5 px-4 py-2 rounded-lg cursor-pointer transition-all",
        isChecked ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-background/10"
      )}
    >
      <div className={cn(
        "w-4 h-4 rounded border-2 transition-colors flex items-center justify-center",
        isChecked ? "bg-primary border-primary" : "border-primary"
      )}>
        {isChecked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3 text-primary-foreground"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <Label className="cursor-pointer">
        <span className="mr-2">{option.emoji}</span>
        {option.label}
      </Label>
    </div>
  );
};