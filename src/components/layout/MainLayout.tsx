import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/sidebar/Sidebar";
import { SidebarProvider } from "@/components/layout/sidebar/SidebarContext";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const MainLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth" || 
                    location.pathname === "/reset-password" || 
                    location.pathname === "/update-password";

  // If we're on auth pages, don't show the header and sidebar
  if (isAuthPage || !user) {
    return (
      <main className="min-h-screen w-full bg-background">
        <Outlet />
      </main>
    );
  }

  // For authenticated users on protected pages
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full bg-background text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen w-full transition-all duration-300">
          <Header />
          <main className="flex-1 px-4 md:px-6 py-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};