import { useState, useEffect, useRef } from 'react';
import { useProgressAnimation } from '@/hooks/useProgressAnimation';
import { useAIProfileGeneration } from '@/hooks/useAIProfileGeneration';
import { AIProfileReview } from './AIProfileReview';
import type { OnboardingAnswers } from '@/types/onboarding';
import { AI_PROFILE_PROMPT } from '@/types/onboarding';
import { toast } from 'sonner';

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
    setGeneratedProfile,
    error
  } = useAIProfileGeneration();
  
  const generationPromise = useRef<Promise<string> | null>(null);
  const isGenerating = useRef(false);

  useEffect(() => {
    const handleGeneration = async () => {
      if (!isSubmitting || isGenerating.current) return;

      try {
        isGenerating.current = true;
        startAnimation();
        
        const formattedAnswers = Object.entries(answers)
          .map(([key, value]) => `${key}: ${formatAnswerValue(value)}`)
          .join('\n');

        const prompt = AI_PROFILE_PROMPT
          .replace('{firstName}', firstName)
          .replace('{answers}', formattedAnswers);

        if (!generationPromise.current) {
          generationPromise.current = generateAIProfile(prompt);
        }

        const [generatedText] = await Promise.all([
          generationPromise.current,
          new Promise(resolve => setTimeout(resolve, 7000))
        ]);
        
        // Ensure we only update the profile once
        setGeneratedProfile(generatedText);
        
        stopAnimation();
        setIsSubmitting(false);
        generationPromise.current = null;
      } catch (error) {
        console.error('Error generating profile:', error);
        toast.error("Une erreur est survenue lors de la génération du profil");
        stopAnimation();
        setIsSubmitting(false);
        generationPromise.current = null;
      } finally {
        isGenerating.current = false;
      }
    };

    handleGeneration();

    return () => {
      generationPromise.current = null;
      isGenerating.current = false;
    };
  }, [isSubmitting, firstName, answers, generateAIProfile, startAnimation, stopAnimation, setGeneratedProfile]);

  useEffect(() => {
    setIsSubmitting(true);
  }, []);

  const handleConfirm = async (profile: string) => {
    try {
      await onComplete(profile);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Une erreur est survenue lors de l'enregistrement du profil");
    }
  };

  return (
    <AIProfileReview
      isGenerating={isSubmitting}
      progress={progress}
      generatedProfile={generatedProfile}
      onEdit={onEdit}
      onConfirm={handleConfirm}
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