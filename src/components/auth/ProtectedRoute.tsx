import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Si nous sommes sur la page de mise à jour du mot de passe, vérifier le token
    if (location.pathname === '/update-password') {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      const type = params.get("type");

      // Si nous avons un token valide, permettre l'accès
      if (token && type === "recovery") {
        return;
      }
    }

    // Liste des routes publiques
    const publicRoutes = ['/auth', '/reset-password'];
    const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route));

    // Rediriger vers la page de connexion si nécessaire
    if (!loading && !user && !isPublicRoute) {
      navigate("/auth?mode=login");
    }
  }, [user, loading, navigate, location]);

  // Pendant le chargement, ne rien afficher
  if (loading) {
    return null;
  }

  return <>{children}</>;
};