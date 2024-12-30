import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { OnboardingAnswers } from "@/types/onboarding";

export const useOnboardingData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0); // Start at 0 for welcome screen
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('No user found');
          return;
        }

        console.log('Loading onboarding data for user:', user.id);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .maybeSingle();

        if (profileData?.first_name) {
          setFirstName(profileData.first_name);
        }

        const { data: onboardingData, error } = await supabase
          .from('onboarding')
          .select('current_step, answers, status')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading onboarding data:', error);
          return;
        }

        console.log('Onboarding data loaded:', onboardingData);

        if (onboardingData) {
          // If onboarding is not completed, start from welcome screen
          setCurrentStep(onboardingData.status === 'completed' ? 1 : 0);
          setAnswers(onboardingData.answers as OnboardingAnswers || {});
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error("Une erreur est survenue lors du chargement de vos données");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    isLoading,
    currentStep,
    setCurrentStep,
    answers,
    setAnswers,
    firstName
  };
};