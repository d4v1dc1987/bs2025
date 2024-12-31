import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { BusinessProfile } from "../types";

interface CompanyInfoProps {
  formData: BusinessProfile;
  handleInputChange: (field: keyof BusinessProfile, value: string | null) => void;
}

export const CompanyInfo = ({ formData, handleInputChange }: CompanyInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="company_age" className="text-[#c299ff]">
          Depuis combien de temps ton entreprise est-elle active?
        </Label>
        <Input
          id="company_age"
          value={formData.company_age || ""}
          onChange={(e) => handleInputChange("company_age", e.target.value)}
          placeholder="L'âge de ton entreprise"
          maxLength={50}
          className="bg-background/50 border-foreground/20 text-sm"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Exemple : moins d'un an, 1-3 ans, plus de 5 ans
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company_story" className="text-[#c299ff]">
          Quelle est l'histoire ou la mission derrière ton entreprise?
        </Label>
        <Textarea
          id="company_story"
          value={formData.company_story || ""}
          onChange={(e) => handleInputChange("company_story", e.target.value)}
          placeholder="L'histoire de ton entreprise"
          maxLength={1000}
          className="bg-background/50 border-foreground/20 min-h-[100px] text-sm"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Exemple : aider les gens à se sentir mieux, proposer des solutions simples et accessibles
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company_values" className="text-[#c299ff]">
          Quelles sont les valeurs importantes de ton entreprise?
        </Label>
        <Textarea
          id="company_values"
          value={formData.company_values || ""}
          onChange={(e) => handleInputChange("company_values", e.target.value)}
          placeholder="Les valeurs de ton entreprise"
          maxLength={500}
          className="bg-background/50 border-foreground/20 min-h-[100px] text-sm"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Exemple : qualité, transparence, innovation, respect de l'environnement
        </p>
      </div>
    </div>
  );
};