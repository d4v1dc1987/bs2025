import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAIProfileGeneration = () => {
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedProfile, setGeneratedProfile] = useState<string | null>(null);

  const generateAIProfile = async (prompt: string) => {
    setIsGeneratingProfile(true);
    setGenerationProgress(90); // Set to 90% while waiting for API response

    try {
      const aiResponse = await supabase.functions.invoke('generate-with-ai', {
        body: { prompt }
      });

      if (aiResponse.error) throw aiResponse.error;

      // Complete progress bar
      setGenerationProgress(100);

      // Show generated profile after a brief pause
      await new Promise(resolve => setTimeout(resolve, 500));
      setGeneratedProfile(aiResponse.data.generatedText);
    } catch (error: any) {
      console.error('Error generating AI summary:', error);
      toast.error("Erreur lors de la génération du profil");
    } finally {
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
    setGeneratedProfile,
    setGenerationProgress
  };
};
