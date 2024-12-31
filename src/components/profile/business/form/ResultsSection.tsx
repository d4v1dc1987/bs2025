import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BusinessProfile } from "../types";

interface ResultsSectionProps {
  formData: BusinessProfile;
  handleInputChange: (field: keyof BusinessProfile, value: string | null) => void;
}

export const ResultsSection = ({ formData, handleInputChange }: ResultsSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="problem_solved" className="text-[#c299ff]">
          Quels problèmes ton produit ou service aide-t-il à résoudre?
        </Label>
        <Textarea
          id="problem_solved"
          value={formData.problem_solved || ""}
          onChange={(e) => handleInputChange("problem_solved", e.target.value)}
          placeholder="Les problèmes que tu résous"
          maxLength={500}
          className="bg-background/50 border-foreground/20 min-h-[100px] text-sm"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Exemple : fatigue, besoin de revenus supplémentaires, organisation, etc.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goals" className="text-[#c299ff]">
          Quel est l'objectif principal de ton entreprise?
        </Label>
        <Textarea
          id="goals"
          value={formData.goals || ""}
          onChange={(e) => handleInputChange("goals", e.target.value)}
          placeholder="L'objectif de ton entreprise"
          maxLength={500}
          className="bg-background/50 border-foreground/20 min-h-[100px] text-sm"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Exemple : aider les gens à économiser, à être en meilleure santé, à réussir en ligne
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="client_results" className="text-[#c299ff]">
          Quels sont les résultats que tes clients peuvent obtenir grâce à ton produit ou service?
        </Label>
        <Textarea
          id="client_results"
          value={formData.client_results || ""}
          onChange={(e) => handleInputChange("client_results", e.target.value)}
          placeholder="Les résultats obtenus par tes clients"
          maxLength={500}
          className="bg-background/50 border-foreground/20 min-h-[100px] text-sm"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Exemple : plus d'énergie, plus de revenus, meilleure santé, plus de temps libre
        </p>
      </div>
    </div>
  );
};