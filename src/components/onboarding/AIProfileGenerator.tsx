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
  const { progress, startAnimation, stopAnimation } = useProgressAnimation(7000);
  const {
    isGeneratingProfile,
    generatedProfile,
    generateAIProfile,
    setGeneratedProfile
  } = useAIProfileGeneration();

  useEffect(() => {
    const handleGeneration = async () => {
      if (!isSubmitting) return;

      try {
        startAnimation();
        
        const formattedAnswers = Object.entries(answers)
          .map(([key, value]) => `${key}: ${formatAnswerValue(value)}`)
          .join('\n');

        const prompt = AI_PROFILE_PROMPT
          .replace('{firstName}', firstName)
          .replace('{answers}', formattedAnswers);

        const profile = await generateAIProfile(prompt);
        
        // Ensure we wait at least 7 seconds for the animation
        await new Promise(resolve => setTimeout(resolve, 7000));
        
        stopAnimation();
        setIsSubmitting(false);
      } catch (error) {
        console.error('Error generating profile:', error);
        stopAnimation();
        setIsSubmitting(false);
      }
    };

    handleGeneration();
  }, [isSubmitting, firstName, answers, generateAIProfile, startAnimation, stopAnimation]);

  useEffect(() => {
    setIsSubmitting(true);
  }, []);

  return (
    <AIProfileReview
      isGenerating={isSubmitting}
      progress={progress}
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