import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/background.jpg')] bg-cover bg-center bg-fixed">
      <div className="w-full max-w-md mx-auto p-6">
        <div className="rounded-lg backdrop-blur-sm bg-background/80 p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-4">
              <FontAwesomeIcon icon={faBolt} className="text-[#7b27fb] text-4xl" />
              <h1 className="text-4xl font-bold text-white">
                Bobby Social
              </h1>
            </div>
            <p className="text-foreground/80 mt-4">
              {mode === "login"
                ? "L'outil IA Ultime Des Entrepreneurs En Ligne Pour Dominer Facebook"
                : "Créer un nouveau compte"}
            </p>
          </div>

          {mode === "login" ? <LoginForm /> : <SignUpForm />}
        </div>
      </div>
    </div>
  );
};

export default Auth;