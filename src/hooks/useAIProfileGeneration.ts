import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAIProfileGeneration = () => {
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [generatedProfile, setGeneratedProfile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateAIProfile = async (prompt: string): Promise<string> => {
    if (isGeneratingProfile) {
      console.log('Generation already in progress, skipping...');
      throw new Error('Une génération est déjà en cours');
    }

    try {
      console.log('Starting AI profile generation...');
      setIsGeneratingProfile(true);
      setError(null);

      const aiResponse = await supabase.functions.invoke('generate-with-ai', {
        body: { prompt }
      });

      if (aiResponse.error) {
        console.error('Error from Edge Function:', aiResponse.error);
        throw new Error(aiResponse.error.message || 'Error generating profile');
      }
      
      const generatedText = aiResponse.data.generatedText;
      
      if (!generatedText) {
        throw new Error('No text was generated');
      }

      console.log('Successfully generated profile of length:', generatedText.length);
      setGeneratedProfile(generatedText);
      return generatedText;
    } catch (error: any) {
      console.error('Error generating AI summary:', error);
      const errorMessage = error.message || "Erreur lors de la génération du profil";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsGeneratingProfile(false);
    }
  };

  return {
    isGeneratingProfile,
    generatedProfile,
    error,
    generateAIProfile,
    setGeneratedProfile,
  };
};