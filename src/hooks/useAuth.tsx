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

  // Function to force clear all Supabase auth data
  const forceClearAuth = () => {
    localStorage.removeItem("sb-jxqeoenhiqdtzzqbjwqz-auth-token");
    sessionStorage.removeItem("sb-jxqeoenhiqdtzzqbjwqz-auth-token");
    setUser(null);
    navigate("/auth?mode=login");
  };

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error);
          forceClearAuth();
          return;
        }
        
        // Only set user if we have a session
        if (session?.user) {
          setUser(session.user);
          // Only redirect to dashboard if not on auth-related pages and not handling password reset
          if (!location.pathname.includes('/auth') && 
              !location.pathname.includes('/reset-password') && 
              !location.pathname.includes('/update-password')) {
            navigate("/dashboard");
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        forceClearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === "SIGNED_OUT" || (event === "TOKEN_REFRESHED" && !session)) {
        forceClearAuth();
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setUser(session?.user ?? null);
        // Only redirect to dashboard if not on auth-related pages and not handling password reset
        if (!location.pathname.includes('/auth') && 
            !location.pathname.includes('/reset-password') && 
            !location.pathname.includes('/update-password')) {
          if (event === "SIGNED_IN") {
            navigate("/dashboard");
          }
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
      if (error) {
        if (error.status === 403 || error.message.includes("user_not_found")) {
          console.log("Forcing auth clear due to deleted user");
          forceClearAuth();
          toast.success("Session terminée");
          return;
        }
        throw error;
      }
      
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