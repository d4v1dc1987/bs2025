import { Button } from "@/components/ui/button";
import { SidebarToggle } from "./sidebar/SidebarToggle";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <SidebarToggle />
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-2">
            {user && (
              <>
                <span className="text-sm text-muted-foreground">
                  Bonjour, {user.email}
                </span>
                <Button 
                  variant="ghost" 
                  onClick={signOut}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Déconnexion
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};