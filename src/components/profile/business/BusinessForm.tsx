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
import type { BusinessProfile } from "./types";
import type { BusinessType } from "./types";

interface BusinessFormProps {
  formData: BusinessProfile;
  handleInputChange: (field: keyof BusinessProfile, value: string | null) => void;
}

export const BusinessForm = ({ formData, handleInputChange }: BusinessFormProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="business_name" className="text-[#c299ff]">
            Comment s'appelle ton entreprise ?
          </Label>
          <Input
            id="business_name"
            value={formData.business_name || ""}
            onChange={(e) => handleInputChange("business_name", e.target.value)}
            placeholder="Ex: Bobby Coaching"
            maxLength={100}
            className="bg-background/50 border-foreground/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_type" className="text-[#c299ff]">
            Quel type d'activité fais-tu ?
          </Label>
          <Select
            value={formData.business_type || ""}
            onValueChange={(value: BusinessType) =>
              handleInputChange("business_type", value)
            }
          >
            <SelectTrigger className="bg-background/50 border-foreground/20">
              <SelectValue placeholder="Choisis ton type d'activité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coach">Coach</SelectItem>
              <SelectItem value="consultant">Consultant</SelectItem>
              <SelectItem value="influencer">Influenceur</SelectItem>
              <SelectItem value="network_marketer">Network Marketer</SelectItem>
              <SelectItem value="online_trainer">Formateur en ligne</SelectItem>
              <SelectItem value="course_creator">Créateur de cours</SelectItem>
              <SelectItem value="freelancer">Freelance</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_audience" className="text-[#c299ff]">
          Qui sont tes clients idéaux ?
        </Label>
        <Textarea
          id="target_audience"
          value={formData.target_audience || ""}
          onChange={(e) => handleInputChange("target_audience", e.target.value)}
          placeholder="Ex: Des femmes entrepreneurs entre 30 et 45 ans, passionnées par le développement personnel..."
          maxLength={500}
          className="bg-background/50 border-foreground/20 min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="main_product" className="text-[#c299ff]">
          Quel est ton produit ou service principal ?
        </Label>
        <Input
          id="main_product"
          value={formData.main_product || ""}
          onChange={(e) => handleInputChange("main_product", e.target.value)}
          placeholder="Ex: Programme de coaching en ligne 'Réussite Entrepreneuriale'"
          maxLength={200}
          className="bg-background/50 border-foreground/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="product_description" className="text-[#c299ff]">
          Décris-nous un peu plus ce que tu proposes
        </Label>
        <Textarea
          id="product_description"
          value={formData.product_description || ""}
          onChange={(e) => handleInputChange("product_description", e.target.value)}
          placeholder="Ex: Programme de 12 semaines incluant des sessions de coaching hebdomadaires..."
          maxLength={1000}
          className="bg-background/50 border-foreground/20 min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price_range" className="text-[#c299ff]">
          Quel est ton ticket moyen ?
        </Label>
        <Input
          id="price_range"
          value={formData.price_range || ""}
          onChange={(e) => handleInputChange("price_range", e.target.value)}
          placeholder="Ex: 997$ - 2997$"
          maxLength={50}
          className="bg-background/50 border-foreground/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unique_value" className="text-[#c299ff]">
          Qu'est-ce qui te rend unique ? Pourquoi tes clients te choisissent ?
        </Label>
        <Textarea
          id="unique_value"
          value={formData.unique_value || ""}
          onChange={(e) => handleInputChange("unique_value", e.target.value)}
          placeholder="Ex: Ma méthode unique combine coaching personnalisé et outils pratiques..."
          maxLength={500}
          className="bg-background/50 border-foreground/20 min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="goals" className="text-[#c299ff]">
          Quels sont tes objectifs pour les 12 prochains mois ?
        </Label>
        <Textarea
          id="goals"
          value={formData.goals || ""}
          onChange={(e) => handleInputChange("goals", e.target.value)}
          placeholder="Ex: Aider 1000 entrepreneurs à atteindre 10k$/mois..."
          maxLength={500}
          className="bg-background/50 border-foreground/20 min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="challenges" className="text-[#c299ff]">
          Quels sont tes plus gros défis actuellement ?
        </Label>
        <Textarea
          id="challenges"
          value={formData.challenges || ""}
          onChange={(e) => handleInputChange("challenges", e.target.value)}
          placeholder="Ex: Augmenter ma visibilité sur les réseaux sociaux..."
          maxLength={500}
          className="bg-background/50 border-foreground/20 min-h-[100px]"
        />
      </div>
    </div>
  );
};