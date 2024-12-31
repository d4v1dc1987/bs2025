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
  data?: any;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginError = (error: AuthError) => {
    console.error("Erreur de connexion:", error);
    
    // Gestion spécifique des erreurs d'authentification
    if (error.message.includes("Invalid login credentials")) {
      toast.error("Email ou mot de passe incorrect");
      return;
    }
    
    if (error.message.includes("Email not confirmed")) {
      toast.error("Veuillez confirmer votre email avant de vous connecter");
      return;
    }
    
    // Erreur par défaut
    toast.error("Une erreur est survenue lors de la connexion");
  };

  const login = async ({ email, password }: LoginCredentials): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        handleLoginError(error);
        return { success: false };
      }

      return { success: true, data };
    } catch (error: any) {
      console.error("Erreur inattendue lors de la connexion:", error);
      toast.error("Une erreur inattendue est survenue");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};