import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user && !location.pathname.includes('/update-password')) {
      navigate("/auth?mode=login");
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (!loading && (user || location.pathname.includes('/update-password'))) ? <>{children}</> : null;
};