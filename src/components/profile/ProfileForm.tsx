import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProfileFormProps {
  formData: {
    first_name: string;
    last_name: string;
    email?: string;
  };
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: string) => void;
}

export const ProfileForm = ({
  formData,
  isLoading,
  onSubmit,
  onChange,
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="first_name" className="text-[#c299ff]">
            Prénom
          </Label>
          <Input
            id="first_name"
            value={formData.first_name || ""}
            onChange={(e) => onChange("first_name", e.target.value)}
            placeholder="Entrez votre prénom"
            className="bg-background/50 border-foreground/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name" className="text-[#c299ff]">
            Nom
          </Label>
          <Input
            id="last_name"
            value={formData.last_name || ""}
            onChange={(e) => onChange("last_name", e.target.value)}
            placeholder="Entrez votre nom"
            className="bg-background/50 border-foreground/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#c299ff]">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ""}
          disabled
          className="bg-muted border-foreground/20"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sauvegarder les modifications
        </Button>
      </div>
    </form>
  );
};