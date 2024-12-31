import { supabase } from "@/integrations/supabase/client";

export const initiatePasswordReset = async (email: string) => {
  try {
    console.log("Starting password reset process for:", email);

    // 1. Désactiver complètement l'email automatique de Supabase
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (resetError) {
      if (resetError.message.includes("rate_limit") || resetError.status === 429) {
        throw new Error("Veuillez patienter quelques secondes avant de réessayer");
      }
      throw resetError;
    }

    // 2. Envoyer l'email via notre edge function
    const response = await supabase.functions.invoke('send-reset-email', {
      body: { 
        email,
        resetLink: `${window.location.origin}/update-password`
      },
    });

    if (response.error) throw response.error;

    return { success: true };
  } catch (error: any) {
    console.error("Reset password error:", error);
    throw new Error(error.message || "Une erreur est survenue lors de l'envoi de l'email");
  }
};