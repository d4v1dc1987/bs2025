import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async ({ email, password }: LoginCredentials) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        handleLoginError(error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error: any) {
      console.error("Erreur inattendue lors de la connexion:", error);
      toast.error("Une erreur inattendue est survenue");
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = (error: any) => {
    console.error("Erreur de connexion:", error);
    
    if (error.message === "Invalid login credentials") {
      toast.error("Email ou mot de passe incorrect");
      return;
    }
    
    if (error.message.includes("Email not confirmed")) {
      toast.error("Veuillez confirmer votre email avant de vous connecter");
      return;
    }
    
    toast.error("Une erreur est survenue lors de la connexion");
  };

  return { login, isLoading };
};