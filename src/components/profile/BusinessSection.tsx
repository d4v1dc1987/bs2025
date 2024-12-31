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
    fetchBusinessProfile();
  }, [user]);

  const fetchBusinessProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData(data);
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
          prompt: `En tant qu'expert en marketing digital, crée un résumé professionnel et concis (3-4 phrases maximum) de cette entreprise en ligne, en utilisant "Je" ou "Mon" comme si c'était l'entrepreneur qui parlait. Utilise ces informations:
          
          Nom de l'entreprise: ${formData.business_name}
          Type d'entreprise: ${formData.business_type}
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
    if (!user) return;

    try {
      setIsSaving(true);

      const { error } = await supabase
        .from("business_profiles")
        .update({
          business_name: formData.business_name,
          business_type: formData.business_type,
          industry: formData.industry,
          main_product: formData.main_product,
          target_audience: formData.target_audience,
          problem_solved: formData.problem_solved,
          goals: formData.goals,
          client_results: formData.client_results,
          company_age: formData.company_age,
          company_story: formData.company_story,
          company_values: formData.company_values,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profil business mis à jour avec succès");
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