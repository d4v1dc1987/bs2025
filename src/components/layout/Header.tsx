import { Logo } from "../ui/Logo";
import { SidebarTrigger } from "../ui/sidebar";

export const Header = () => {
  return (
    <header className="border-b border-sidebar-border bg-sidebar py-4">
      <div className="container flex items-center justify-between">
        <div className="block md:hidden">
          <SidebarTrigger />
        </div>
        <div className="flex-1 flex justify-center">
          <Logo />
        </div>
      </div>
    </header>
  );
};