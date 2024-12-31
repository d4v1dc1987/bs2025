import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { OnboardingOption } from "@/types/onboarding";
import { cn } from "@/lib/utils";

interface MultipleChoiceProps {
  option: OnboardingOption;
  isChecked: boolean;
  customValue?: string;
  onCheckedChange: (checked: boolean, customValue?: string) => void;
}

export const MultipleChoice = ({ 
  option, 
  isChecked, 
  customValue = "", 
  onCheckedChange 
}: MultipleChoiceProps) => {
  const [localCustomValue, setLocalCustomValue] = useState(customValue);

  const handleCustomValueChange = (value: string) => {
    setLocalCustomValue(value);
    if (isChecked) {
      onCheckedChange(true, value);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div
        onClick={() => onCheckedChange(!isChecked, localCustomValue)}
        className={cn(
          "flex items-center space-x-2 px-4 py-3 rounded-lg cursor-pointer transition-all",
          isChecked 
            ? "bg-primary/20 ring-2 ring-primary" 
            : "bg-background/10 hover:bg-background/20"
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
        <Label className="cursor-pointer leading-relaxed">
          <span className="mr-2">{option.emoji}</span>
          {option.label}
        </Label>
      </div>
      
      {option.allowCustom && isChecked && (
        <Input
          value={localCustomValue}
          onChange={(e) => handleCustomValueChange(e.target.value)}
          placeholder="Précisez..."
          className="ml-6"
        />
      )}
    </div>
  );
};