import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAIProfileGeneration = () => {
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedProfile, setGeneratedProfile] = useState<string | null>(null);

  const generateAIProfile = async (prompt: string) => {
    // Start showing progress bar immediately
    setIsGeneratingProfile(true);
    setGenerationProgress(0);

    // Start progress animation immediately
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 1;
      });
    }, 70); // Slower increment to make it smoother over 7 seconds

    try {
      // Make the API call in parallel with the 7-second timer
      const [aiResponse] = await Promise.all([
        supabase.functions.invoke('generate-with-ai', {
          body: { prompt }
        }),
        // Force minimum 7 seconds wait
        new Promise(resolve => setTimeout(resolve, 7000))
      ]);

      if (aiResponse.error) throw aiResponse.error;

      // After 7 seconds and API response, complete the progress bar
      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Wait a moment before showing the generated profile
      await new Promise(resolve => setTimeout(resolve, 500));
      setGeneratedProfile(aiResponse.data.generatedText);
    } catch (error: any) {
      console.error('Error generating AI summary:', error);
      toast.error("Erreur lors de la génération du profil");
    } finally {
      clearInterval(progressInterval);
      // Keep progress bar visible for a smooth transition
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
