import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Vérifier si nous sommes sur une page d'authentification ou de réinitialisation
    const isAuthPage = location.pathname.includes('/auth');
    const isPasswordReset = location.pathname.includes('/reset-password') || 
                          location.pathname.includes('/update-password');
                      
    // Ne rediriger que si l'utilisateur n'est pas authentifié et n'est pas sur une page d'authentification
    if (!loading && !user && !isAuthPage && !isPasswordReset) {
      navigate("/auth?mode=login");
    }
  }, [user, loading, navigate, location.pathname]);

  // Pendant le chargement, ne rien afficher
  if (loading) {
    return null;
  }

  // Permettre l'accès aux pages de réinitialisation sans authentification
  const isAuthPage = location.pathname.includes('/auth');
  const isPasswordReset = location.pathname.includes('/reset-password') || 
                         location.pathname.includes('/update-password');

  return (!loading && (user || isAuthPage || isPasswordReset)) ? <>{children}</> : null;
};