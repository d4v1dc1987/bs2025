import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BusinessProfile } from "../types";

interface BusinessDetailsProps {
  formData: BusinessProfile;
  handleInputChange: (field: keyof BusinessProfile, value: string | null) => void;
}

export const BusinessDetails = ({ formData, handleInputChange }: BusinessDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="industry" className="text-[#c299ff]">
          Dans quel domaine ou industrie ton entreprise évolue-t-elle?
        </Label>
        <Select
          value={formData.industry || ""}
          onValueChange={(value) => handleInputChange("industry", value)}
        >
          <SelectTrigger className="bg-background/50 border-foreground/20">
            <SelectValue placeholder="Choisis ton industrie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bien-etre">Bien-être et santé</SelectItem>
            <SelectItem value="coaching-personnel">Coaching personnel</SelectItem>
            <SelectItem value="coaching-business">Coaching business</SelectItem>
            <SelectItem value="marketing">Marketing digital</SelectItem>
            <SelectItem value="beaute">Beauté et cosmétiques</SelectItem>
            <SelectItem value="technologie">Technologie</SelectItem>
            <SelectItem value="education">Éducation et formation</SelectItem>
            <SelectItem value="finance">Finance et investissement</SelectItem>
            <SelectItem value="immobilier">Immobilier</SelectItem>
            <SelectItem value="e-commerce">E-commerce</SelectItem>
            <SelectItem value="alimentation">Alimentation et nutrition</SelectItem>
            <SelectItem value="sport">Sport et fitness</SelectItem>
            <SelectItem value="art-creativite">Art et créativité</SelectItem>
            <SelectItem value="developpement-personnel">Développement personnel</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_audience" className="text-[#c299ff]">
          Qui sont tes clients idéaux (ton audience cible)?
        </Label>
        <Textarea
          id="target_audience"
          value={formData.target_audience || ""}
          onChange={(e) => handleInputChange("target_audience", e.target.value)}
          placeholder="Décris ton audience cible"
          maxLength={1500}
          className="bg-background/50 border-foreground/20 min-h-[100px] text-sm"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Sois le plus précis possible : âge, profession, situation familiale, intérêts, besoins spécifiques.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="main_product" className="text-[#c299ff]">
          Quel produit ou service proposes-tu principalement?
        </Label>
        <Textarea
          id="main_product"
          value={formData.main_product || ""}
          onChange={(e) => handleInputChange("main_product", e.target.value)}
          placeholder="Ton produit ou service principal"
          maxLength={200}
          className="bg-background/50 border-foreground/20 text-sm"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Exemple : produits de santé, outils pour réseaux sociaux, formations en ligne
        </p>
      </div>
    </div>
  );
};