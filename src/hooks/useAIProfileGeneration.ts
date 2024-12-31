import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAIProfileGeneration = () => {
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [generatedProfile, setGeneratedProfile] = useState<string | null>(null);

  const generateAIProfile = async (prompt: string): Promise<string> => {
    try {
      setIsGeneratingProfile(true);
      setGeneratedProfile(null); // Reset avant chaque génération

      const aiResponse = await supabase.functions.invoke('generate-with-ai', {
        body: { prompt }
      });

      if (aiResponse.error) throw aiResponse.error;
      
      const generatedText = aiResponse.data.generatedText;
      
      // S'assurer qu'une seule mise à jour est effectuée
      setGeneratedProfile(generatedText);
      return generatedText;
    } catch (error: any) {
      console.error('Error generating AI summary:', error);
      toast.error("Erreur lors de la génération du profil");
      throw error;
    } finally {
      setIsGeneratingProfile(false);
    }
  };

  return {
    isGeneratingProfile,
    generatedProfile,
    generateAIProfile,
    setGeneratedProfile,
  };
};