import { useState, useEffect } from 'react';
import { useProgressAnimation } from '@/hooks/useProgressAnimation';
import { useAIProfileGeneration } from '@/hooks/useAIProfileGeneration';
import { AIProfileReview } from './AIProfileReview';
import type { OnboardingAnswers } from '@/types/onboarding';
import { AI_PROFILE_PROMPT } from '@/types/onboarding';

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
  const { progress, isAnimating, startAnimation } = useProgressAnimation(7000); // Exactement 7 secondes
  const {
    isGeneratingProfile,
    generatedProfile,
    generateAIProfile,
    setGeneratedProfile
  } = useAIProfileGeneration();

  useEffect(() => {
    if (!isSubmitting) return;
    
    const handleGeneration = async () => {
      startAnimation();
      
      // Attendre exactement 7 secondes avant de générer le profil
      await new Promise(resolve => setTimeout(resolve, 7000));
      
      const formattedAnswers = Object.entries(answers)
        .map(([key, value]) => `${key}: ${formatAnswerValue(value)}`)
        .join('\n');

      const prompt = AI_PROFILE_PROMPT
        .replace('{firstName}', firstName)
        .replace('{answers}', formattedAnswers);

      await generateAIProfile(prompt);
      setIsSubmitting(false);
    };

    handleGeneration();
  }, [isSubmitting]);

  useEffect(() => {
    setIsSubmitting(true);
  }, []);

  return (
    <AIProfileReview
      isGenerating={isSubmitting || isGeneratingProfile}
      progress={isSubmitting ? progress : (isGeneratingProfile ? 100 : 0)}
      generatedProfile={generatedProfile}
      onEdit={onEdit}
      onConfirm={onComplete}
    />
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