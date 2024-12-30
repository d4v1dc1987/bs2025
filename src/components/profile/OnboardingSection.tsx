import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Onboarding } from "@/components/onboarding/Onboarding";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingSectionProps {
  onProfileUpdate?: () => void;
}

export const OnboardingSection = ({ onProfileUpdate }: OnboardingSectionProps) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('onboarding')
        .select('status')
        .eq('id', user.id)
        .maybeSingle();
      
      setHasCompletedOnboarding(data?.status === 'completed');
    };

    checkOnboardingStatus();
  }, [user]);

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    if (onProfileUpdate) {
      onProfileUpdate();
    }
  };

  if (!user) return null;

  return (
    <>
      {showOnboarding ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <Card className="p-8 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30 border-primary/20">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Questionnaire de personnalisation</h3>
            <p className="text-sm text-muted-foreground">
              {hasCompletedOnboarding 
                ? "Modifiez vos réponses au questionnaire pour mettre à jour votre profil."
                : "Répondez à quelques questions pour personnaliser votre expérience avec Bobby Social."}
            </p>
            <Button onClick={() => setShowOnboarding(true)}>
              {hasCompletedOnboarding ? "Modifier mes réponses" : "Commencer le questionnaire"}
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};