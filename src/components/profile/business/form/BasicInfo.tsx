import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BusinessOwnership } from "./BusinessOwnership";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BusinessProfile } from "../types";

interface BasicInfoProps {
  formData: BusinessProfile;
  handleInputChange: (field: keyof BusinessProfile, value: string | null) => void;
}

export const BasicInfo = ({ formData, handleInputChange }: BasicInfoProps) => {
  return (
    <div className="space-y-6">
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
          onValueChange={(value) => handleInputChange("business_type", value)}
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
  );
};