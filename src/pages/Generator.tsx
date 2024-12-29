import { BookOpen } from "lucide-react";
import { PostGenerator } from "@/components/generators/PostGenerator";

const Generator = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Idées de publications</h1>
      </div>
      <p className="text-muted-foreground">
        Booste ton contenu et captive ton audience en un clin d'œil.
      </p>
      <PostGenerator />
    </div>
  );
};

export default Generator;