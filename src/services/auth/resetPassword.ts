import { supabase } from "@/integrations/supabase/client";

export const initiatePasswordReset = async (email: string) => {
  try {
    console.log("Starting password reset process for:", email);

    // 1. Call Supabase's reset password function with the correct redirect URL
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/update-password`,
      }
    );

    if (resetError) {
      if (resetError.message.includes("rate_limit") || resetError.status === 429) {
        throw new Error("Veuillez patienter quelques secondes avant de réessayer");
      }
      throw resetError;
    }

    // 2. Send the email via our edge function
    const { data, error: functionError } = await supabase.functions.invoke('send-reset-email', {
      body: { 
        email,
        resetLink: `${window.location.origin}/update-password`
      },
    });

    if (functionError) {
      console.error("Edge function error:", functionError);
      throw new Error("Une erreur est survenue lors de l'envoi de l'email");
    }

    if (!data?.success) {
      throw new Error("Une erreur est survenue lors de l'envoi de l'email");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Reset password error:", error);
    throw new Error(error.message || "Une erreur est survenue lors de l'envoi de l'email");
  }
};