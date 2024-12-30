import { CardDescription } from "@/components/ui/card";

interface QuestionDescriptionProps {
  description?: string;
}

export const QuestionDescription = ({ description }: QuestionDescriptionProps) => {
  if (!description) return null;
  
  return (
    <CardDescription className="mt-4 text-sm text-muted-foreground">
      {description}
    </CardDescription>
  );
};