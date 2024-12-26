export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-sidebar-border bg-sidebar py-6">
      <div className="container">
        <div className="text-center text-sm text-sidebar-foreground/70">
          © {new Date().getFullYear()} Bobby Social. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};