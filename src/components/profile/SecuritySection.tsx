import { Card } from "@/components/ui/card";
import { SecurityForm } from "@/components/profile/SecurityForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { PasswordFormValues } from "@/schemas/passwordSchema";

interface SecuritySectionProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const SecuritySection = ({ isLoading, setIsLoading }: SecuritySectionProps) => {
  const handlePasswordUpdate = async (values: PasswordFormValues) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        if (error.message.includes("auth")) {
          throw new Error("Erreur d'authentification. Veuillez vous reconnecter.");
        }
        throw error;
      }

      toast.success("Mot de passe mis à jour avec succès");
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Erreur lors de la mise à jour du mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Sécurité</h2>
        <p className="text-muted-foreground">
          Gérez votre mot de passe et la sécurité de votre compte
        </p>
      </div>

      <Card className="p-8 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30 border-primary/20">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Modifier le mot de passe</h3>
            <p className="text-sm text-muted-foreground">
              Choisissez un mot de passe fort pour protéger votre compte. Il doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.
            </p>
          </div>

          <SecurityForm
            isLoading={isLoading}
            onSubmit={handlePasswordUpdate}
          />
        </div>
      </Card>
    </div>
  );
};