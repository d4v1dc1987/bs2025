import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { OnboardingAnswers } from "@/types/onboarding";
import { ONBOARDING_QUESTIONS, AI_PROFILE_PROMPT } from "@/types/onboarding";
import { useOnboarding } from "./OnboardingContext";
import { WelcomeScreen } from "./WelcomeScreen";
import { QuestionForm } from "./QuestionForm";
import { AIProfileReview } from "./AIProfileReview";
import { isCustomAnswer } from "@/types/customAnswer";

interface OnboardingProps {
  onComplete?: () => void;
}

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState<string>("");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedProfile, setGeneratedProfile] = useState<string | null>(null);
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const { closeOnboarding } = useOnboarding();

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

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
          .select('current_step, answers')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading onboarding data:', error);
          return;
        }

        if (onboardingData) {
          setCurrentStep(onboardingData.current_step || 0);
          setAnswers(onboardingData.answers as OnboardingAnswers || {});
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleNext = async () => {
    const currentQuestion = ONBOARDING_QUESTIONS[currentStep - 1];
    
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    if (currentQuestion && !answers[currentQuestion.id]) {
      toast.error("Veuillez répondre à la question avant de continuer");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let nextStep = currentStep + 1;
    
    if (currentStep === 5 && answers.has_children !== 'yes') {
      nextStep = 7;
    }

    const { error } = await supabase
      .from('onboarding')
      .upsert({
        id: user.id,
        current_step: nextStep,
        answers,
        status: nextStep > ONBOARDING_QUESTIONS.length ? 'completed' : 'in_progress',
      });

    if (error) {
      toast.error("Erreur lors de la sauvegarde de votre réponse");
      console.error('Error updating onboarding:', error);
      return;
    }

    if (nextStep > ONBOARDING_QUESTIONS.length) {
      await generateAIProfile();
    }

    setCurrentStep(nextStep);
  };

  const formatAnswerValue = (value: unknown): string => {
    if (Array.isArray(value)) {
      return value
        .map(v => {
          if (isCustomAnswer(v)) {
            return v.customValue ? `${v.value} (${v.customValue})` : v.value;
          }
          return v;
        })
        .filter(Boolean)
        .join(', ');
    }
    return String(value);
  };

  const generateAIProfile = async () => {
    setIsGeneratingProfile(true);
    setGenerationProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 5, 90));
      }, 500);

      const formattedAnswers = Object.entries(answers)
        .map(([key, value]) => `${key}: ${formatAnswerValue(value)}`)
        .join('\n');

      const prompt = AI_PROFILE_PROMPT
        .replace('{firstName}', firstName)
        .replace('{answers}', formattedAnswers);

      const response = await fetch('/functions/v1/generate-with-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      const { generatedText } = await response.json();
      setGeneratedProfile(generatedText);
    } catch (error: any) {
      console.error('Error generating AI summary:', error);
      toast.error("Erreur lors de la génération du profil");
    } finally {
      setIsGeneratingProfile(false);
    }
  };

  const handleProfileConfirm = async (profile: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('onboarding')
      .update({ 
        ai_summary: profile,
        status: 'completed'
      })
      .eq('id', user.id);

    if (error) {
      throw error;
    }

    closeOnboarding();
    onComplete?.();
    toast.success("Votre profil a été enregistré avec succès! Vous pourrez le modifier à tout moment depuis votre profil.");
  };

  const handlePrevious = () => {
    if (currentStep === 7 && answers.has_children !== 'yes') {
      setCurrentStep(5);
    } else {
      setCurrentStep(Math.max(0, currentStep - 1));
    }
  };

  const handleAnswerChange = (value: string | string[]) => {
    if (currentStep === 0) return;
    
    const currentQuestion = ONBOARDING_QUESTIONS[currentStep - 1];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  if (currentStep > ONBOARDING_QUESTIONS.length) {
    return (
      <AIProfileReview
        isGenerating={isGeneratingProfile}
        progress={generationProgress}
        generatedProfile={generatedProfile}
        onEdit={() => setCurrentStep(1)}
        onConfirm={handleProfileConfirm}
      />
    );
  }

  if (currentStep === 0) {
    return (
      <WelcomeScreen
        firstName={firstName}
        onStart={handleNext}
      />
    );
  }

  return (
    <QuestionForm
      currentStep={currentStep}
      firstName={firstName}
      answers={answers}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onAnswerChange={handleAnswerChange}
      isSubmitting={isSubmitting}
    />
  );
};