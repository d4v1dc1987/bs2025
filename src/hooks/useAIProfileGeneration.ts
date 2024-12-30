import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAIProfileGeneration = () => {
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedProfile, setGeneratedProfile] = useState<string | null>(null);

  const generateAIProfile = async (prompt: string) => {
    // Afficher immédiatement la barre de progression
    setIsGeneratingProfile(true);
    setGenerationProgress(0);

    // Démarrer l'animation de progression immédiatement
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          return 90;
        }
        // Incrémenter plus lentement pour atteindre ~90% en 7 secondes
        return prev + 0.5;
      });
    }, 40); // 40ms * 0.5 = ~90% en 7 secondes

    try {
      // Lancer l'appel API en parallèle avec le timer de 7 secondes
      const aiResponse = await supabase.functions.invoke('generate-with-ai', {
        body: { prompt }
      });

      if (aiResponse.error) throw aiResponse.error;

      // Attendre que les 7 secondes soient écoulées
      await new Promise(resolve => setTimeout(resolve, 7000));

      // Compléter la barre de progression
      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Attendre un moment avant d'afficher le profil généré
      await new Promise(resolve => setTimeout(resolve, 500));
      setGeneratedProfile(aiResponse.data.generatedText);
    } catch (error: any) {
      console.error('Error generating AI summary:', error);
      toast.error("Erreur lors de la génération du profil");
    } finally {
      clearInterval(progressInterval);
      // Garder la barre de progression visible pour une transition fluide
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