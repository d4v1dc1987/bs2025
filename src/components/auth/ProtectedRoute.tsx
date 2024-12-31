import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Stocker l'URL actuelle pour rediriger après la connexion
      const returnUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`/auth?mode=login&returnUrl=${returnUrl}`);
    }
  }, [user, loading, navigate, location]);

  // Pendant le chargement, ne rien afficher
  if (loading) {
    return null;
  }

  return <>{children}</>;
};