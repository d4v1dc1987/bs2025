import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthError } from "@supabase/supabase-js";

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginError = (error: AuthError) => {
    console.error("Erreur de connexion:", error);
    
    switch (error.message) {
      case "Invalid login credentials":
        toast.error("Email ou mot de passe incorrect");
        break;
      case "Email not confirmed":
        toast.error("Veuillez confirmer votre email avant de vous connecter");
        break;
      default:
        toast.error("Une erreur est survenue lors de la connexion");
    }
  };

  const login = async ({ email, password }: LoginCredentials) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
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