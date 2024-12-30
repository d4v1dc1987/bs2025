import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ONBOARDING_QUESTIONS, AI_PROFILE_PROMPT } from "@/types/onboarding";
import { useOnboarding } from "./OnboardingContext";
import { WelcomeScreen } from "./WelcomeScreen";
import { QuestionForm } from "./QuestionForm";
import { AIProfileReview } from "./AIProfileReview";
import { isCustomAnswer } from "@/types/customAnswer";
import { useOnboardingData } from "@/hooks/useOnboardingData";
import { useNavigate } from "react-router-dom";
import { useAIProfileGeneration } from "@/hooks/useAIProfileGeneration";

interface OnboardingProps {
  onComplete?: () => void;
}

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const navigate = useNavigate();
  const {
    isLoading,
    currentStep,
    setCurrentStep,
    answers,
    setAnswers,
    firstName
  } = useOnboardingData();

  const {
    isGeneratingProfile,
    generationProgress,
    generatedProfile,
    generateAIProfile,
    setGeneratedProfile
  } = useAIProfileGeneration();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeOnboarding } = useOnboarding();

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

  const handleProfileConfirm = async (profile: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
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
      navigate('/profile?tab=personality');
      toast.success("Votre profil a été enregistré avec succès!");
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Erreur lors de l'enregistrement du profil");
    }
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    const currentQuestion = ONBOARDING_QUESTIONS[currentStep - 1];
    
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

    try {
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
        const formattedAnswers = Object.entries(answers)
          .map(([key, value]) => `${key}: ${formatAnswerValue(value)}`)
          .join('\n');

        const prompt = AI_PROFILE_PROMPT
          .replace('{firstName}', firstName)
          .replace('{answers}', formattedAnswers);

        await generateAIProfile(prompt);
      }

      setCurrentStep(nextStep);
    } catch (error) {
      console.error('Error in handleNext:', error);
      toast.error("Une erreur est survenue");
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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