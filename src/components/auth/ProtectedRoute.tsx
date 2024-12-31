import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuthPage = location.pathname.includes('/auth') || 
                      location.pathname.includes('/reset-password') || 
                      location.pathname.includes('/update-password');
                      
    if (!loading && !user && !isAuthPage) {
      navigate("/auth?mode=login");
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading) {
    return null; // Or a loading spinner
  }

  const isAuthPage = location.pathname.includes('/auth') || 
                    location.pathname.includes('/reset-password') || 
                    location.pathname.includes('/update-password');

  return (!loading && (user || isAuthPage)) ? <>{children}</> : null;
};