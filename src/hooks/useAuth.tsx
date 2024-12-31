import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const forceClearAuth = () => {
    localStorage.removeItem("sb-jxqeoenhiqdtzzqbjwqz-auth-token");
    sessionStorage.removeItem("sb-jxqeoenhiqdtzzqbjwqz-auth-token");
    setUser(null);
    navigate("/auth?mode=login");
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          forceClearAuth();
          return;
        }

        if (session?.user) {
          setUser(session.user);
          if (location.pathname === "/" || location.pathname === "/auth") {
            navigate("/dashboard");
          }
        } else {
          setUser(null);
          if (!location.pathname.includes('/auth') && 
              !location.pathname.includes('/reset-password') && 
              !location.pathname.includes('/update-password')) {
            navigate("/auth?mode=login");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        forceClearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === "SIGNED_OUT") {
        forceClearAuth();
      } else if (event === "SIGNED_IN") {
        if (session?.user) {
          setUser(session.user);
          if (location.pathname === "/" || location.pathname === "/auth") {
            navigate("/dashboard");
          }
        } else {
          setUser(null);
          navigate("/auth?mode=login");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      forceClearAuth();
      toast.success("Déconnexion réussie");
    } catch (error: any) {
      console.error("Logout error:", error);
      forceClearAuth();
      toast.success("Session terminée");
    }
  };

  return {
    user,
    loading,
    signOut,
  };
};