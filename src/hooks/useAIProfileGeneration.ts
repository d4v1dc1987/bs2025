import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAIProfileGeneration = () => {
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedProfile, setGeneratedProfile] = useState<string | null>(null);

  const generateAIProfile = async (prompt: string) => {
    // Start progress bar immediately
    setIsGeneratingProfile(true);
    setGenerationProgress(0);

    // Start progress animation
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) return 90;
        return prev + 0.5;
      });
    }, 40); // Increment every 40ms to reach ~90% in 7 seconds

    try {
      // Run API call and 7-second timer in parallel
      const [aiResponse] = await Promise.all([
        supabase.functions.invoke('generate-with-ai', {
          body: { prompt }
        }),
        new Promise(resolve => setTimeout(resolve, 7000)) // Ensure minimum 7 seconds
      ]);

      if (aiResponse.error) throw aiResponse.error;

      // Complete progress bar
      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Show generated profile after a brief pause
      await new Promise(resolve => setTimeout(resolve, 500));
      setGeneratedProfile(aiResponse.data.generatedText);
    } catch (error: any) {
      console.error('Error generating AI summary:', error);
      toast.error("Erreur lors de la génération du profil");
    } finally {
      clearInterval(progressInterval);
      // Keep progress bar visible briefly for smooth transition
      setTimeout(() => {
        setIsGeneratingProfile(false);
      }, 500);
    }
  };

  return {
    isGeneratingProfile,
    generationProgress,
    generatedProfile,
    generateAIProfile,
    setGeneratedProfile
  };
};
