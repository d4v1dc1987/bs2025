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
      
      // Nettoyage et validation des entrées
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

      console.log("Tentative de connexion avec:", cleanEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (error) {
        console.error("Erreur d'authentification:", {
          name: error.name,
          message: error.message,
          status: error.status
        });

        if (error.message.includes("Invalid login credentials")) {
          return {
            success: false,
            error: {
              code: "invalid_credentials",
              message: "Email ou mot de passe incorrect"
            }
          };
        }

        if (error.message.includes("Email not confirmed")) {
          return {
            success: false,
            error: {
              code: "email_not_confirmed",
              message: "Veuillez confirmer votre email avant de vous connecter"
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
        console.error("Session manquante après connexion réussie");
        return {
          success: false,
          error: {
            code: "no_session",
            message: "Erreur lors de la création de la session"
          }
        };
      }

      console.log("Connexion réussie pour:", cleanEmail);
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