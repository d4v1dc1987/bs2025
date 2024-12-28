import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PasswordStrength } from "@/components/auth/PasswordStrength";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Bobby Social</h2>
          <p className="mt-2 text-muted-foreground">
            {mode === "login" 
              ? "Connectez-vous à votre compte" 
              : "Créez votre compte"}
          </p>
        </div>
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#D4AF37",
                  brandAccent: "#B8960C",
                },
              },
            },
          }}
          theme="dark"
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Mot de passe",
                button_label: "Se connecter",
              },
              sign_up: {
                email_label: "Email",
                password_label: "Mot de passe",
                button_label: "Créer un compte",
              },
            },
          }}
          view={mode === "login" ? "sign_in" : "sign_up"}
        />
      </div>
    </div>
  );
};

export default Auth;