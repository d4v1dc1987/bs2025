import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Cleanup function for ResizeObserver
  useEffect(() => {
    return () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          // This empty callback will help flush any pending observations
        });
      });
    };
  }, []);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        // Gérer spécifiquement les différents types d'erreurs
        if (error.message === "Invalid login credentials") {
          toast.error("Email ou mot de passe incorrect");
          return;
        }
        if (error.message.includes("Email not confirmed")) {
          toast.error("Veuillez confirmer votre email avant de vous connecter");
          return;
        }
        // Pour toute autre erreur
        toast.error("Une erreur est survenue lors de la connexion");
        console.error("Erreur de connexion:", error);
        return;
      }

      // Si la connexion réussit
      const returnUrl = searchParams.get("returnUrl");
      if (returnUrl) {
        navigate(decodeURIComponent(returnUrl));
      } else {
        navigate("/dashboard");
      }
      
    } catch (error: any) {
      console.error("Erreur inattendue:", error);
      toast.error("Une erreur inattendue est survenue");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/90">
                  Identifiant ou e-mail
                </FormLabel>
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/90">Mot de passe</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="bg-background/50 border-foreground/20 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal cursor-pointer">
                  Se souvenir de moi
                </FormLabel>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          Connexion
        </Button>

        <div className="text-center space-y-4">
          <Button
            type="button"
            variant="link"
            className="text-sm text-[#c299ff] hover:text-[#c299ff]/90"
            onClick={() => navigate("/reset-password")}
          >
            Mot de passe oublié?
          </Button>
          
          <div className="flex flex-col items-center space-y-1 text-sm">
            <span className="text-foreground/70">Pas encore de compte?</span>
            <Button
              type="button"
              variant="link"
              className="text-[#c299ff] hover:text-[#c299ff]/90 p-0"
              onClick={() => navigate("/auth?mode=signup")}
            >
              Créer un compte
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};