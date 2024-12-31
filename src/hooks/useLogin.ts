import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthError } from "@supabase/supabase-js";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  error?: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async ({ email, password }: LoginCredentials): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      console.log("Tentative de connexion pour:", email);
      
      // Nettoyage des entrées
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
      
      console.log("Envoi de la requête à Supabase...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error) {
        console.error("Erreur Supabase:", {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        // Gestion spécifique des erreurs d'authentification
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou mot de passe incorrect");
          return { success: false, error: "credentials" };
        }
        
        if (error.message.includes("Email not confirmed")) {
          toast.error("Veuillez confirmer votre email avant de vous connecter");
          return { success: false, error: "email_not_confirmed" };
        }
        
        // Erreur par défaut
        toast.error("Une erreur est survenue lors de la connexion");
        return { success: false, error: "unknown" };
      }

      console.log("Connexion réussie pour:", cleanEmail);
      return { success: true };
      
    } catch (error: any) {
      console.error("Erreur inattendue lors de la connexion:", error);
      toast.error("Une erreur inattendue est survenue");
      return { success: false, error: "unexpected" };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};