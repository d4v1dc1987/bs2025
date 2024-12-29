import { useLocation } from "react-router-dom";
import { navigationLinks } from "./navigation";
import { NavButton } from "./NavButton";

interface MainNavigationProps {
  isOpen: boolean;
  onLinkClick: () => void;
}

export const MainNavigation = ({ isOpen, onLinkClick }: MainNavigationProps) => {
  const location = useLocation();

  return (
    <div className="space-y-2">
      {navigationLinks.map((link) => (
        <NavButton
          key={link.to}
          {...link}
          isActive={location.pathname === link.to}
          isOpen={isOpen}
          onClick={onLinkClick}
        />
      ))}
    </div>
  );
};