import { useState, useEffect, useRef } from 'react';
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
  
  const generationPromise = useRef<Promise<string> | null>(null);

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

        // Stocker la promesse de génération pour éviter les générations multiples
        if (!generationPromise.current) {
          generationPromise.current = generateAIProfile(prompt);
        }

        // Attendre la génération ET l'animation
        const [profile] = await Promise.all([
          generationPromise.current,
          new Promise(resolve => setTimeout(resolve, 7000))
        ]);
        
        stopAnimation();
        setIsSubmitting(false);
        generationPromise.current = null;
      } catch (error) {
        console.error('Error generating profile:', error);
        stopAnimation();
        setIsSubmitting(false);
        generationPromise.current = null;
      }
    };

    handleGeneration();

    // Cleanup
    return () => {
      generationPromise.current = null;
    };
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