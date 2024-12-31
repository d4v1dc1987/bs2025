import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { BusinessForm } from "./business/BusinessForm";
import { AISummary } from "./business/AISummary";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { useAIBusinessSummary } from "@/hooks/useAIBusinessSummary";
import type { BusinessProfile } from "./business/types";

export const BusinessSection = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const {
    isLoading,
    formData,
    setFormData,
    fetchBusinessProfile
  } = useBusinessProfile(user?.id);

  const {
    isGenerating,
    generateAISummary
  } = useAIBusinessSummary(user?.id, (summary) => {
    setFormData(prev => ({ ...prev, ai_summary: summary }));
  });

  const handleInputChange = (
    field: keyof BusinessProfile,
    value: string | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
              onClick={() => generateAISummary(formData)}
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