import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      console.error("No hash found in URL");
      toast.error("Lien invalide. Veuillez réessayer.");
      navigate("/auth?mode=reset");
      return;
    }

    const token = hash.split("=")[1];
    if (!token) {
      console.error("No token found in hash");
      toast.error("Lien invalide. Veuillez réessayer.");
      navigate("/auth?mode=reset");
      return;
    }

    // Vérifier la validité du token
    const verifyToken = async () => {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'recovery',
        });

        if (error) {
          console.error("Error verifying token:", error);
          toast.error("Le lien a expiré. Veuillez réessayer.");
          navigate("/auth?mode=reset");
          return;
        }

        console.log("Token verified successfully:", data);
      } catch (error) {
        console.error("Error in token verification:", error);
        toast.error("Une erreur est survenue. Veuillez réessayer.");
        navigate("/auth?mode=reset");
      }
    };

    verifyToken();
  }, [navigate]);

  const handlePasswordUpdate = async (values: { password: string }) => {
    try {
      setIsLoading(true);
      console.log("Attempting to update password...");

      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        console.error("Error updating password:", error);
        
        if (error.message.includes("auth")) {
          toast.error("Erreur d'authentification. Le lien a peut-être expiré, veuillez réessayer.");
          navigate("/auth?mode=reset");
          return;
        }
        
        throw error;
      }

      console.log("Password updated successfully");
      toast.success("Votre mot de passe a été mis à jour");
      navigate("/auth?mode=login");
    } catch (error: any) {
      console.error("Caught error:", error);
      toast.error(error.message || "Une erreur est survenue lors de la mise à jour du mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

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