import { MessageSquare } from "lucide-react";

const Comment = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Aide-moi à commenter</h1>
      </div>
      <p className="text-muted-foreground">
        Donne les meilleurs commentaires sur les posts de tes prospects.
      </p>
    </div>
  );
};

export default Comment;