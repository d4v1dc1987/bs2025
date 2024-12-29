import { useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "./SidebarContext";
import { NavButton } from "./NavButton";
import { MainNavigation } from "./MainNavigation";
import { dashboardLink } from "./navigation";

export const SidebarNav = () => {
  const location = useLocation();
  const { isOpen, close } = useSidebar();
  
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      close();
    }
  };
  
  return (
    <nav className="grid gap-2 px-3 py-2">
      {/* Dashboard Section */}
      <NavButton
        {...dashboardLink}
        isActive={location.pathname === dashboardLink.to}
        isOpen={isOpen}
        onClick={handleLinkClick}
      />
      
      {/* Separator with consistent margin */}
      <Separator className="my-2 bg-gray-700/50" />
      
      {/* Main Navigation Links */}
      <MainNavigation 
        isOpen={isOpen}
        onLinkClick={handleLinkClick}
      />
    </nav>
  );
};