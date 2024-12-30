import { OnboardingSection } from "@/components/profile/OnboardingSection";
import { Card } from "@/components/ui/card";

export const PersonalitySection = () => {
  return (
    <div className="space-y-8">
      <Card className="p-8 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30 border-primary/20">
        <OnboardingSection />
      </Card>
    </div>
  );
};