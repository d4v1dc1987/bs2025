import { Logo } from "../ui/Logo";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { User, PanelLeftClose, PanelLeft } from "lucide-react";
import { useSidebar } from "./sidebar/SidebarContext";

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { isOpen, toggle } = useSidebar();

  return (
    <header className="border-b border-sidebar-border bg-sidebar py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="h-9 w-9"
          >
            {isOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeft className="h-5 w-5" />
            )}
          </Button>
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden md:block">
                Bonjour, {user.user_metadata.first_name}
              </span>
              <Button
                variant="secondary"
                size="sm"
                className="gap-2"
                onClick={() => navigate("/profile")}
              >
                <User className="w-4 h-4" />
                Mon compte
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <Link to="/auth?mode=login">Connexion</Link>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                asChild
              >
                <Link to="/auth?mode=signup">Créer un compte</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};