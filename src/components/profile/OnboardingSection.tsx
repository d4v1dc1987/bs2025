import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Onboarding } from "@/components/onboarding/Onboarding";
import { useOnboarding } from "@/components/onboarding/OnboardingContext";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export const OnboardingSection = () => {
  const { openOnboarding, closeOnboarding, isOnboardingOpen } = useOnboarding();
  const isMobile = useIsMobile();

  const handleOnboardingComplete = () => {
    closeOnboarding();
    toast.success("Votre profil a été mis à jour avec succès!");
  };

  if (isOnboardingOpen) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <Card className="p-8 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30 border-primary/20">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Ma personnalité Bobby Social</h3>
        <p className="text-sm text-muted-foreground">
          Modifiez vos réponses au questionnaire de personnalité pour mettre à jour votre profil.
        </p>
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
          <Button onClick={openOnboarding} className="w-full">
            Modifier ma personnalité
          </Button>
        </div>
      </div>
    </Card>
  );
};