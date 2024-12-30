export interface OnboardingOption {
  value: string;
  label: string;
  emoji?: string;
}

export interface OnboardingQuestion {
  id: string;
  question: string;
  description?: string;
  type: 'single' | 'multiple' | 'text' | 'textarea' | 'date';
  options?: OnboardingOption[];
}

export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed';

export interface OnboardingAnswers {
  [key: string]: string | string[];
}

export const AI_PROFILE_PROMPT = `Based on the onboarding answers from {firstName}, create a personalized summary that will help me better understand their situation and needs. Here are their answers:

{answers}

Please provide a concise summary that highlights the key aspects of their profile and what would be most relevant for providing personalized social media assistance.`;

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'experience_level',
    question: "Quel est ton niveau d'expérience sur les réseaux sociaux ?",
    description: "👉 Ça va m'aider à mieux adapter nos conversations à ton expérience de vie!",
    type: 'single',
    options: [
      { value: 'beginner', label: 'Débutant', emoji: '🌱' },
      { value: 'intermediate', label: 'Intermédiaire', emoji: '🌿' },
      { value: 'advanced', label: 'Avancé', emoji: '🌳' }
    ]
  },
  {
    id: 'business_type',
    question: "Dans quel domaine exerces-tu ?",
    description: "👉 Je pourrai mieux comprendre ton secteur d'activité et adapter mes suggestions!",
    type: 'text'
  },
  {
    id: 'target_audience',
    question: "Quelle est ta cible principale ?",
    description: "👉 Ça m'aidera à personnaliser le ton et le style de nos échanges!",
    type: 'text'
  },
  {
    id: 'social_networks',
    question: "Sur quels réseaux sociaux es-tu présent ?",
    description: "👉 Je pourrai me concentrer sur les plateformes que tu utilises!",
    type: 'multiple',
    options: [
      { value: 'instagram', label: 'Instagram', emoji: '📸' },
      { value: 'facebook', label: 'Facebook', emoji: '👥' },
      { value: 'linkedin', label: 'LinkedIn', emoji: '💼' },
      { value: 'tiktok', label: 'TikTok', emoji: '🎵' }
    ]
  },
  {
    id: 'posting_frequency',
    question: "À quelle fréquence publies-tu du contenu ?",
    description: "👉 Je pourrai adapter mes suggestions à ton rythme de publication!",
    type: 'single',
    options: [
      { value: 'rarely', label: 'Rarement', emoji: '🐌' },
      { value: 'sometimes', label: 'De temps en temps', emoji: '🚶' },
      { value: 'regularly', label: 'Régulièrement', emoji: '🏃' },
      { value: 'very_often', label: 'Très souvent', emoji: '⚡' }
    ]
  },
  {
    id: 'has_children',
    question: "As-tu des enfants ?",
    description: "👉 Cette information m'aidera à mieux comprendre ton quotidien!",
    type: 'single',
    options: [
      { value: 'yes', label: 'Oui', emoji: '👶' },
      { value: 'no', label: 'Non', emoji: '🚫' }
    ]
  },
  {
    id: 'children_details',
    question: "Peux-tu me parler un peu de tes enfants ? (âges, prénoms...)",
    description: "👉 Ça m'aidera à personnaliser nos échanges en tenant compte de ta vie de famille!",
    type: 'textarea'
  },
  {
    id: 'birth_date',
    question: "Quelle est ta date de naissance ?",
    description: "👉 Pour mieux comprendre ta génération et adapter mon langage!",
    type: 'date'
  }
];