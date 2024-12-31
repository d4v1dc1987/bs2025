import { supabase } from "@/integrations/supabase/client";

export const initiatePasswordReset = async (email: string) => {
  try {
    console.log("Starting password reset process for:", email);
    
    const redirectUrl = `${window.location.origin}/update-password`;
    console.log("Redirect URL:", redirectUrl);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      console.error("Reset password error:", error);
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Reset password error:", error);
    throw new Error(
      error.message || "Une erreur est survenue lors de l'envoi de l'email"
    );
  }
};