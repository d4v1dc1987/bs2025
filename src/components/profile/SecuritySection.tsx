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

      if (error) throw error;

      toast.success("Mot de passe mis à jour avec succès");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour du mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30 border-primary/20">
      <SecurityForm
        isLoading={isLoading}
        onSubmit={handlePasswordUpdate}
      />
    </Card>
  );
};