export type LevelClass = {
  id: string
  label: string
  title: string
  intro: string
  goals: string[]
  subjects: string[]
  support: string[]
}

export type LevelData = {
  label: string
  inLabel: string
  role: 'parent' | 'student'
  hero: { image: string; title: string; lead: string; tag: string }
  challenges: { title: string; text: string; image: string; offers: string[] }[]
  classesTitle: string
  classes: LevelClass[]
  subjects: { name: string; tagline: string }[]
  cta: { image: string; title: string; text: string }
  faq: { q: string; a: string }[]
}

const CTA_IMAGE = '/p.jpg'

export const LEVELS: Record<'primaire' | 'college' | 'lycee' | 'superieur' | 'adultes', LevelData> = {
  primaire: {
    label: 'Primaire',
    inLabel: 'en primaire',
    role: 'parent',
    hero: {
      image: '/f.jpg',
      title: 'Les enjeux en primaire',
      lead: "De la SIL au CM2, votre enfant pose les bases de toute sa scolarité : lire, écrire, compter et prendre confiance. Nos enseignants l'accompagnent à son rythme, jusqu'au CEP et au concours d'entrée en 6e.",
      tag: 'De la SIL au CM2',
    },
    challenges: [
      { title: 'Acquérir les fondamentaux', text: 'Lecture, écriture et calcul : des bases solides pour aborder sereinement la suite.', image: '/c.jpg', offers: ['Cours particuliers', 'Cours en ligne'] },
      { title: 'Prendre de bonnes habitudes', text: 'Organisation, concentration et goût de l’effort, dès les premières classes.', image: '/b.jpg', offers: ['Aide aux devoirs', 'Méthodologie'] },
      { title: 'Préparer l’entrée en 6e', text: 'Réviser le CEP et le concours d’entrée en 6e avec un enseignant dédié.', image: '/e.jpg', offers: ['Stages', 'Cours particuliers'] },
    ],
    classesTitle: 'En quelle classe est votre enfant ?',
    classes: [
      { id: 'sil', label: 'SIL', title: 'Bien démarrer en SIL', intro: "Première année d'apprentissage formel : votre enfant découvre les lettres, les sons et les nombres.", goals: ['Reconnaître les lettres et les sons', 'Compter et manipuler les nombres', 'Tenir son crayon et écrire'], subjects: ['Lecture', 'Écriture', 'Calcul'], support: ['Séances courtes et ludiques', 'Enseignant à domicile', 'Point régulier avec les parents'] },
      { id: 'cp', label: 'CP', title: 'Apprendre à lire au CP', intro: "Le CP consolide la lecture et l'écriture : une étape décisive pour la confiance de votre enfant.", goals: ['Lire des phrases simples', 'Écrire sans modèle', 'Additionner et soustraire'], subjects: ['Lecture', 'Dictée', 'Mathématiques'], support: ['Exercices adaptés à son niveau', 'Lecture à voix haute', 'Bilan mensuel'] },
      { id: 'ce1', label: 'CE1', title: 'Gagner en autonomie au CE1', intro: 'Votre enfant lit de mieux en mieux et commence à travailler seul.', goals: ['Comprendre un texte court', 'Maîtriser les tables d’addition', 'Soigner son écriture'], subjects: ['Français', 'Mathématiques', 'Anglais'], support: ['Aide aux devoirs', 'Méthodes de mémorisation', 'Suivi des progrès'] },
      { id: 'ce2', label: 'CE2', title: 'Consolider les acquis au CE2', intro: 'Les notions se complexifient : grammaire, conjugaison et multiplications.', goals: ['Conjuguer les temps simples', 'Connaître les tables de multiplication', 'Rédiger quelques phrases'], subjects: ['Français', 'Mathématiques', 'Sciences'], support: ['Révisions ciblées', 'Exercices progressifs', 'Bilan trimestriel'] },
      { id: 'cm1', label: 'CM1', title: 'Approfondir au CM1', intro: 'Le CM1 prépare le dernier cycle du primaire avec plus de rigueur.', goals: ['Rédiger un texte structuré', 'Maîtriser les fractions simples', 'Organiser son travail'], subjects: ['Français', 'Mathématiques', 'Histoire-Géo'], support: ['Méthodologie', 'Préparation des évaluations', 'Suivi régulier'] },
      { id: 'cm2', label: 'CM2', title: 'Réussir le CM2 et l’entrée en 6e', intro: 'Année du CEP et du concours d’entrée en 6e : on révise, on s’entraîne, on prend confiance.', goals: ['Réussir le CEP', 'Préparer le concours d’entrée en 6e', 'Devenir autonome'], subjects: ['Français', 'Mathématiques', 'Sciences', 'Anglais'], support: ['Annales et sujets types', 'Stages de révision', 'Examens blancs'] },
    ],
    subjects: [
      { name: 'Mathématiques', tagline: 'Compter, calculer et raisonner avec méthode.' },
      { name: 'Français', tagline: 'Lire, écrire et s’exprimer avec aisance.' },
      { name: 'Anglais', tagline: 'Découvrir la deuxième langue officielle tôt.' },
      { name: 'Aide aux devoirs', tagline: 'Un accompagnement quotidien et bienveillant.' },
    ],
    cta: { image: CTA_IMAGE, title: 'Un conseiller pour votre enfant', text: 'Remplissez le formulaire et bénéficiez d’un bilan personnalisé offert, sans engagement.' },
    faq: [
      { q: 'À partir de quel âge proposez-vous des cours ?', a: 'Dès la SIL. Les séances sont adaptées à l’âge de l’enfant : courtes, ludiques et progressives.' },
      { q: 'Les cours ont-ils lieu à domicile ?', a: 'Oui, nos enseignants se déplacent chez vous. Des cours en ligne sont aussi possibles.' },
      { q: 'Préparez-vous le concours d’entrée en 6e ?', a: 'Oui, avec des annales, des examens blancs et des stages intensifs pendant les vacances.' },
      { q: 'Comment suivez-vous les progrès ?', a: 'L’enseignant fait un point régulier avec vous et un bilan est disponible dans votre espace parent.' },
    ],
  },

  college: {
    label: 'Collège',
    inLabel: 'au collège',
    role: 'parent',
    hero: {
      image: '/c.jpg',
      title: 'Les enjeux au collège',
      lead: 'De la 6e à la 3e, votre enfant gagne en autonomie et découvre de nouvelles matières. Nos enseignants l’aident à garder le rythme et à réussir le BEPC.',
      tag: 'De la 6e à la 3e',
    },
    challenges: [
      { title: 'Réussir sa transition', text: 'Nouveaux professeurs, nouvelles matières : on prend vite les bons réflexes.', image: '/e.jpg', offers: ['Cours particuliers', 'Méthodologie'] },
      { title: 'Combler les lacunes', text: 'Identifier les notions mal comprises et les retravailler avant qu’elles ne s’accumulent.', image: '/i.jpg', offers: ['Cours particuliers', 'Cours en ligne'] },
      { title: 'Préparer le BEPC', text: 'Réviser efficacement et s’entraîner sur des sujets d’examen.', image: '/b.jpg', offers: ['Stages', 'Examens blancs'] },
    ],
    classesTitle: 'En quelle classe est votre enfant ?',
    classes: [
      { id: '6e', label: '6e', title: 'Bien entrer au collège en 6e', intro: 'Une année d’adaptation : organisation, prise de notes et nouvelles matières.', goals: ['S’organiser avec plusieurs professeurs', 'Prendre des notes', 'Apprendre ses leçons'], subjects: ['Français', 'Mathématiques', 'Anglais'], support: ['Méthodologie', 'Aide aux devoirs', 'Point mensuel'] },
      { id: '5e', label: '5e', title: 'Consolider en 5e', intro: 'Les bases de la 6e sont approfondies et de nouvelles notions apparaissent.', goals: ['Maîtriser le calcul littéral', 'Rédiger un paragraphe argumenté', 'Travailler plus en autonomie'], subjects: ['Mathématiques', 'Français', 'Sciences'], support: ['Révisions ciblées', 'Exercices progressifs', 'Suivi régulier'] },
      { id: '4e', label: '4e', title: 'Approfondir en 4e', intro: 'Année charnière : le programme s’intensifie avant la dernière ligne droite.', goals: ['Maîtriser les équations', 'Analyser un texte', 'Préparer l’orientation'], subjects: ['Mathématiques', 'Physique-Chimie', 'Anglais'], support: ['Cours particuliers', 'Fiches de révision', 'Bilan trimestriel'] },
      { id: '3e', label: '3e', title: 'Réussir la 3e et le BEPC', intro: 'Objectif BEPC : on révise toutes les matières et on s’entraîne en conditions réelles.', goals: ['Obtenir le BEPC', 'Bien choisir sa série au lycée', 'Gérer son stress'], subjects: ['Mathématiques', 'Français', 'Physique-Chimie', 'SVT'], support: ['Annales du BEPC', 'Examens blancs', 'Stages intensifs'] },
    ],
    subjects: [
      { name: 'Mathématiques', tagline: 'Comprendre la logique et gagner en rigueur.' },
      { name: 'Français', tagline: 'Rédiger, argumenter et analyser des textes.' },
      { name: 'Anglais', tagline: 'Progresser à l’écrit comme à l’oral.' },
      { name: 'Physique-Chimie', tagline: 'Relier les formules aux phénomènes concrets.' },
    ],
    cta: { image: CTA_IMAGE, title: 'Un conseiller pour votre collégien', text: 'Remplissez le formulaire et bénéficiez d’un bilan personnalisé offert, sans engagement.' },
    faq: [
      { q: 'Combien d’heures de cours par semaine ?', a: 'En général une à trois séances par semaine, selon les besoins et les objectifs de votre enfant.' },
      { q: 'Proposez-vous des stages de préparation au BEPC ?', a: 'Oui, pendant les vacances et dans les semaines qui précèdent l’examen, en petits groupes.' },
      { q: 'Puis-je changer d’enseignant ?', a: 'Oui. Si le courant ne passe pas, votre conseiller vous propose un autre enseignant rapidement.' },
      { q: 'Les cours sont-ils adaptés au programme camerounais ?', a: 'Oui, nos enseignants suivent le programme officiel, en sous-système francophone comme anglophone.' },
    ],
  },

  lycee: {
    label: 'Lycée',
    inLabel: 'au lycée',
    role: 'parent',
    hero: {
      image: '/i.jpg',
      title: 'Les enjeux au lycée',
      lead: 'De la seconde à la terminale, chaque année compte : choix de série, Probatoire puis Baccalauréat. Nos enseignants spécialisés aident votre enfant à viser la mention.',
      tag: 'De la 2nde à la Tle',
    },
    challenges: [
      { title: 'Choisir sa série', text: 'Renforcer les matières clés pour accéder à la série visée.', image: '/e.jpg', offers: ['Cours particuliers', 'Orientation'] },
      { title: 'Réussir le Probatoire', text: 'Une préparation complète pour aborder l’examen sereinement.', image: '/c.jpg', offers: ['Stages', 'Examens blancs'] },
      { title: 'Viser la mention au Bac', text: 'Approfondir, s’entraîner et gagner les points qui font la différence.', image: '/j.jpg', offers: ['Cours particuliers', 'Cours en ligne'] },
    ],
    classesTitle: 'En quelle classe est votre enfant ?',
    classes: [
      { id: '2nde', label: '2nde', title: 'Bien démarrer la seconde', intro: 'Le rythme s’accélère : il faut consolider les bases et préparer le choix de série.', goals: ['S’adapter au rythme du lycée', 'Renforcer les matières principales', 'Préparer son orientation'], subjects: ['Mathématiques', 'Français', 'Physique-Chimie'], support: ['Méthodologie', 'Cours particuliers', 'Bilan trimestriel'] },
      { id: '1ere', label: '1ère', title: 'Réussir la première et le Probatoire', intro: 'Année du Probatoire : révisions régulières et entraînement sur annales.', goals: ['Obtenir le Probatoire', 'Maîtriser les matières de la série', 'Travailler en autonomie'], subjects: ['Mathématiques', 'Physique-Chimie', 'Philosophie', 'Anglais'], support: ['Annales du Probatoire', 'Examens blancs', 'Stages intensifs'] },
      { id: 'tle', label: 'Tle', title: 'Décrocher le Baccalauréat', intro: 'Dernière ligne droite : on vise le Bac avec mention et on prépare le supérieur.', goals: ['Obtenir le Bac avec mention', 'Préparer les concours post-bac', 'Gérer le stress de l’examen'], subjects: ['Mathématiques', 'Philosophie', 'SVT', 'Physique-Chimie'], support: ['Annales du Bac', 'Examens blancs', 'Préparation aux concours'] },
    ],
    subjects: [
      { name: 'Mathématiques', tagline: 'Maîtriser l’analyse, l’algèbre et les probabilités.' },
      { name: 'Physique-Chimie', tagline: 'Réussir les exercices d’examen avec méthode.' },
      { name: 'Philosophie', tagline: 'Construire une dissertation solide.' },
      { name: 'Anglais', tagline: 'Gagner en aisance pour l’écrit et l’oral.' },
    ],
    cta: { image: CTA_IMAGE, title: 'Un conseiller pour votre lycéen', text: 'Remplissez le formulaire et bénéficiez d’un bilan personnalisé offert, sans engagement.' },
    faq: [
      { q: 'Vos enseignants connaissent-ils les séries C, D, A et TI ?', a: 'Oui, nous sélectionnons l’enseignant selon la série et les matières à renforcer.' },
      { q: 'Proposez-vous des examens blancs ?', a: 'Oui, pour le Probatoire et le Baccalauréat, avec une correction détaillée.' },
      { q: 'Aidez-vous à préparer les concours post-bac ?', a: 'Oui : écoles d’ingénieurs, de médecine, ENS et autres concours, en cours particuliers ou en stage.' },
      { q: 'Les cours peuvent-ils se faire en ligne ?', a: 'Oui, tous nos accompagnements existent aussi en visioconférence.' },
    ],
  },

  superieur: {
    label: 'Supérieur',
    inLabel: 'dans le supérieur',
    role: 'student',
    hero: {
      image: '/n.jpg',
      title: 'Les enjeux dans le supérieur',
      lead: 'Université, grandes écoles ou concours : le supérieur demande méthode et autonomie. Nos enseignants spécialisés vous aident à valider vos semestres et à réussir vos concours.',
      tag: 'Licence, Master, concours',
    },
    challenges: [
      { title: 'Réussir sa première année', text: 'Prendre le rythme de l’université et valider ses unités d’enseignement.', image: '/z.jpg', offers: ['Cours particuliers', 'Méthodologie'] },
      { title: 'Préparer les concours', text: 'Grandes écoles, fonction publique : une préparation ciblée et exigeante.', image: '/l.jpg', offers: ['Stages', 'Cours particuliers'] },
      { title: 'Rédiger son mémoire', text: 'Problématique, plan, rédaction : un accompagnement à chaque étape.', image: '/w.jpg', offers: ['Cours en ligne', 'Méthodologie'] },
    ],
    classesTitle: 'Où en êtes-vous dans vos études ?',
    classes: [
      { id: 'l1', label: 'Licence 1', title: 'Réussir sa première année', intro: 'La L1 est souvent la plus sélective : on prend vite de bonnes méthodes de travail.', goals: ['Valider ses UE', 'S’organiser en autonomie', 'Prendre des notes efficaces'], subjects: ['Mathématiques', 'Physique', 'Économie'], support: ['Méthodologie universitaire', 'Révisions des partiels', 'Suivi régulier'] },
      { id: 'l2l3', label: 'Licence 2-3', title: 'Se spécialiser en licence', intro: 'Les matières se spécialisent : on approfondit pour garder une bonne moyenne.', goals: ['Approfondir les matières clés', 'Préparer le Master', 'Réussir les examens'], subjects: ['Statistiques', 'Droit', 'Informatique'], support: ['Cours particuliers', 'Préparation des examens', 'Aide aux exposés'] },
      { id: 'master', label: 'Master', title: 'Réussir son Master', intro: 'Recherche, mémoire et stage : un accompagnement exigeant et sur-mesure.', goals: ['Rédiger son mémoire', 'Préparer la soutenance', 'Maîtriser les outils d’analyse'], subjects: ['Méthodologie', 'Statistiques', 'Anglais'], support: ['Relecture et conseils', 'Préparation à l’oral', 'Enseignants docteurs'] },
      { id: 'concours', label: 'Concours', title: 'Réussir les concours', intro: 'ENSP, ENS, ENAM, écoles de santé : une préparation ciblée selon le concours visé.', goals: ['Maîtriser le programme du concours', 'S’entraîner sur annales', 'Préparer l’oral'], subjects: ['Mathématiques', 'Culture générale', 'Physique'], support: ['Stages intensifs', 'Concours blancs', 'Coaching oral'] },
    ],
    subjects: [
      { name: 'Mathématiques', tagline: 'Analyse, algèbre et statistiques pour le supérieur.' },
      { name: 'Informatique', tagline: 'Programmation, algorithmique et bases de données.' },
      { name: 'Économie-Gestion', tagline: 'Comprendre et appliquer les concepts clés.' },
      { name: 'Méthodologie', tagline: 'Mémoire, exposés et organisation du travail.' },
    ],
    cta: { image: CTA_IMAGE, title: 'Un conseiller pour vos études', text: 'Remplissez le formulaire et bénéficiez d’un bilan personnalisé offert, sans engagement.' },
    faq: [
      { q: 'Vos enseignants ont-ils le niveau pour le supérieur ?', a: 'Oui, ils sont titulaires d’un Master ou d’un doctorat dans la discipline enseignée.' },
      { q: 'Pouvez-vous m’aider pour mon mémoire ?', a: 'Oui, de la problématique à la soutenance, sans jamais rédiger à votre place.' },
      { q: 'Quels concours préparez-vous ?', a: 'Les concours des grandes écoles camerounaises (ENSP, ENS, ENAM…) et des écoles de santé.' },
      { q: 'Les cours sont-ils possibles le soir ?', a: 'Oui, les horaires s’adaptent à votre emploi du temps, en présentiel ou en ligne.' },
    ],
  },

  adultes: {
    label: 'Adulte',
    inLabel: 'pour adultes',
    role: 'student',
    hero: {
      image: '/k.jpg',
      title: 'Apprendre à tout âge',
      lead: 'Remise à niveau, langues, informatique ou concours administratifs : nos enseignants s’adaptent à vos objectifs et à votre emploi du temps.',
      tag: 'Formation continue',
    },
    challenges: [
      { title: 'Se remettre à niveau', text: 'Reprendre les bases en français, en mathématiques ou en anglais.', image: '/m.jpg', offers: ['Cours particuliers', 'Cours en ligne'] },
      { title: 'Évoluer professionnellement', text: 'Langues, bureautique, prise de parole : des compétences utiles au travail.', image: '/j.jpg', offers: ['Cours particuliers', 'Petits groupes'] },
      { title: 'Réussir un concours', text: 'Préparer les concours administratifs avec un enseignant expérimenté.', image: '/l.jpg', offers: ['Stages', 'Cours particuliers'] },
    ],
    classesTitle: 'Quel est votre objectif ?',
    classes: [
      { id: 'remise', label: 'Remise à niveau', title: 'Reprendre les bases', intro: 'Pour reprendre des études, passer un examen ou simplement gagner en confiance.', goals: ['Revoir les fondamentaux', 'Reprendre confiance', 'Avancer à son rythme'], subjects: ['Français', 'Mathématiques', 'Anglais'], support: ['Bilan de niveau', 'Programme sur-mesure', 'Horaires flexibles'] },
      { id: 'langues', label: 'Langues', title: 'Parler une langue avec aisance', intro: 'Anglais, français ou allemand : on progresse à l’oral comme à l’écrit.', goals: ['Gagner en aisance à l’oral', 'Préparer une certification', 'Communiquer au travail'], subjects: ['Anglais', 'Français', 'Allemand'], support: ['Conversation', 'Préparation TOEIC / TOEFL / DELF', 'Cours en ligne'] },
      { id: 'info', label: 'Informatique', title: 'Maîtriser les outils numériques', intro: 'Bureautique, internet ou programmation : des compétences directement utiles.', goals: ['Maîtriser Word et Excel', 'Utiliser internet en sécurité', 'S’initier à la programmation'], subjects: ['Bureautique', 'Internet', 'Programmation'], support: ['Exercices pratiques', 'Cas concrets', 'Suivi personnalisé'] },
      { id: 'concours', label: 'Concours', title: 'Préparer un concours administratif', intro: 'Une préparation méthodique aux épreuves écrites et orales.', goals: ['Maîtriser le programme', 'S’entraîner sur annales', 'Réussir l’oral'], subjects: ['Culture générale', 'Français', 'Mathématiques'], support: ['Concours blancs', 'Coaching oral', 'Stages intensifs'] },
    ],
    subjects: [
      { name: 'Anglais', tagline: 'Progresser vite, à l’oral comme à l’écrit.' },
      { name: 'Français', tagline: 'Écrire et s’exprimer avec assurance.' },
      { name: 'Informatique', tagline: 'Des outils numériques maîtrisés au quotidien.' },
      { name: 'Culture générale', tagline: 'Se préparer aux concours et aux entretiens.' },
    ],
    cta: { image: CTA_IMAGE, title: 'Un conseiller pour votre projet', text: 'Remplissez le formulaire et bénéficiez d’un bilan personnalisé offert, sans engagement.' },
    faq: [
      { q: 'Les cours sont-ils possibles le soir ou le week-end ?', a: 'Oui, les horaires sont fixés avec l’enseignant selon votre emploi du temps.' },
      { q: 'Préparez-vous aux certifications de langue ?', a: 'Oui : TOEIC, TOEFL, IELTS, DELF et DALF.' },
      { q: 'Faut-il un niveau minimum ?', a: 'Non, un bilan de départ permet d’adapter le programme à votre niveau.' },
      { q: 'Les cours peuvent-ils avoir lieu sur mon lieu de travail ?', a: 'Oui, à domicile, au bureau ou en ligne selon votre préférence.' },
    ],
  },
}
