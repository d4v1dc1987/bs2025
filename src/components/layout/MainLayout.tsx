import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen relative">
          <Header />
          <main className="flex-1 p-6">{children}</main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};