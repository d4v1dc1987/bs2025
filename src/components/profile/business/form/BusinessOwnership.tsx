import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BusinessProfile } from "../types";

interface BusinessOwnershipProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export const BusinessOwnership = ({ value, onChange }: BusinessOwnershipProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="business_ownership" className="text-[#c299ff]">
        Cette entreprise est-elle la tienne ou la représentes-tu simplement?
      </Label>
      <Select
        value={value || ""}
        onValueChange={(value) => onChange(value)}
      >
        <SelectTrigger className="bg-background/50 border-foreground/20">
          <SelectValue placeholder="Choisis ton type de relation avec l'entreprise" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="own_business">C'est ma propre entreprise</SelectItem>
          <SelectItem value="affiliate">Je fais la promo en tant qu'affilié, représentant, etc.</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};