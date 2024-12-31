import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async ({ email, password }: LoginCredentials): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
      
      if (!cleanEmail || !cleanPassword) {
        return {
          success: false,
          error: {
            code: "missing_credentials",
            message: "Veuillez remplir tous les champs"
          }
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (error) {
        console.error("Erreur d'authentification:", error);

        if (error.message.includes("Invalid login credentials")) {
          return {
            success: false,
            error: {
              code: "invalid_credentials",
              message: "Email ou mot de passe incorrect"
            }
          };
        }

        return {
          success: false,
          error: {
            code: "unknown_error",
            message: "Une erreur est survenue lors de la connexion"
          }
        };
      }

      if (!data.session) {
        return {
          success: false,
          error: {
            code: "no_session",
            message: "Erreur lors de la création de la session"
          }
        };
      }

      return { success: true };
      
    } catch (error) {
      console.error("Erreur inattendue:", error);
      return {
        success: false,
        error: {
          code: "unexpected_error",
          message: "Une erreur inattendue est survenue"
        }
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};