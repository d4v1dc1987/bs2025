import { LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
      </div>
      <p className="text-muted-foreground">
        Bienvenue sur votre tableau de bord Bobby Social
      </p>
    </div>
  );
};

export default Dashboard;