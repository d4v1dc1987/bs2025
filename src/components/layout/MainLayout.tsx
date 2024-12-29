import { SidebarProvider } from "./sidebar/SidebarContext";
import { Sidebar } from "./sidebar/Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-white">
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