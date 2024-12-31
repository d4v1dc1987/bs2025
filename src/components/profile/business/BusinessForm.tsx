import React from 'react';
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
import { BusinessOwnership } from "./form/BusinessOwnership";
import type { BusinessProfile } from "./types";

interface BusinessFormProps {
  formData: BusinessProfile;
  handleInputChange: (field: keyof BusinessProfile, value: string | null) => void;
}

export const BusinessForm = ({ formData, handleInputChange }: BusinessFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-6 flex flex-col">
        <div className="space-y-2">
          <Label htmlFor="business_name" className="text-[#c299ff]">
            Quel est le nom de ton entreprise ou de la compagnie que tu représentes?
          </Label>
          <Input
            id="business_name"
            value={formData.business_name || ""}
            onChange={(e) => handleInputChange("business_name", e.target.value)}
            placeholder="Nom de ton entreprise"
            maxLength={100}
            className="bg-background/50 border-foreground/20 text-sm"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Exemple : Melaleuca, ta propre entreprise, ou autre.
          </p>
        </div>

        <BusinessOwnership
          value={formData.business_ownership}
          onChange={(value) => handleInputChange("business_ownership", value)}
        />

        <div className="space-y-2">
          <Label htmlFor="business_type" className="text-[#c299ff]">
            Quel est ton type d'activité?
          </Label>
          <Select
            value={formData.business_type || ""}
            onValueChange={(value) =>
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
        <Label htmlFor="main_product" className="text-[#c299ff]">
          Quel produit ou service proposes-tu principalement?
        </Label>
        <Input
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
          Sois le plus précis possible : âge, profession, situation familiale, intérêts, besoins spécifiques. Par exemple : "femmes de 25-40 ans, mères de famille, intéressées par le bien-être et les produits naturels"
        </p>
      </div>

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