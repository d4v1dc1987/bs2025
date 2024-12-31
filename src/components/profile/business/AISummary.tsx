import { Card } from "@/components/ui/card";

interface AISummaryProps {
  summary: string | null;
}

export const AISummary = ({ summary }: AISummaryProps) => {
  if (!summary) return null;

  return (
    <Card className="p-8 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30 border-primary/20">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Mon profil business</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {summary}
        </p>
      </div>
    </Card>
  );
};