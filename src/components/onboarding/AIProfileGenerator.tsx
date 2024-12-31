import { useState, useEffect } from 'react';
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

  useEffect(() => {
    let isMounted = true;

    const generateProfile = async () => {
      if (!isSubmitting || isGeneratingProfile) {
        console.log('Skipping generation: not submitting or already in progress');
        return;
      }

      try {
        console.log('Starting profile generation...');
        startAnimation();
        
        const formattedAnswers = Object.entries(answers)
          .map(([key, value]) => `${key}: ${formatAnswerValue(value)}`)
          .join('\n');

        const prompt = AI_PROFILE_PROMPT
          .replace('{firstName}', firstName)
          .replace('{answers}', formattedAnswers);

        const generatedText = await generateAIProfile(prompt);
        
        // Only update state if component is still mounted
        if (isMounted) {
          console.log('Generation complete, updating profile');
          setGeneratedProfile(generatedText);
          stopAnimation();
          setIsSubmitting(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error generating profile:', error);
          stopAnimation();
          setIsSubmitting(false);
        }
      }
    };

    generateProfile();

    return () => {
      isMounted = false;
      console.log('Cleaning up generation process');
    };
  }, [isSubmitting, firstName, answers, generateAIProfile, startAnimation, stopAnimation, setGeneratedProfile, isGeneratingProfile]);

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