import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OnboardingProvider } from "@/components/onboarding/OnboardingContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Generator from "@/pages/Generator";
import Profile from "@/pages/Profile";
import ResetPassword from "@/pages/ResetPassword";
import UpdatePassword from "@/pages/UpdatePassword";
import Close from "@/pages/Close";
import Comment from "@/pages/Comment";
import Reply from "@/pages/Reply";
import Calendar from "@/pages/Calendar";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={user ? <Navigate to="/dashboard" /> : <Index />} />
        <Route path="auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="update-password" element={<UpdatePassword />} />
      </Route>

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="generator" element={<Generator />} />
        <Route path="profile" element={<Profile />} />
        <Route path="close" element={<Close />} />
        <Route path="comment" element={<Comment />} />
        <Route path="reply" element={<Reply />} />
        <Route path="calendar" element={<Calendar />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <OnboardingProvider>
            <AppRoutes />
            <Toaster />
          </OnboardingProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;