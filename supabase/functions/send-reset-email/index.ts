import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  resetLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetLink }: EmailRequest = await req.json();
    console.log("Processing reset request for:", email);

    if (!email || !resetLink) {
      throw new Error("Email and resetLink are required");
    }

    // Create a Supabase client with the service role key
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Generate a reset link
    const { data, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: resetLink,
      }
    });

    if (linkError) {
      console.error("Error generating reset link:", linkError);
      throw linkError;
    }

    const resetUrl = data.properties?.action_link;
    
    if (!resetUrl) {
      throw new Error("No reset URL generated");
    }

    console.log("Reset URL generated successfully");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Réinitialisation de mot de passe - Bobby Social</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #2a2a2a; border-radius: 8px; padding: 30px;">
            <h2 style="color: #ffffff; margin-bottom: 20px;">Reset Password</h2>
            
            <p style="color: #ffffff; margin-bottom: 30px; line-height: 1.6;">
              Follow this link to reset the password for your user:
            </p>
            
            <div style="text-align: left; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; padding: 10px 20px; background-color: transparent; color: #ffffff; text-decoration: none; border: 1px solid #ffffff; border-radius: 4px;">
                Reset Password
              </a>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log("Sending email via Resend...");

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
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(`Resend API error: ${error}`);
    }

    const data2 = await res.json();
    console.log("Email sent successfully:", data2);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in send-reset-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);