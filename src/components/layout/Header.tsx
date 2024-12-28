import { Logo } from "../ui/Logo";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-sidebar-border bg-sidebar py-4">
      <div className="container flex items-center justify-between">
        <div className="block md:hidden">
          <SidebarTrigger />
        </div>
        <div className="flex-1 flex justify-center">
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => navigate("/profile")}
            >
              <User className="w-4 h-4" />
              Mon compte
            </Button>
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