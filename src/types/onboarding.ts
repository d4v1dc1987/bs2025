export interface OnboardingOption {
  value: string;
  label: string;
  emoji?: string;
  allowCustom?: boolean; // Added to support custom input for "Other" option
}

export interface OnboardingQuestion {
  id: string;
  question: string;
  description?: string;
  type: 'single' | 'multiple' | 'text' | 'textarea' | 'date';
  options?: OnboardingOption[];
  conditional?: {
    dependsOn: string;
    showIf: string[];
  };
  maxLength?: number; // Added to enforce text limits
}

export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed';

export interface OnboardingAnswers {
  [key: string]: string | string[];
}

export const TEXT_LIMITS = {
  short: 100,
  medium: 250,
  long: 500,
  personal_story: 1000
} as const;

export const AI_PROFILE_PROMPT = `Tu es un assistant expert en analyse de personnalité et en création de profils psychologiques. À partir des réponses obtenues d'un utilisateur, ton rôle est de construire un profil complet et nuancé, qui décrit non seulement ses traits de personnalité et ses comportements, mais aussi ses motivations profondes, ses modes de pensée, et son style de communication. Ce profil servira à personnaliser des contenus Facebook de manière à refléter fidèlement la manière dont cette personne s'exprime et interagit avec les autres. Note importante : Le résultat doit être rédigé à la première personne (parler en 'je') et ne pas dépasser 1500 caractères.

En te basant sur les informations fournies ci-dessous, réalise une analyse complète et détaillée de la personnalité de l'utilisateur. Tu dois inclure les points suivants dans le profil :

Analyse les qualités fournies et détermine les traits dominants de l'utilisateur, par exemple, s'il est extraverti ou introverti, axé sur l'action ou la réflexion. Relie ces traits à ses réponses pour justifier tes conclusions. Identifie les sources de motivation personnelles qui peuvent influencer ses décisions et actions, comme le besoin de réussite, la recherche de stabilité, le désir de connexion avec les autres. Utilise des indices fournis par ses réponses comme ses passions, son statut, et ses goûts culturels pour justifier ces motivations. Décris le style de communication naturel de l'utilisateur, par exemple, s'il est plus direct, empathique, inspirant, ou humoristique en te basant sur son ton de voix préféré, ses intérêts, et sa manière de se décrire.

Analyse comment l'utilisateur gère ses émotions dans ses interactions. Est-il pragmatique ou plus émotionnel dans ses prises de décision? Aime-t-il inspirer ou être inspiré? Comment cela se reflète-t-il dans son style de communication avec son audience? En te basant sur ses réponses, explore comment l'utilisateur interagit avec son entourage. Est-il orienté vers la collaboration, le leadership, l'empathie, ou la compétitivité? Relie cela à son statut relationnel, sa situation professionnelle et ses passions. Identifie ses passions et passe-temps, puis explique comment ces intérêts influencent son style de communication et ses interactions sociales. Comment ces éléments peuvent-ils être intégrés dans la création de posts qui résonnent avec son audience?

À partir de cette analyse, rédige un profil où l'utilisateur parle de lui-même à la première personne. Le ton doit être authentique, reflétant son style naturel de communication. Propose des conseils précis sur la manière d'adapter le ton, le format, et les sujets des posts Facebook pour maximiser l'impact émotionnel et l'engagement de l'audience.

Voici les informations de l'utilisateur:

- Prénom: {firstName}
- Réponses: {answers}`;

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'birth_date',
    question: "Pour commencer, c'est quoi ta date de naissance?",
    description: "👉 Ça va m'aider à mieux adapter nos conversations à ton expérience de vie!",
    type: 'date'
  },
  {
    id: 'gender',
    question: "Ok, super! Quel est ton sexe? (haha! J'ai dit \"sexe\" 🤪)",
    description: "👉 Ça va m'aider à personnaliser mes conseils selon ta situation personnelle!",
    type: 'single',
    options: [
      { value: 'female', label: 'Une femme', emoji: '👩' },
      { value: 'male', label: 'Un homme', emoji: '👨' },
      { value: 'non_binary', label: 'Non binaire', emoji: '🌈' },
      { value: 'other', label: 'Autre', emoji: '💫', allowCustom: true }
    ]
  },
  {
    id: 'relationship_status',
    question: "Et dis moi {firstName}, c'est quoi ton statut actuel dans la vie?",
    description: "👉 Ça va m'aider à personnaliser mes conseils selon ta situation personnelle",
    type: 'single',
    options: [
      { value: 'single', label: 'Célibataire', emoji: '🌟' },
      { value: 'relationship', label: 'En couple', emoji: '💑' },
      { value: 'married', label: 'Marié(e)', emoji: '💍' },
      { value: 'divorced', label: 'Divorcé(e)', emoji: '💔' },
      { value: 'widowed', label: 'Veuf(ve)', emoji: '🕊️' },
      { value: 'complicated', label: "C'est compliqué!", emoji: '🤔' }
    ]
  },
  {
    id: 'professional_status',
    question: "C'est quoi ta situation professionnelle actuelle {firstName}? 💼",
    description: "👉 Ces infos vont m'aider à mieux comprendre ton contexte professionnel!",
    type: 'multiple',
    options: [
      { value: 'student', label: 'Étudiant', emoji: '🎓' },
      { value: 'full_time', label: 'Employé à temps plein', emoji: '💼' },
      { value: 'part_time', label: 'Employé à temps partiel', emoji: '🕒' },
      { value: 'stay_at_home', label: 'Maman/Papa à la maison', emoji: '👩‍👧‍👦' },
      { value: 'remote', label: 'Travailleur à domicile', emoji: '🏠' },
      { value: 'entrepreneur_full', label: 'Entrepreneur à temps plein', emoji: '🚀' },
      { value: 'entrepreneur_part', label: 'Entrepreneur à temps partiel', emoji: '💼🏠' },
      { value: 'job_seeking', label: "En recherche d'emploi", emoji: '🔍' },
      { value: 'retired', label: 'Retraité', emoji: '🏖️' },
      { value: 'career_change', label: 'En reconversion professionnelle', emoji: '📚' }
    ]
  },
  {
    id: 'has_children',
    question: "As-tu des enfants {firstName}? 🙂",
    description: "👉 Ça peut être un super sujet pour créer des liens avec tes prospects!",
    type: 'single',
    options: [
      { value: 'yes', label: 'Oui!', emoji: '👶' },
      { value: 'no', label: 'Non', emoji: '🚫' },
      { value: 'maybe', label: 'Un jour peut-être!', emoji: '🤔' }
    ]
  },
  {
    id: 'children_details',
    question: "Cooooool!! 🤩\n\nDis moi-en un peu plus 😃 t'en as combien, prénom, âge?\n\n(Exemple: J'ai 2 garçons! William a 12 ans et Elly a 10 ans!)",
    type: 'textarea',
    maxLength: TEXT_LIMITS.long,
    conditional: {
      dependsOn: 'has_children',
      showIf: ['yes']
    }
  },
  {
    id: 'passions',
    question: "Qu'est-ce qui te passionne dans la vie de tous les jours {firstName}?",
    description: "👉 Ça va m'aider à te suggérer des sujets de conversation intéressants avec tes prospects!",
    type: 'multiple',
    options: [
      { value: 'sport', label: 'Le sport', emoji: '🏋️‍♀️' },
      { value: 'reading', label: 'La lecture', emoji: '📚' },
      { value: 'travel', label: 'Les voyages', emoji: '🌍' },
      { value: 'entrepreneurship', label: "L'entrepreneuriat", emoji: '🚀' },
      { value: 'wellbeing', label: 'Le bien-être', emoji: '🧘‍♂️' },
      { value: 'music', label: 'La musique', emoji: '🎶' },
      { value: 'art', label: "L'art", emoji: '🎨' },
      { value: 'fashion', label: 'La mode', emoji: '👗' },
      { value: 'cinema', label: 'Le cinéma', emoji: '🎬' },
      { value: 'tech', label: 'La technologie', emoji: '💻' },
      { value: 'ecology', label: "L'écologie", emoji: '🌿' },
      { value: 'family', label: 'La famille', emoji: '👨‍👩‍👧‍👦' },
      { value: 'cooking', label: 'La cuisine', emoji: '🍳' },
      { value: 'personal_dev', label: 'Le développement personnel', emoji: '🌟' },
      { value: 'gaming', label: 'Le gaming', emoji: '🎮' },
      { value: 'nature', label: 'La nature', emoji: '🏞️' },
      { value: 'animals', label: 'Les animaux', emoji: '🐶' },
      { value: 'politics', label: 'La politique', emoji: '🏛️' },
      { value: 'humor', label: "L'humour", emoji: '😂' },
      { value: 'photo', label: 'La photo', emoji: '📸' },
      { value: 'science', label: 'Les sciences', emoji: '🌌' },
      { value: 'spirituality', label: 'La spiritualité', emoji: '🙏' },
      { value: 'history', label: "L'histoire", emoji: '📜' },
      { value: 'hiking', label: 'La randonnée', emoji: '🚶‍♂️' },
      { value: 'other', label: 'Autre', emoji: '✨', allowCustom: true }
    ]
  },
  {
    id: 'qualities',
    question: "Quelles qualités te décrivent le mieux?",
    description: "👉 Je vais utiliser ça pour t'aider à mettre en avant tes qualités naturelles dans tes conversations!",
    type: 'multiple',
    options: [
      { value: 'perseverant', label: 'Persévérant(e)', emoji: '💪' },
      { value: 'creative', label: 'Créatif/Créative', emoji: '🎨' },
      { value: 'optimistic', label: 'Optimiste', emoji: '🌞' },
      { value: 'organized', label: 'Organisé(e)', emoji: '🗂️' },
      { value: 'leader', label: 'Leader', emoji: '🦁' },
      { value: 'empathetic', label: 'Empathique', emoji: '💖' },
      { value: 'ambitious', label: 'Ambitieux(se)', emoji: '🚀' },
      { value: 'funny', label: 'Drôle', emoji: '😄' },
      { value: 'disciplined', label: 'Discipliné(e)', emoji: '🎯' },
      { value: 'adventurous', label: 'Aventurier(ère)', emoji: '🌍' },
      { value: 'patient', label: 'Patient(e)', emoji: '🧘‍♀️' },
      { value: 'curious', label: 'Curieux(se)', emoji: '🧐' },
      { value: 'cautious', label: 'Prudent(e)', emoji: '⚖️' },
      { value: 'innovative', label: 'Innovateur(ice)', emoji: '🛠️' },
      { value: 'visionary', label: 'Visionnaire', emoji: '👁️‍🗨️' },
      { value: 'loyal', label: 'Loyal(e)', emoji: '💎' },
      { value: 'motivated', label: 'Motivé(e)', emoji: '🔥' },
      { value: 'sociable', label: 'Sociable', emoji: '👫' },
      { value: 'passionate', label: 'Passionné(e)', emoji: '❤️' },
      { value: 'thoughtful', label: 'Réfléchi(e)', emoji: '🧠' },
      { value: 'persuasive', label: 'Persuasif/ve', emoji: '🗣️' },
      { value: 'brave', label: 'Courageux(se)', emoji: '🦸‍♂️' },
      { value: 'adaptable', label: 'Adaptable', emoji: '🌀' },
      { value: 'altruistic', label: 'Altruiste', emoji: '🤝' },
      { value: 'charismatic', label: 'Charismatique', emoji: '🌟' },
      { value: 'methodical', label: 'Méthodique', emoji: '🧮' },
      { value: 'reactive', label: 'Réactif/ve', emoji: '⚡' },
      { value: 'inspiring', label: 'Inspirant(e)', emoji: '🌈' },
      { value: 'strategic', label: 'Stratège', emoji: '🧩' },
      { value: 'other', label: 'Autre', emoji: '✨', allowCustom: true }
    ]
  },
  {
    id: 'communication_style',
    question: "Quel ton de voix utilises-tu souvent dans tes communications, que ce soit pour écrire, parler ou faire des posts?",
    description: "👉 Ça va m'aider à mieux adapter tes textes avec ton style d'écriture!",
    type: 'multiple',
    options: [
      { value: 'friendly', label: 'Amical', emoji: '😊' },
      { value: 'professional', label: 'Professionnel', emoji: '💼' },
      { value: 'humorous', label: 'Humoristique', emoji: '😂' },
      { value: 'inspiring', label: 'Inspirant', emoji: '🌟' },
      { value: 'motivating', label: 'Motivant', emoji: '🏅' },
      { value: 'direct', label: 'Direct', emoji: '💬' },
      { value: 'sarcastic', label: 'Sarcastique', emoji: '😏' },
      { value: 'calm', label: 'Doux et calme', emoji: '🍃' },
      { value: 'enthusiastic', label: 'Enthousiaste', emoji: '🎉' },
      { value: 'authentic', label: 'Authentique', emoji: '🎤' },
      { value: 'serious', label: 'Sérieux', emoji: '📘' },
      { value: 'encouraging', label: 'Encourageant', emoji: '💪' },
      { value: 'convincing', label: 'Convaincant', emoji: '🎯' },
      { value: 'persuasive', label: 'Persuasif', emoji: '🗣️' },
      { value: 'energetic', label: 'Énergique', emoji: '⚡' },
      { value: 'empathetic', label: 'Empathique', emoji: '💖' },
      { value: 'thoughtful', label: 'Réfléchi', emoji: '🧠' },
      { value: 'charismatic', label: 'Charismatique', emoji: '✨' },
      { value: 'positive', label: 'Positif', emoji: '🌞' }
    ]
  },
  {
    id: 'personal_story',
    question: "OK dernière question {firstName}, après j'arrête promis haha.\n\nRaconte-moi brièvement quelque chose de toi, dans tes propres mots. Ajoute tout ce que tu penses qui pourrait m'aider à mieux te comprendre et cerner qui tu es vraiment.\n\nÇa peut être un élément de ton histoire personnelle, une expérience marquante, ou quelque chose qui te caractérise.\n\nQu'est-ce qui te rend unique et qu'aimerais-tu que je sache de plus pour que je puisse vraiment m'adapter à toi? 👇",
    type: 'textarea',
    maxLength: TEXT_LIMITS.personal_story
  }
];
