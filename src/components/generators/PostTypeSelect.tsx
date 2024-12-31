import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Quote, MessageSquare, Video, Gift, User } from "lucide-react";

export type PostType = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  hasCustomFields?: boolean;
};

const postTypes: PostType[] = [
  {
    id: "ideas",
    label: "Idées de publications",
    description: "Booste l'engagement avec des idées de contenu novatrices. Provoque l'intérêt et l'action parmi ton audience, en transformant chaque post en une opportunité d'interaction.",
    icon: <Lightbulb className="text-yellow-500" />,
  },
  {
    id: "motivational-quotes",
    label: "Citations motivantes",
    description: "Booste le moral de ton audience avec des citations qui inspirent l'action. Chaque mot compte pour motiver et pousser tes followers vers le haut.",
    icon: <Quote className="text-blue-500" />,
  },
  {
    id: "funny-quotes",
    label: "Citations humoristiques",
    description: "Illumine la journée de ton audience avec de l'humour piquant. Des citations amusantes qui détendent et créent un lien de complicité.",
    icon: <Quote className="text-orange-500" />,
  },
  {
    id: "engagement-questions",
    label: "Questions d'engagement",
    description: "Provoque la pensée et le dialogue avec des questions engageantes. Encourage tes followers à partager, débattre et connecter.",
    icon: <MessageSquare className="text-purple-500" />,
  },
  {
    id: "behind-scenes",
    label: "Behind the scenes",
    description: "Partage tes 'Behind the Scenes' pour inspirer et montrer le vrai toi. Laisse ton audience découvrir le leader en toi, dans chaque moment authentique.",
    icon: <Video className="text-green-500" />,
    hasCustomFields: true,
  },
  {
    id: "accomplishment",
    label: "Accomplissement",
    description: "Célèbre et inspire avec tes réussites personnelles. Montre comment chaque succès est un pas vers le grand rêve, motivant chacun à agir.",
    icon: <Video className="text-pink-500" />,
    hasCustomFields: true,
  },
  {
    id: "problem-solving",
    label: "Résolution de problème",
    description: "Offre des solutions pratiques aux défis communs. Partage ton expertise pour transformer les obstacles en étapes d'apprentissage essentielles.",
    icon: <Lightbulb className="text-yellow-500" />,
  },
  {
    id: "personal-testimonial",
    label: "Témoignage perso",
    description: "Inspire avec des récits de transformation grâce à tes produits. Mets en avant l'impact réel et positif, encourageant d'autres à faire le pas.",
    icon: <Video className="text-indigo-500" />,
  },
  {
    id: "client-testimonial",
    label: "Témoignage client",
    description: "Utilise les réussites de tes clients pour prouver l'efficacité de ton offre. Rien ne parle plus que des témoignages vivants de satisfaction et de succès.",
    icon: <User className="text-blue-500" />,
  },
  {
    id: "mindset-inspiration",
    label: "Mindset / Inspiration",
    description: "Cultive une mentalité de croissance parmi tes followers. Diffuse des messages qui inspirent la persévérance et la vision à long terme.",
    icon: <Video className="text-purple-500" />,
  },
  {
    id: "giveaway",
    label: "GiveAway (freebie)",
    description: "Excite ton public avec des giveaways attractifs. Utilise des offres pour engager et agrandir ta base, créant un buzz autour de ta marque.",
    icon: <Gift className="text-red-500" />,
  },
];

interface PostTypeSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
}

export const PostTypeSelect = ({ value, onValueChange }: PostTypeSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full bg-card border-muted">
        <SelectValue placeholder="Choisis un type de post" />
      </SelectTrigger>
      <SelectContent>
        {postTypes.map((type) => (
          <SelectItem 
            key={type.id} 
            value={type.id}
            className="flex items-center gap-2"
          >
            <span className="flex items-center gap-2">
              {type.icon}
              {type.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const getPostTypeById = (id: string): PostType | undefined => {
  return postTypes.find(type => type.id === id);
};