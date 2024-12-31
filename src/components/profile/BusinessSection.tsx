import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type BusinessProfile = {
  business_name: string | null;
  business_type: string | null;
  target_audience: string | null;
  main_product: string | null;
  product_description: string | null;
  price_range: string | null;
  unique_value: string | null;
  goals: string | null;
  challenges: string | null;
  ai_summary: string | null;
};

export const BusinessSection = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<BusinessProfile>({
    business_name: "",
    business_type: null,
    target_audience: "",
    main_product: "",
    product_description: "",
    price_range: "",
    unique_value: "",
    goals: "",
    challenges: "",
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
        .single();

      if (error) throw error;

      setFormData({
        business_name: data.business_name || "",
        business_type: data.business_type || null,
        target_audience: data.target_audience || "",
        main_product: data.main_product || "",
        product_description: data.product_description || "",
        price_range: data.price_range || "",
        unique_value: data.unique_value || "",
        goals: data.goals || "",
        challenges: data.challenges || "",
        ai_summary: data.ai_summary || null,
      });
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
          prompt: `En tant qu'expert en marketing digital, crée un résumé professionnel et détaillé de cette entreprise en ligne. Utilise ces informations:
          
          Nom de l'entreprise: ${formData.business_name}
          Type d'entreprise: ${formData.business_type}
          Public cible: ${formData.target_audience}
          Produit principal: ${formData.main_product}
          Description du produit: ${formData.product_description}
          Gamme de prix: ${formData.price_range}
          Proposition de valeur unique: ${formData.unique_value}
          Objectifs: ${formData.goals}
          Défis: ${formData.challenges}
          
          Le résumé doit être concis mais inclure tous les détails importants qui seront utiles pour générer du contenu marketing pertinent.`,
        },
      });

      if (error) throw error;

      const aiSummary = data.generatedText;
      setFormData((prev) => ({ ...prev, ai_summary: aiSummary }));

      // Save the AI summary to the database
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
          target_audience: formData.target_audience,
          main_product: formData.main_product,
          product_description: formData.product_description,
          price_range: formData.price_range,
          unique_value: formData.unique_value,
          goals: formData.goals,
          challenges: formData.challenges,
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="business_name" className="text-[#c299ff]">
                  Nom de votre entreprise
                </Label>
                <Input
                  id="business_name"
                  value={formData.business_name || ""}
                  onChange={(e) =>
                    handleInputChange("business_name", e.target.value)
                  }
                  placeholder="Ex: Bobby Coaching"
                  className="bg-background/50 border-foreground/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_type" className="text-[#c299ff]">
                  Type d'entreprise
                </Label>
                <Select
                  value={formData.business_type || ""}
                  onValueChange={(value) =>
                    handleInputChange("business_type", value)
                  }
                >
                  <SelectTrigger className="bg-background/50 border-foreground/20">
                    <SelectValue placeholder="Sélectionnez votre type d'entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coach">Coach</SelectItem>
                    <SelectItem value="consultant">Consultant</SelectItem>
                    <SelectItem value="influencer">Influenceur</SelectItem>
                    <SelectItem value="network_marketer">
                      Network Marketer
                    </SelectItem>
                    <SelectItem value="online_trainer">
                      Formateur en ligne
                    </SelectItem>
                    <SelectItem value="course_creator">
                      Créateur de cours
                    </SelectItem>
                    <SelectItem value="freelancer">Freelance</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_audience" className="text-[#c299ff]">
                Public cible
              </Label>
              <Textarea
                id="target_audience"
                value={formData.target_audience || ""}
                onChange={(e) =>
                  handleInputChange("target_audience", e.target.value)
                }
                placeholder="Ex: Femmes entrepreneurs entre 30 et 45 ans, passionnées par le développement personnel..."
                className="bg-background/50 border-foreground/20 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="main_product" className="text-[#c299ff]">
                Produit ou service principal
              </Label>
              <Input
                id="main_product"
                value={formData.main_product || ""}
                onChange={(e) => handleInputChange("main_product", e.target.value)}
                placeholder="Ex: Programme de coaching en ligne 'Réussite Entrepreneuriale'"
                className="bg-background/50 border-foreground/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_description" className="text-[#c299ff]">
                Description détaillée de votre offre
              </Label>
              <Textarea
                id="product_description"
                value={formData.product_description || ""}
                onChange={(e) =>
                  handleInputChange("product_description", e.target.value)
                }
                placeholder="Ex: Programme de 12 semaines incluant des sessions de coaching hebdomadaires..."
                className="bg-background/50 border-foreground/20 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_range" className="text-[#c299ff]">
                Gamme de prix
              </Label>
              <Input
                id="price_range"
                value={formData.price_range || ""}
                onChange={(e) => handleInputChange("price_range", e.target.value)}
                placeholder="Ex: 997€ - 2997€"
                className="bg-background/50 border-foreground/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unique_value" className="text-[#c299ff]">
                Proposition de valeur unique
              </Label>
              <Textarea
                id="unique_value"
                value={formData.unique_value || ""}
                onChange={(e) =>
                  handleInputChange("unique_value", e.target.value)
                }
                placeholder="Ex: Notre méthode unique combine coaching personnalisé et outils pratiques..."
                className="bg-background/50 border-foreground/20 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals" className="text-[#c299ff]">
                Objectifs de votre entreprise
              </Label>
              <Textarea
                id="goals"
                value={formData.goals || ""}
                onChange={(e) => handleInputChange("goals", e.target.value)}
                placeholder="Ex: Aider 1000 entrepreneurs à atteindre 10k€/mois..."
                className="bg-background/50 border-foreground/20 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenges" className="text-[#c299ff]">
                Principaux défis actuels
              </Label>
              <Textarea
                id="challenges"
                value={formData.challenges || ""}
                onChange={(e) => handleInputChange("challenges", e.target.value)}
                placeholder="Ex: Augmenter la visibilité sur les réseaux sociaux..."
                className="bg-background/50 border-foreground/20 min-h-[100px]"
              />
            </div>
          </div>

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

      {formData.ai_summary && (
        <Card className="p-8 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30 border-primary/20">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Résumé de votre business</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {formData.ai_summary}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};