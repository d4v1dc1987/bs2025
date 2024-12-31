import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { BusinessForm } from "./business/BusinessForm";
import { AISummary } from "./business/AISummary";
import type { BusinessProfile } from "./business/types";

export const BusinessSection = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<BusinessProfile>({
    business_name: "",
    business_type: null,
    business_ownership: null,
    industry: "",
    main_product: "",
    target_audience: "",
    problem_solved: "",
    goals: "",
    client_results: "",
    company_age: "",
    company_story: "",
    company_values: "",
    ai_summary: null,
  });

  useEffect(() => {
    if (user?.id) {
      fetchBusinessProfile();
    }
  }, [user?.id]);

  const fetchBusinessProfile = async () => {
    try {
      console.log('Fetching business profile for user:', user?.id);
      const { data, error } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching business profile:", error);
        throw error;
      }

      console.log('Fetched business profile:', data);
      if (data) {
        setFormData({
          business_name: data.business_name || "",
          business_type: data.business_type || null,
          business_ownership: data.business_ownership || null,
          industry: data.industry || "",
          main_product: data.main_product || "",
          target_audience: data.target_audience || "",
          problem_solved: data.problem_solved || "",
          goals: data.goals || "",
          client_results: data.client_results || "",
          company_age: data.company_age || "",
          company_story: data.company_story || "",
          company_values: data.company_values || "",
          ai_summary: data.ai_summary || null,
        });
      }
    } catch (error) {
      console.error("Error fetching business profile:", error);
      toast.error("Erreur lors du chargement du profil business");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof BusinessProfile,
    value: string | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateAISummary = async () => {
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
      setFormData((prev) => ({ ...prev, ai_summary: aiSummary }));

      // Mise à jour du résumé AI dans la base de données
      const { error: updateError } = await supabase
        .from("business_profiles")
        .update({ ai_summary: aiSummary })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      toast.success("Résumé AI généré avec succès");
    } catch (error) {
      console.error("Error generating AI summary:", error);
      toast.error("Erreur lors de la génération du résumé AI");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setIsSaving(true);
      console.log('Saving business profile:', formData);

      const { error } = await supabase
        .from("business_profiles")
        .update({
          business_name: formData.business_name,
          business_type: formData.business_type,
          business_ownership: formData.business_ownership,
          industry: formData.industry,
          main_product: formData.main_product,
          target_audience: formData.target_audience,
          problem_solved: formData.problem_solved,
          goals: formData.goals,
          client_results: formData.client_results,
          company_age: formData.company_age,
          company_story: formData.company_story,
          company_values: formData.company_values,
          ai_summary: formData.ai_summary,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profil business mis à jour avec succès");
      // Recharger les données après la sauvegarde pour s'assurer que tout est à jour
      await fetchBusinessProfile();
    } catch (error) {
      console.error("Error updating business profile:", error);
      toast.error("Erreur lors de la mise à jour du profil business");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[100px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-8 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30 border-primary/20">
          <BusinessForm formData={formData} handleInputChange={handleInputChange} />
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sauvegarder les modifications
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={generateAISummary}
              disabled={isGenerating}
              className="border-primary/20 hover:bg-primary/10"
            >
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Générer un résumé AI
            </Button>
          </div>
        </Card>
      </form>

      <AISummary summary={formData.ai_summary} />
    </div>
  );
};