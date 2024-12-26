import { Lightbulb, MessageCircle, Reply, Calendar, Users } from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    title: "Générateur d'idées",
    description:
      "Créez des publications captivantes qui maximisent l'engagement de votre audience.",
  },
  {
    icon: MessageCircle,
    title: "Assistant de commentaires",
    description:
      "Rédigez des commentaires stratégiques pour attirer l'attention de vos prospects.",
  },
  {
    icon: Reply,
    title: "Assistant de réponses",
    description:
      "Formulez des réponses pertinentes pour convertir plus efficacement.",
  },
  {
    icon: Calendar,
    title: "Calendrier social",
    description:
      "Planifiez et optimisez vos publications pour un impact maximal.",
  },
  {
    icon: Users,
    title: "CRM intégré",
    description:
      "Gérez vos prospects et transformez chaque interaction en opportunité.",
  },
];

export const Features = () => {
  return (
    <div className="py-20 bg-sidebar">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12 text-sidebar-foreground">
          Tout ce dont vous avez besoin pour réussir sur Facebook
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 bg-background rounded-lg border border-sidebar-border hover:border-primary/50 transition-colors"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-sidebar-foreground">
                {feature.title}
              </h3>
              <p className="text-sidebar-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};