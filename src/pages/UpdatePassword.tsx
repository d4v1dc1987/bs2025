import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          toast.error("Session invalide. Veuillez réessayer.");
          navigate("/auth?mode=login");
          return;
        }

        if (!session) {
          const params = new URLSearchParams(window.location.search);
          if (!params.get("token") || params.get("type") !== "recovery") {
            console.error("No valid recovery token found");
            toast.error("Lien invalide. Veuillez réessayer.");
            navigate("/auth?mode=login");
            return;
          }
        }

        setIsValidSession(true);
      } catch (error) {
        console.error("Session validation error:", error);
        toast.error("Une erreur est survenue. Veuillez réessayer.");
        navigate("/auth?mode=login");
      }
    };

    checkSession();
  }, [navigate]);

  const handlePasswordUpdate = async (values: { password: string }) => {
    try {
      setIsLoading(true);
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.password
      });

      if (updateError) {
        console.error("Error updating password:", updateError);
        toast.error("Une erreur est survenue lors de la mise à jour du mot de passe");
        return;
      }

      // Déconnecter l'utilisateur
      await supabase.auth.signOut();
      
      // Afficher la confirmation
      setIsSuccess(true);
      
    } catch (error: any) {
      console.error("Caught error:", error);
      toast.error(error.message || "Une erreur est survenue lors de la mise à jour du mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidSession) {
    return null;
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/background.jpg')] bg-cover bg-center bg-fixed">
        <div className="w-full max-w-md mx-auto p-6">
          <div className="rounded-lg backdrop-blur-sm bg-background/80 p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-4">
                <FontAwesomeIcon icon={faBolt} className="text-[#7b27fb] text-4xl" />
                <h1 className="text-4xl font-bold text-white">Bobby Social</h1>
              </div>
              <p className="text-foreground/80 mt-4">
                Votre mot de passe a été mis à jour avec succès !
              </p>
            </div>
            <Button 
              onClick={() => navigate("/auth?mode=login")}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Se connecter avec le nouveau mot de passe
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/background.jpg')] bg-cover bg-center bg-fixed">
      <div className="w-full max-w-md mx-auto p-6">
        <div className="rounded-lg backdrop-blur-sm bg-background/80 p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-4">
              <FontAwesomeIcon icon={faBolt} className="text-[#7b27fb] text-4xl" />
              <h1 className="text-4xl font-bold text-white">Bobby Social</h1>
            </div>
            <p className="text-foreground/80 mt-4">Nouveau mot de passe</p>
          </div>

          <UpdatePasswordForm 
            onSubmit={handlePasswordUpdate}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;