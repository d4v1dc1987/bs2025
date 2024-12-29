export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed';

export type OnboardingAnswers = {
  [key: string]: string;
};

export type OnboardingData = {
  id: string;
  status: OnboardingStatus;
  current_step: number;
  answers: OnboardingAnswers;
  ai_summary: string | null;
  created_at: string;
  updated_at: string;
};

export const ONBOARDING_QUESTIONS = [
  {
    id: 'business_type',
    question: "Quel type d'entrepreneur en ligne êtes-vous ?",
    options: [
      { value: 'coach', label: 'Coach en ligne' },
      { value: 'infopreneur', label: 'Infopreneur' },
      { value: 'network_marketer', label: 'Marketeur de réseau' },
      { value: 'influencer', label: 'Influenceur' },
      { value: 'blogger', label: 'Blogueur' },
      { value: 'freelancer', label: 'Freelance' },
    ],
  },
  {
    id: 'experience_level',
    question: "Quel est votre niveau d'expérience en entrepreneuriat en ligne ?",
    options: [
      { value: 'beginner', label: 'Débutant' },
      { value: 'intermediate', label: 'Intermédiaire' },
      { value: 'advanced', label: 'Avancé' },
    ],
  },
  {
    id: 'target_audience',
    question: "Quelle est votre audience cible principale ?",
    options: [
      { value: 'professionals', label: 'Professionnels' },
      { value: 'entrepreneurs', label: 'Entrepreneurs' },
      { value: 'students', label: 'Étudiants' },
      { value: 'general_public', label: 'Grand public' },
    ],
  },
  {
    id: 'content_type',
    question: "Quel type de contenu créez-vous principalement ?",
    options: [
      { value: 'educational', label: 'Éducatif' },
      { value: 'inspirational', label: 'Inspirant' },
      { value: 'entertaining', label: 'Divertissant' },
      { value: 'promotional', label: 'Promotionnel' },
    ],
  },
  {
    id: 'posting_frequency',
    question: "À quelle fréquence publiez-vous sur les réseaux sociaux ?",
    options: [
      { value: 'daily', label: 'Quotidiennement' },
      { value: 'weekly', label: '2-3 fois par semaine' },
      { value: 'monthly', label: 'Quelques fois par mois' },
      { value: 'rarely', label: 'Rarement' },
    ],
  },
  {
    id: 'business_goals',
    question: "Quel est votre objectif principal ?",
    options: [
      { value: 'brand_awareness', label: 'Développer ma notoriété' },
      { value: 'lead_generation', label: 'Générer des prospects' },
      { value: 'sales', label: 'Augmenter mes ventes' },
      { value: 'community', label: 'Construire une communauté' },
    ],
  },
  {
    id: 'main_challenge',
    question: "Quel est votre plus grand défi actuellement ?",
    options: [
      { value: 'content_creation', label: 'Création de contenu' },
      { value: 'engagement', label: "Obtenir de l'engagement" },
      { value: 'conversion', label: 'Convertir mes prospects' },
      { value: 'consistency', label: 'Maintenir la régularité' },
    ],
  },
  {
    id: 'product_type',
    question: "Quel type de produit/service vendez-vous principalement ?",
    options: [
      { value: 'coaching', label: 'Coaching individuel' },
      { value: 'course', label: 'Formation en ligne' },
      { value: 'membership', label: 'Programme membres' },
      { value: 'physical', label: 'Produits physiques' },
    ],
  },
  {
    id: 'price_range',
    question: "Dans quelle gamme de prix se situe votre offre principale ?",
    options: [
      { value: 'low', label: 'Moins de 100€' },
      { value: 'medium', label: '100€ - 500€' },
      { value: 'high', label: '500€ - 2000€' },
      { value: 'premium', label: 'Plus de 2000€' },
    ],
  },
  {
    id: 'sales_process',
    question: "Comment se déroule principalement votre processus de vente ?",
    options: [
      { value: 'direct', label: 'Vente directe' },
      { value: 'funnel', label: 'Tunnel de vente' },
      { value: 'organic', label: 'Vente organique' },
      { value: 'referral', label: 'Bouche à oreille' },
    ],
  },
  {
    id: 'communication_style',
    question: "Quel est votre style de communication préféré ?",
    options: [
      { value: 'professional', label: 'Professionnel' },
      { value: 'casual', label: 'Décontracté' },
      { value: 'motivational', label: 'Motivant' },
      { value: 'educational', label: 'Pédagogique' },
    ],
  },
];