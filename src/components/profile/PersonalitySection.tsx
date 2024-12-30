import { useState, useEffect } from "react";
import { OnboardingSection } from "@/components/profile/OnboardingSection";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const PersonalitySection = () => {
  const { user } = useAuth();
  const [aiProfile, setAiProfile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAiProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('onboarding')
          .select('ai_summary')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setAiProfile(data?.ai_summary);
      } catch (error) {
        console.error('Error fetching AI profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAiProfile();
  }, [user]);

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[100px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {aiProfile && (
            <Card className="p-8 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30 border-primary/20">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Mon profil Bobby Social</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {aiProfile}
                </p>
              </div>
            </Card>
          )}
          <OnboardingSection />
        </>
      )}
    </div>
  );
};