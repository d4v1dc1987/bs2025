import { useState, useEffect } from 'react';
import { useProgressAnimation } from '@/hooks/useProgressAnimation';
import { Progress } from "@/components/ui/progress";
import { useAIProfileGeneration } from '@/hooks/useAIProfileGeneration';
import { AIProfileReview } from './AIProfileReview';
import type { OnboardingAnswers } from '@/types/onboarding';

interface AIProfileGeneratorProps {
  firstName: string;
  answers: OnboardingAnswers;
  onEdit: () => void;
  onComplete: (profile: string) => Promise<void>;
}

export const AIProfileGenerator = ({ 
  firstName, 
  answers, 
  onEdit, 
  onComplete 
}: AIProfileGeneratorProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { progress, isAnimating, startAnimation } = useProgressAnimation();
  const {
    isGeneratingProfile,
    generatedProfile,
    generateAIProfile,
    setGeneratedProfile,
    setGenerationProgress
  } = useAIProfileGeneration();

  useEffect(() => {
    if (isSubmitting) {
      startAnimation();
    }
  }, [isSubmitting]);

  useEffect(() => {
    const handleGeneration = async () => {
      if (!isAnimating && isSubmitting) {
        const formattedAnswers = Object.entries(answers)
          .map(([key, value]) => `${key}: ${formatAnswerValue(value)}`)
          .join('\n');

        const prompt = AI_PROFILE_PROMPT
          .replace('{firstName}', firstName)
          .replace('{answers}', formattedAnswers);

        await generateAIProfile(prompt);
        setIsSubmitting(false);
      }
    };

    handleGeneration();
  }, [isAnimating, isSubmitting]);

  useEffect(() => {
    setGenerationProgress(progress);
  }, [progress]);

  if (!isSubmitting && !isGeneratingProfile && !generatedProfile) {
    return null;
  }

  if (generatedProfile) {
    return (
      <AIProfileReview
        isGenerating={false}
        progress={100}
        generatedProfile={generatedProfile}
        onEdit={onEdit}
        onConfirm={onComplete}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Progress value={progress} className="w-full" />
      <p className="text-center text-sm text-muted-foreground">
        Génération de votre profil en cours...
      </p>
    </div>
  );
};

const formatAnswerValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value
      .map(v => {
        if (typeof v === 'object' && v !== null && 'customValue' in v) {
          return v.customValue ? `${v.value} (${v.customValue})` : v.value;
        }
        return v;
      })
      .filter(Boolean)
      .join(', ');
  }
  return String(value);
};