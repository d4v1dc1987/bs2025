import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { OnboardingProvider } from "./components/onboarding/OnboardingContext";
import Index from "./pages/Index";
import Generator from "./pages/Generator";
import Comment from "./pages/Comment";
import Reply from "./pages/Reply";
import Calendar from "./pages/Calendar";
import Close from "./pages/Close";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <OnboardingProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {isAuthenticated ? (
              <MainLayout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/generator" element={<Generator />} />
                  <Route path="/comment" element={<Comment />} />
                  <Route path="/reply" element={<Reply />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/close" element={<Close />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </MainLayout>
            ) : (
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/auth/update-password" element={<UpdatePassword />} />
                <Route path="*" element={<Navigate to="/auth" replace />} />
              </Routes>
            )}
          </BrowserRouter>
        </OnboardingProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;