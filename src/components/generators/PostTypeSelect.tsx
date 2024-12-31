import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Quote, MessageSquare, Video, Gift, User } from "lucide-react";

export type PostType = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  customFields?: {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select';
    placeholder?: string;
  }[];
};

const postTypes: PostType[] = [
  {
    id: "ideas",
    label: "Idées de publications",
    description: "Booste l'engagement avec des idées de contenu novatrices. Provoque l'intérêt et l'action parmi ton audience, en transformant chaque post en une opportunité d'interaction.",
    icon: <Lightbulb className="text-yellow-500" />,
    prompt: "Donne-moi une idée de publication Facebook pour mon audience. L'idée devrait proposer un thème ou un type de contenu engageant et inspirant pour l'audience, sans rédiger le texte complet de la publication. Présente l'idée de manière concise et directe, en utilisant un langage québécois familier et un ton amical et conversationnel. Enrichis la suggestion d'un ou deux émojis pertinents. L'idée doit être formulée en une ou deux phrases maximum.",
  },
  {
    id: "motivational-quotes",
    label: "Citations motivantes",
    description: "Booste le moral de ton audience avec des citations qui inspirent l'action. Chaque mot compte pour motiver et pousser tes followers vers le haut.",
    icon: <Quote className="text-blue-500" />,
    prompt: "Donne-moi 1 idée de citations motivantes pour mon audience. La citation doit être propre, professionnelle, et contenir entre 10 et 20 mots. Utilise un ton amical, familier, conversationnel et authentique. Toujours utiliser le tutoiement. Évite les jurons. Enrichis d'un ou deux émojis pertinents. Ne mets pas de hashtags.",
  },
  {
    id: "funny-quotes",
    label: "Citations humoristiques",
    description: "Illumine la journée de ton audience avec de l'humour piquant. Des citations amusantes qui détendent et créent un lien de complicité.",
    icon: <Quote className="text-orange-500" />,
    prompt: "Donne-moi 1 idée de citation humoristique pour mon audience. La citation doit être propre, drôle, et contenir entre 10 et 20 mots. Utilise un ton amical, familier, conversationnel et authentique. Toujours utiliser le tutoiement. Enrichis d'un ou deux émojis pertinents. Ne mets pas de hashtags.",
  },
  {
    id: "engagement-questions",
    label: "Questions d'engagement",
    description: "Provoque la pensée et le dialogue avec des questions engageantes. Encourage tes followers à partager, débattre et connecter.",
    icon: <MessageSquare className="text-purple-500" />,
    prompt: "Donne-moi 1 idée de question d'interaction pour mon audience. La question doit être propre, professionnelle, un brin d'humour, et doit amener l'interaction. Utilise un ton amical, familier, conversationnel et authentique. Toujours utiliser le tutoiement. Enrichis d'un ou deux émojis pertinents. Ne mets pas de hashtags.",
  },
  {
    id: "behind-scenes",
    label: "Behind the scenes",
    description: "Partage tes 'Behind the Scenes' pour inspirer et montrer le vrai toi. Laisse ton audience découvrir le leader en toi, dans chaque moment authentique.",
    icon: <Video className="text-green-500" />,
    prompt: "Donne-moi 1 idée de publication Facebook. L'idée est que je dévoile ma vraie nature d'entrepreneur par des instants authentiques. Du travail à la détente, c'est comme mon 'Behind the Scenes' en photos ou vidéos. Voici de quoi je veux parler dans le post :",
    customFields: [
      {
        name: "topic",
        label: "De quoi tu veux parler aujourd'hui?",
        type: "text",
        placeholder: "Ex: Soirée entre amis / Journée au parc avec les enfants, etc."
      },
      {
        name: "mediaDescription",
        label: "Décris ta photo/vidéo (facultatif)",
        type: "text",
        placeholder: "Ex: Photo de moi et des enfants au resto"
      }
    ]
  },
  {
    id: "accomplishment",
    label: "Accomplissement",
    description: "Célèbre et inspire avec tes réussites personnelles. Montre comment chaque succès est un pas vers le grand rêve, motivant chacun à agir.",
    icon: <Video className="text-pink-500" />,
    prompt: "Donne-moi 1 idée de publication Facebook. L'idée est que je dévoile ma vraie nature d'entrepreneur par des instants authentiques. Je veux célébrer et partager une réalisation personnelle et professionnelle pour inspirer d'autres. Voici de quoi je veux parler dans le post :",
    customFields: [
      {
        name: "topic",
        label: "De quoi tu veux parler aujourd'hui?",
        type: "text",
        placeholder: "Ex: J'ai perdu 10 lbs / J'ai monté d'échelons, etc."
      },
      {
        name: "mediaDescription",
        label: "Décris ta photo/vidéo (facultatif)",
        type: "text",
        placeholder: "Ex: Photo de moi qui fait un thumbs up / Photo de moi avant/après, etc."
      }
    ]
  },
  {
    id: "problem-solving",
    label: "Résolution de problème",
    description: "Offre des solutions pratiques aux défis communs. Partage ton expertise pour transformer les obstacles en étapes d'apprentissage essentielles.",
    icon: <Lightbulb className="text-yellow-500" />,
    prompt: "Donne-moi 1 idée de post Facebook pour aider mon audience. Identifie un problème courant auxquels mes prospects peuvent être confrontés et propose une solution efficace. Voici de quoi je veux parler dans le post :",
    customFields: [
      {
        name: "topic",
        label: "Tu veux parler d'un problème/défi en particulier? (Facultatif)",
        type: "text",
        placeholder: "Ex: Comment perdre du poids rapidement / Le truc pour avoir plus de vues sur YouTube, etc."
      }
    ]
  },
  {
    id: "personal-testimonial",
    label: "Témoignage perso",
    description: "Inspire avec des récits de transformation grâce à tes produits. Mets en avant l'impact réel et positif, encourageant d'autres à faire le pas.",
    icon: <Video className="text-indigo-500" />,
    prompt: "Donne-moi 1 idée de post Facebook pour partager une histoire personnelle de transformation grâce à un produit de la compagnie dont je fais partie. Le post doit être propre, professionnel, et doit inspirer mes followers sans chercher à vendre. Mets l'accent sur l'impact et le changement positif apporté par le produit, plutôt que sur ses spécificités. Voici de quoi je veux parler dans le post :",
    customFields: [
      {
        name: "product",
        label: "De quel produit/service tu veux parler? (Facultatif)",
        type: "text",
        placeholder: "Nom du produit"
      }
    ]
  },
  {
    id: "client-testimonial",
    label: "Témoignage client",
    description: "Utilise les réussites de tes clients pour prouver l'efficacité de ton offre. Rien ne parle plus que des témoignages vivants de satisfaction et de succès.",
    icon: <User className="text-blue-500" />,
    prompt: "Donne-moi 1 idée de post Facebook pour mettre en avant les réussites spectaculaires des clients grâce aux produits ou services de la compagnie dont je fais partie. Voici de quoi je veux parler dans le post :",
    customFields: [
      {
        name: "product",
        label: "De quel produit/service tu veux parler? (Facultatif)",
        type: "text",
        placeholder: "Nom du produit"
      },
      {
        name: "testimonial",
        label: "Témoignage de ton client (Facultatif)",
        type: "textarea",
        placeholder: "Le témoignage de votre client"
      },
      {
        name: "clientName",
        label: "Prénom de ton client (Facultatif)",
        type: "text",
        placeholder: "Ex: Frank"
      }
    ]
  },
  {
    id: "mindset-inspiration",
    label: "Mindset / Inspiration",
    description: "Cultive une mentalité de croissance parmi tes followers. Diffuse des messages qui inspirent la persévérance et la vision à long terme.",
    icon: <Video className="text-purple-500" />,
    prompt: "Donne-moi 1 idée de post Facebook pour inspirer et motiver mon audience. Voici de quoi je veux parler dans le post :",
    customFields: [
      {
        name: "topic",
        label: "Tu veux parler de quelque chose en particulier? (Facultatif)",
        type: "text",
        placeholder: "Ex: La peur du NON / La Procrastination, etc."
      }
    ]
  },
  {
    id: "giveaway",
    label: "GiveAway (freebie)",
    description: "Excite ton public avec des giveaways attractifs. Utilise des offres pour engager et agrandir ta base, créant un buzz autour de ta marque.",
    icon: <Gift className="text-red-500" />,
    prompt: "Donne-moi 1 idée de post Facebook pour mon audience. Ce post est de type 'GiveAway'. Voici ce que tu veux offrir gratuitement à mes followers :",
    customFields: [
      {
        name: "offer",
        label: "Qu'est-ce que tu veux partager gratuitement à ton audience?",
        type: "text",
        placeholder: "Ex: Un PDF qui explique 25 façons d'augmenter ses revenus à domicile"
      }
    ]
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