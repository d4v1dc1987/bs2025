import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

interface EmailRequest {
  email: string;
  resetLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetLink }: EmailRequest = await req.json();

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Réinitialisation de mot de passe - Bobby Social</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 0; text-align: center; background-color: #7b27fb;">
                <h1 style="color: white; margin: 0;">Bobby Social</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 20px; background-color: white;">
                <div style="max-width: 600px; margin: 0 auto; text-align: center;">
                  <h2 style="color: #333; margin-bottom: 20px;">Réinitialisation de votre mot de passe</h2>
                  <p style="color: #666; margin-bottom: 30px;">
                    Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
                  </p>
                  <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #7b27fb; color: white; text-decoration: none; border-radius: 4px; margin-bottom: 30px;">
                    Réinitialiser mon mot de passe
                  </a>
                  <p style="color: #999; font-size: 12px;">
                    Si vous n'avez pas demandé la réinitialisation de votre mot de passe, vous pouvez ignorer cet email.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; text-align: center; background-color: #f8f8f8;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  © 2024 Bobby Social. Tous droits réservés.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Bobby Social <noreply@bobbysocial.com>",
        to: [email],
        subject: "Réinitialisation de votre mot de passe - Bobby Social",
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to send email");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);