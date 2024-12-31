import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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
    console.log("Sending reset email to:", email);
    console.log("Reset link:", resetLink);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Réinitialisation de mot de passe - Bobby Social</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #403E43;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 0; text-align: center; background-color: #7b27fb;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Bobby Social</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                  <h2 style="color: #7b27fb; margin-bottom: 20px; text-align: center; font-size: 24px;">
                    Réinitialisation de votre mot de passe
                  </h2>
                  <p style="color: #403E43; margin-bottom: 30px; line-height: 1.6; font-size: 16px;">
                    Bonjour,<br><br>
                    Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Bobby Social. 
                    Pour procéder à la réinitialisation, cliquez sur le bouton ci-dessous.
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" 
                       style="display: inline-block; padding: 14px 28px; background-color: #7b27fb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                      Réinitialiser mon mot de passe
                    </a>
                  </div>
                  <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center; line-height: 1.6;">
                    Si vous n'avez pas demandé la réinitialisation de votre mot de passe, vous pouvez ignorer cet email.<br>
                    Ce lien expirera dans 24 heures pour des raisons de sécurité.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; text-align: center; background-color: #f8f8f8;">
                <p style="color: #666; font-size: 12px; margin: 0;">
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
    console.error("Error sending reset email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);