import { Logo } from "../ui/Logo";

export const Header = () => {
  return (
    <header className="border-b border-sidebar-border bg-sidebar py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo />
        </div>
      </div>
    </header>
  );
};