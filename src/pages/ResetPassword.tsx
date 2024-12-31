import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const resetSchema = z.object({
  email: z.string().email("Email invalide"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ResetFormValues) => {
    try {
      setIsLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        emailRedirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        // Gestion spécifique de l'erreur de rate limit
        if (error.message.includes("rate_limit") || error.status === 429) {
          toast.error("Veuillez patienter quelques secondes avant de réessayer");
          return;
        }
        throw error;
      }

      // Appel à notre fonction Edge pour envoyer l'email personnalisé
      const resetLink = `${window.location.origin}/update-password`;
      const response = await supabase.functions.invoke('send-reset-email', {
        body: { email: values.email, resetLink },
      });

      if (response.error) throw response.error;

      toast.success("Un email de réinitialisation vous a été envoyé");
      navigate("/auth?mode=login");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error("Une erreur est survenue lors de l'envoi de l'email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/background.jpg')] bg-cover bg-center bg-fixed">
      <div className="w-full max-w-md mx-auto p-6">
        <div className="rounded-lg backdrop-blur-sm bg-background/80 p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-4">
              <FontAwesomeIcon icon={faBolt} className="text-[#7b27fb] text-4xl" />
              <h1 className="text-4xl font-bold text-white">
                Bobby Social
              </h1>
            </div>
            <p className="text-foreground/80 mt-4">
              Réinitialisation du mot de passe
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/90">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="votre@email.com"
                        className="bg-background/50 border-foreground/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Envoi en cours..." : "Réinitialiser le mot de passe"}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-[#c299ff] hover:text-[#c299ff]/90"
                  onClick={() => navigate("/auth?mode=login")}
                >
                  Retour à la connexion
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;