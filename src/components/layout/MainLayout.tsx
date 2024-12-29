import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/sidebar/Sidebar";
import { SidebarProvider } from "@/components/layout/sidebar/SidebarContext";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full bg-background text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen w-full transition-all duration-300">
          <Header />
          <main className="flex-1 px-4 md:px-6 py-6">{children}</main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};