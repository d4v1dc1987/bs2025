import { 
  BookOpen, 
  MessageSquare, 
  MessageCircleReply, 
  Calendar, 
  CheckSquare, 
  LayoutDashboard,
  UserRound,
  Building2
} from "lucide-react";

export const dashboardLink = {
  to: "/dashboard",
  icon: LayoutDashboard,
  label: "Tableau de bord",
  subLinks: [
    {
      to: "/profile?tab=personality",
      icon: UserRound,
      label: "Ma personnalité",
    },
    {
      to: "/profile?tab=business",
      icon: Building2,
      label: "Ma Business",
    },
  ],
};

export const navigationLinks = [
  {
    to: "/generator",
    icon: BookOpen,
    label: "Idées de publications",
  },
  {
    to: "/comment",
    icon: MessageSquare,
    label: "Aide-moi à commenter",
  },
  {
    to: "/reply",
    icon: MessageCircleReply,
    label: "Aide-moi à répondre",
  },
  {
    to: "/calendar",
    icon: Calendar,
    label: "Calendrier social",
  },
  {
    to: "/close",
    icon: CheckSquare,
    label: "Aide-moi à closer",
  },
];

export type NavigationLink = typeof navigationLinks[0];