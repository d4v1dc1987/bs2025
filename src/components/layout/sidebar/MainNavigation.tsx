import { useLocation } from "react-router-dom";
import { NavButton } from "./NavButton";
import { navigationLinks } from "./navigation";
import { cn } from "@/lib/utils";

interface MainNavigationProps {
  isOpen: boolean;
  onLinkClick: () => boolean;
  isDisabled?: boolean;
}

export const MainNavigation = ({ isOpen, onLinkClick, isDisabled }: MainNavigationProps) => {
  const location = useLocation();
  
  return (
    <div className="grid gap-1">
      {navigationLinks.map((link) => (
        <NavButton
          key={link.to}
          {...link}
          isActive={location.pathname === link.to}
          isOpen={isOpen}
          onClick={onLinkClick}
          className={cn(
            isDisabled && "opacity-50 pointer-events-none"
          )}
        />
      ))}
    </div>
  );
};