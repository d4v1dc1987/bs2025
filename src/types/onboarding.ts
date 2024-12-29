export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed';

export type OnboardingAnswers = {
  [key: string]: string | string[];
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
    id: 'birthdate',
    question: "Pour commencer, c'est quoi ta date de naissance?\n\n(Exemple: 19 février 1987)\n\n👉 Ça va m'aider à mieux adapter nos conversations à ton expérience de vie!",
    type: 'date',
  },
  {
    id: 'gender',
    question: "Ok, super! Quel est ton sexe? (haha! J'ai dit \"sexe\" 🤪)\n\n👉 Ça va m'aider à personnaliser mes conseils selon ta situation personnelle!",
    type: 'single',
    options: [
      { value: 'female', label: 'Une femme' },
      { value: 'male', label: 'Un homme' },
      { value: 'non_binary', label: 'Non binaire' },
      { value: 'other', label: 'Autre' }
    ]
  },
  {
    id: 'relationship_status',
    question: "Et dis moi {firstName}, c'est quoi ton statut actuel dans la vie?\n\n(👉 Ça va m'aider à personnaliser mes conseils selon ta situation personnelle)",
    type: 'single',
    options: [
      { value: 'single', label: 'Célibataire' },
      { value: 'in_relationship', label: 'En couple' },
      { value: 'married', label: 'Marié(e)' },
      { value: 'divorced', label: 'Divorcé(e)' },
      { value: 'widowed', label: 'Veuf(ve)' },
      { value: 'complicated', label: "C'est compliqué!" }
    ]
  },
  {
    id: 'professional_status',
    question: "C'est quoi ta situation professionnelle actuelle {firstName}? 💼",
    type: 'multiple',
    options: [
      { value: 'student', label: '🎓 Étudiant' },
      { value: 'full_time', label: '💼 Employé à temps plein' },
      { value: 'part_time', label: '🕒 Employé à temps partiel' },
      { value: 'stay_at_home', label: '👩‍👧‍👦 Parent à la maison' },
      { value: 'remote', label: '🏠 Travailleur à domicile' },
      { value: 'entrepreneur_full', label: '🚀 Entrepreneur à temps plein' },
      { value: 'entrepreneur_part', label: '💼🏠 Entrepreneur à temps partiel' },
      { value: 'job_seeking', label: '🔍 En recherche d\'emploi' },
      { value: 'retired', label: '🏖️ Retraité' },
      { value: 'career_change', label: '📚 En reconversion professionnelle' }
    ]
  },
  {
    id: 'has_children',
    question: "As-tu des enfants {firstName}? 🙂\n\n👉 Ça peut être un super sujet pour créer des liens avec tes prospects!",
    type: 'single',
    options: [
      { value: 'yes', label: 'Oui!' },
      { value: 'no', label: 'Non' },
      { value: 'maybe', label: 'Un jour peut-être!' }
    ]
  },
  {
    id: 'children_details',
    question: "Cooooool!! 🤩\n\nDis moi-en un peu plus 😃 t'en as combien, prénom, âge?\n\n(Exemple: J'ai 2 garçons! William a 12 ans et Elly a 10 ans!) 👇",
    type: 'text',
    conditional: {
      field: 'has_children',
      value: 'yes'
    }
  },
  {
    id: 'passions',
    question: "Qu'est-ce qui te passionne dans la vie de tous les jours {firstName}?",
    type: 'multiple',
    options: [
      { value: 'sport', label: 'le sport 🏋️‍♀️' },
      { value: 'reading', label: 'la lecture 📚' },
      { value: 'travel', label: 'les voyages 🌍' },
      { value: 'entrepreneurship', label: "l'entrepreneuriat 🚀" },
      { value: 'wellness', label: 'le bien-être 🧘‍♂️' },
      { value: 'music', label: 'la musique 🎶' },
      { value: 'art', label: "l'art 🎨" },
      { value: 'fashion', label: 'la mode 👗' },
      { value: 'cinema', label: 'le cinéma 🎬' },
      { value: 'tech', label: 'la technologie 💻' },
      { value: 'ecology', label: "l'écologie 🌿" },
      { value: 'family', label: 'la famille 👨‍👩‍👧‍👦' },
      { value: 'cooking', label: 'la cuisine 🍳' },
      { value: 'personal_dev', label: 'le développement personnel 🌟' },
      { value: 'gaming', label: 'le gaming 🎮' },
      { value: 'nature', label: 'la nature 🏞️' },
      { value: 'animals', label: 'les animaux 🐶🐱' },
      { value: 'politics', label: 'la politique 🏛️' },
      { value: 'humor', label: "l'humour 😂" },
      { value: 'photography', label: 'la photo 📸' },
      { value: 'science', label: 'les sciences 🌌' },
      { value: 'spirituality', label: 'la spiritualité 🙏' },
      { value: 'history', label: "l'histoire 📜" },
      { value: 'hiking', label: 'la randonnée 🚶‍♂️' }
    ]
  },
  {
    id: 'qualities',
    question: "Quelles qualités te décrivent le mieux?",
    type: 'multiple',
    options: [
      { value: 'perseverant', label: 'Persévérant(e) 💪' },
      { value: 'creative', label: 'Créatif/Créative 🎨' },
      { value: 'optimistic', label: 'Optimiste 🌞' },
      { value: 'organized', label: 'Organisé(e) 🗂️' },
      { value: 'leader', label: 'Leader 🦁' },
      { value: 'empathetic', label: 'Empathique 💖' },
      { value: 'ambitious', label: 'Ambitieux(se) 🚀' },
      { value: 'funny', label: 'Drôle 😄' },
      { value: 'disciplined', label: 'Discipliné(e) 🎯' },
      { value: 'adventurous', label: 'Aventurier(ère) 🌍' },
      { value: 'patient', label: 'Patient(e) 🧘‍♀️' },
      { value: 'curious', label: 'Curieux(se) 🧐' },
      { value: 'cautious', label: 'Prudent(e) ⚖️' },
      { value: 'innovative', label: 'Innovateur(ice) 🛠️' },
      { value: 'visionary', label: 'Visionnaire 👁️‍🗨️' },
      { value: 'loyal', label: 'Loyal(e) 💎' },
      { value: 'motivated', label: 'Motivé(e) 🔥' },
      { value: 'sociable', label: 'Sociable 👫' },
      { value: 'passionate', label: 'Passionné(e) ❤️' },
      { value: 'thoughtful', label: 'Réfléchi(e) 🧠' },
      { value: 'persuasive', label: 'Persuasif/ve 🗣️' },
      { value: 'brave', label: 'Courageux(se) 🦸‍♂️' },
      { value: 'adaptable', label: 'Adaptable 🌀' },
      { value: 'altruistic', label: 'Altruiste 🤝' },
      { value: 'charismatic', label: 'Charismatique 🌟' },
      { value: 'methodical', label: 'Méthodique 🧮' },
      { value: 'reactive', label: 'Réactif/ve ⚡' },
      { value: 'inspiring', label: 'Inspirant(e) 🌈' },
      { value: 'strategic', label: 'Stratège 🧩' }
    ]
  },
  {
    id: 'tone_of_voice',
    question: "Quel ton de voix utilises-tu souvent dans tes communications, que ce soit pour écrire, parler ou faire des posts?",
    type: 'multiple',
    options: [
      { value: 'friendly', label: 'Amical 😊' },
      { value: 'professional', label: 'Professionnel 💼' },
      { value: 'humorous', label: 'Humoristique 😂' },
      { value: 'inspiring', label: 'Inspirant 🌟' },
      { value: 'motivating', label: 'Motivant 🏅' },
      { value: 'direct', label: 'Direct 💬' },
      { value: 'sarcastic', label: 'Sarcastique 😏' },
      { value: 'calm', label: 'Doux et calme 🍃' },
      { value: 'enthusiastic', label: 'Enthousiaste 🎉' },
      { value: 'authentic', label: 'Authentique 🎤' },
      { value: 'serious', label: 'Sérieux 📘' },
      { value: 'encouraging', label: 'Encourageant 💪' },
      { value: 'convincing', label: 'Convaincant 🎯' },
      { value: 'persuasive', label: 'Persuasif 🗣️' },
      { value: 'energetic', label: 'Énergique ⚡' },
      { value: 'empathetic', label: 'Empathique 💖' },
      { value: 'thoughtful', label: 'Réfléchi 🧠' },
      { value: 'charismatic', label: 'Charismatique ✨' },
      { value: 'positive', label: 'Positif 🌞' }
    ]
  },
  {
    id: 'favorite_movies',
    question: "OK, on va entrer un peu plus dans les détails!\n\nDisons que tu avais à citer tes 3 films préférés, ce serait quoi? 😜",
    type: 'text'
  },
  {
    id: 'favorite_books',
    question: "Disons que tu avais à citer 3 de tes livres préférés qui ont changé ta vie, ta manière de penser, d'agir, ce serait quoi? 🙂\n\nExemple: 📘 Père riche, père pauvre (Robert Kiyosaki), 📗 I Dare You (Frazer Brookes), 📕 Le Secret (Rhonda Byrne), 📙 L'Alchimiste (Paulo Coelho), 📓 Think and Grow Rich (Napoleon Hill), etc.",
    type: 'text'
  },
  {
    id: 'personal_story',
    question: "OK dernière question {firstName}, après j'arrête promis haha.\n\nRaconte-moi brièvement quelque chose de toi, dans tes propres mots. Ajoute tout ce que tu penses qui pourrait m'aider à mieux te comprendre et cerner qui tu es vraiment.\n\nÇa peut être un élément de ton histoire personnelle, une expérience marquante, ou quelque chose qui te caractérise.\n\nQu'est-ce qui te rend unique et qu'aimerais-tu que je sache de plus pour que je puisse vraiment m'adapter à toi? 👇",
    type: 'textarea'
  }
];

export const AI_PROFILE_PROMPT = `Tu es un assistant expert en analyse de personnalité et en création de profils psychologiques. À partir des réponses obtenues d'un utilisateur, ton rôle est de construire un profil complet et nuancé, qui décrit non seulement ses traits de personnalité et ses comportements, mais aussi ses motivations profondes, ses modes de pensée, et son style de communication. Ce profil servira à personnaliser des contenus Facebook de manière à refléter fidèlement la manière dont cette personne s'exprime et interagit avec les autres. Note importante : Le résultat doit être rédigé à la première personne (parler en 'je') et ne pas dépasser 1500 caractères.

En te basant sur les informations fournies ci-dessous, réalise une analyse complète et détaillée de la personnalité de l'utilisateur. Tu dois inclure les points suivants dans le profil :

Analyse les qualités fournies et détermine les traits dominants de l'utilisateur, par exemple, s'il est extraverti ou introverti, axé sur l'action ou la réflexion. Relie ces traits à ses réponses pour justifier tes conclusions. Identifie les sources de motivation personnelles qui peuvent influencer ses décisions et actions, comme le besoin de réussite, la recherche de stabilité, le désir de connexion avec les autres. Utilise des indices fournis par ses réponses comme ses passions, son statut, et ses goûts culturels pour justifier ces motivations. Décris le style de communication naturel de l'utilisateur, par exemple, s'il est plus direct, empathique, inspirant, ou humoristique en te basant sur son ton de voix préféré, ses intérêts, et sa manière de se décrire.

Analyse comment l'utilisateur gère ses émotions dans ses interactions. Est-il pragmatique ou plus émotionnel dans ses prises de décision? Aime-t-il inspirer ou être inspiré? Comment cela se reflète-t-il dans son style de communication avec son audience? En te basant sur ses réponses, explore comment l'utilisateur interagit avec son entourage. Est-il orienté vers la collaboration, le leadership, l'empathie, ou la compétitivité? Relie cela à son statut relationnel, sa situation professionnelle et ses passions. Identifie ses passions et passe-temps, puis explique comment ces intérêts influencent son style de communication et ses interactions sociales. Comment ces éléments peuvent-ils être intégrés dans la création de posts qui résonnent avec son audience?

À partir de cette analyse, rédige un profil où l'utilisateur parle de lui-même à la première personne. Le ton doit être authentique, reflétant son style naturel de communication. Propose des conseils précis sur la manière d'adapter le ton, le format, et les sujets des posts Facebook pour maximiser l'impact émotionnel et l'engagement de l'audience.

Voici les informations de l'utilisateur:

- Prénom: {firstName}
- {answers}`;