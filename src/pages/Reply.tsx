import { MessageCircleReply } from "lucide-react";

const Reply = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircleReply className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Aide-moi à répondre</h1>
      </div>
      <p className="text-muted-foreground">
        Lance des conversations privées avec tes prospects à partir de tes posts.
      </p>
    </div>
  );
};

export default Reply;