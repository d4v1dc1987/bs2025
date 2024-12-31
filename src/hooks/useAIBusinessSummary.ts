import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { BusinessProfile } from "@/components/profile/business/types";

export const useAIBusinessSummary = (
  userId: string | undefined,
  onSummaryGenerated: (summary: string) => void
) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAISummary = async (formData: BusinessProfile) => {
    if (!userId) return;

    try {
      setIsGenerating(true);
      const { data, error } = await supabase.functions.invoke("generate-with-ai", {
        body: {
          prompt: `En tant qu'expert en marketing digital, crée un résumé professionnel détaillé et complet (6-8 phrases) de cette entreprise en ligne, en utilisant "Je" ou "Mon" comme si c'était l'entrepreneur qui parlait. Mets l'accent sur la valeur unique, les résultats concrets et l'histoire de l'entreprise. N'oublie aucun détail important. Utilise ces informations:
          
          Nom de l'entreprise: ${formData.business_name}
          Type d'entreprise: ${formData.business_type}
          Relation avec l'entreprise: ${formData.business_ownership === 'own_business' ? 'Propriétaire' : 'Affilié/Représentant'}
          Industrie: ${formData.industry}
          Produit principal: ${formData.main_product}
          Public cible: ${formData.target_audience}
          Problèmes résolus: ${formData.problem_solved}
          Objectifs: ${formData.goals}
          Résultats clients: ${formData.client_results}
          Âge de l'entreprise: ${formData.company_age}
          Histoire: ${formData.company_story}
          Valeurs: ${formData.company_values}`,
        },
      });

      if (error) throw error;

      const aiSummary = data.generatedText;
      
      // Mise à jour du résumé AI dans la base de données
      const { error: updateError } = await supabase
        .from("business_profiles")
        .update({ ai_summary: aiSummary })
        .eq("id", userId);

      if (updateError) throw updateError;

      onSummaryGenerated(aiSummary);
      toast.success("Résumé AI généré avec succès");
    } catch (error) {
      console.error("Error generating AI summary:", error);
      toast.error("Erreur lors de la génération du résumé AI");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateAISummary
  };
};