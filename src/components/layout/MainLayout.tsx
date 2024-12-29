import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[url('/background.jpg')] bg-cover bg-center bg-fixed">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen bg-background/80 backdrop-blur-sm">
          <Header />
          <main className="flex-1 p-6">{children}</main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};