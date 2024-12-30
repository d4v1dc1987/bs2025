import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";

interface WelcomeScreenProps {
  firstName: string;
  onStart: () => void;
}

export const WelcomeScreen = ({ firstName, onStart }: WelcomeScreenProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smile className="w-6 h-6 text-primary" />
          Bienvenue dans Bobby Social
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CardDescription className="text-lg space-y-4">
          <p>Ok {firstName}, tout d'abord, j'ai quelques questions à te poser pour personnaliser ton expérience avec Bobby Social au maximum. 😎</p>
          <p>🔥 Plus tu réponds de façon honnête et précise, mieux c'est!</p>
        </CardDescription>
        <Button onClick={onStart} className="w-full">
          Commencer
        </Button>
      </CardContent>
    </Card>
  );
};