import { CheckSquare } from "lucide-react";

const Close = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CheckSquare className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Aide-moi à closer</h1>
      </div>
      <p className="text-muted-foreground">
        Booste tes interactions et close plus facilement avec tes prospects.
      </p>
    </div>
  );
};

export default Close;