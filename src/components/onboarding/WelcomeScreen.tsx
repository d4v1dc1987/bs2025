import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  firstName: string;
  onStart: () => void;
}

export const WelcomeScreen = ({ firstName, onStart }: WelcomeScreenProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Bienvenue dans Bobby Social</CardTitle>
        <CardDescription className="text-lg space-y-4">
          <p>Ok {firstName}, tout d'abord, j'ai quelques questions à te poser pour personnaliser ton expérience avec Bobby Social au maximum. 😎</p>
          <p>🔥 Plus tu réponds de façon honnête et précise, mieux c'est!</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onStart} className="w-full">
          Commencer
        </Button>
      </CardContent>
    </Card>
  );
};