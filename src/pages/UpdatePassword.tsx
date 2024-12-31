import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordUpdate = async (values: { password: string }) => {
    try {
      setIsLoading(true);
      console.log("Attempting to update password...");

      const searchParams = new URLSearchParams(location.search);
      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (!token_hash || !type) {
        console.error("No token_hash or type found in URL");
        toast.error("Lien invalide. Veuillez réessayer.");
        navigate("/auth?mode=reset");
        return;
      }

      // First verify the token hash
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash,
        type: "recovery",
      });

      if (verifyError) {
        console.error("Error verifying token:", verifyError);
        toast.error("Le lien a expiré ou est invalide. Veuillez réessayer.");
        navigate("/auth?mode=reset");
        return;
      }

      // If verification successful, update the password
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });

      if (error) {
        console.error("Error updating password:", error);
        toast.error("Une erreur est survenue lors de la mise à jour du mot de passe");
        return;
      }

      console.log("Password updated successfully");
      
      // Sign out the user
      await supabase.auth.signOut();
      
      // Show success message and redirect to login
      toast.success("Votre mot de passe a été mis à jour avec succès. Veuillez vous reconnecter avec votre nouveau mot de passe.", {
        duration: 5000
      });
      
      // Redirect to login page after a short delay to ensure the toast is visible
      setTimeout(() => {
        navigate("/auth?mode=login");
      }, 1000);
      
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