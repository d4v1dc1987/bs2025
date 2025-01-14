import { useState } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { initiatePasswordReset } from "@/services/auth/resetPassword";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (values: { email: string }) => {
    try {
      setIsLoading(true);
      await initiatePasswordReset(values.email);
      toast.success("Un email de réinitialisation vous a été envoyé");
      navigate("/auth?mode=login");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error.message || "Une erreur est survenue");
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
            <p className="text-foreground/80 mt-4">
              Réinitialisation du mot de passe
            </p>
          </div>

          <ResetPasswordForm 
            onSubmit={handleResetPassword}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;