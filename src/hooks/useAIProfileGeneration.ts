import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProgressAnimation } from "./useProgressAnimation";

export const useAIProfileGeneration = () => {
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [generatedProfile, setGeneratedProfile] = useState<string | null>(null);
  const { progress, isAnimating, startAnimation } = useProgressAnimation(7000);

  const generateAIProfile = async (prompt: string) => {
    setIsGeneratingProfile(true);
    startAnimation();

    // Wait for the progress animation to complete before making the API call
    await new Promise(resolve => setTimeout(resolve, 7000));

    try {
      const aiResponse = await supabase.functions.invoke('generate-with-ai', {
        body: { prompt }
      });

      if (aiResponse.error) throw aiResponse.error;
      setGeneratedProfile(aiResponse.data.generatedText);
    } catch (error: any) {
      console.error('Error generating AI summary:', error);
      toast.error("Erreur lors de la génération du profil");
    } finally {
      setIsGeneratingProfile(false);
    }
  };

  return {
    isGeneratingProfile,
    generationProgress: progress,
    generatedProfile,
    generateAIProfile,
    setGeneratedProfile,
    isAnimating
  };
};