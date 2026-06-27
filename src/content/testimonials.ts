// TODO: remplacer par les vrais témoignages des clients lorsqu'ils seront fournis.
import type { LocalizedText } from "./therapies";

export type TestimonialCategory = "energetique" | "guerison" | "spirituel";

export type Testimonial = {
  id: string;
  name: string;
  city: string;
  date: string;
  rating: number;
  category: TestimonialCategory;
  body: LocalizedText;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Marie L.",
    city: "Rouen",
    date: "2025-09-12",
    rating: 5,
    category: "energetique",
    body: {
      fr: "Une rencontre lumineuse. J'ai ressenti une paix profonde dès la fin de la séance, et mon sommeil s'est apaisé en quelques jours. Merci du fond du cœur.",
      en: "A luminous encounter. I felt deep peace right after the session, and my sleep eased within days. Heartfelt thanks.",
      es: "Un encuentro luminoso. Sentí una paz profunda al final de la sesión y mi sueño mejoró en pocos días.",
      de: "Eine lichtvolle Begegnung. Ich spürte sofort tiefen Frieden, und mein Schlaf wurde innerhalb von Tagen ruhiger.",
      it: "Un incontro luminoso. Ho sentito una pace profonda alla fine della seduta e il sonno è migliorato in pochi giorni.",
      nl: "Een lichtvolle ontmoeting. Ik voelde diepe rust na de sessie, en mijn slaap werd binnen enkele dagen rustiger.",
      pl: "Świetliste spotkanie. Po sesji poczułam głęboki spokój, a mój sen poprawił się w kilka dni.",
      pt: "Um encontro luminoso. Senti uma paz profunda no fim da sessão e o meu sono melhorou em poucos dias.",
    },
  },
  {
    id: "2",
    name: "Thomas R.",
    city: "Paris",
    date: "2025-08-03",
    rating: 5,
    category: "spirituel",
    body: {
      fr: "Jabamiah m'a aidé à voir clair dans une période difficile. Une écoute incroyable et une vraie justesse dans les mots.",
      en: "Jabamiah helped me see clearly through a tough time. Incredible listening and very precise words.",
      es: "Jabamiah me ayudó a ver con claridad en un momento difícil. Una escucha increíble y palabras muy justas.",
      de: "Jabamiah hat mir in einer schweren Zeit Klarheit gegeben. Unglaublich aufmerksam und sehr treffende Worte.",
      it: "Jabamiah mi ha aiutato a vedere chiaro in un momento difficile. Ascolto incredibile e parole precise.",
      nl: "Jabamiah hielp me helder te zien in een moeilijke tijd. Ongelooflijk luisterend en heel rake woorden.",
      pl: "Jabamiah pomogła mi zobaczyć jasno w trudnym czasie. Niesamowite słuchanie i bardzo trafne słowa.",
      pt: "Jabamiah ajudou-me a ver com clareza num momento difícil. Uma escuta incrível e palavras muito justas.",
    },
  },
  {
    id: "3",
    name: "Sophie D.",
    city: "Lyon",
    date: "2025-07-20",
    rating: 5,
    category: "guerison",
    body: {
      fr: "Une approche douce et profondément humaine. J'ai retrouvé confiance en moi grâce à son accompagnement bienveillant.",
      en: "A gentle and deeply human approach. I regained self-confidence thanks to her kind support.",
      es: "Un enfoque suave y profundamente humano. Recuperé la confianza en mí gracias a su acompañamiento.",
      de: "Ein sanfter und zutiefst menschlicher Ansatz. Ich habe dank ihrer Begleitung Selbstvertrauen zurückgewonnen.",
      it: "Un approccio dolce e profondamente umano. Ho ritrovato fiducia in me grazie al suo accompagnamento.",
      nl: "Een zachte en diep menselijke aanpak. Ik heb dankzij haar begeleiding zelfvertrouwen teruggevonden.",
      pl: "Łagodne i głęboko ludzkie podejście. Dzięki towarzyszeniu odzyskałam wiarę w siebie.",
      pt: "Uma abordagem suave e profundamente humana. Recuperei a confiança em mim graças ao seu acompanhamento.",
    },
  },
  {
    id: "4",
    name: "Anne-Claire M.",
    city: "Forges-les-Eaux",
    date: "2025-06-05",
    rating: 5,
    category: "energetique",
    body: {
      fr: "Je suis sortie de la séance allégée d'un poids que je portais depuis des années. Bouleversant et libérateur.",
      en: "I left the session lighter of a weight I had carried for years. Moving and freeing.",
      es: "Salí de la sesión liberada de un peso que cargaba desde hacía años.",
      de: "Ich verließ die Sitzung leichter, befreit von einer jahrelangen Last.",
      it: "Sono uscita dalla seduta alleggerita di un peso che portavo da anni.",
      nl: "Ik verliet de sessie verlost van een last die ik jaren droeg.",
      pl: "Wyszłam z sesji uwolniona od ciężaru, który nosiłam latami.",
      pt: "Saí da sessão liberta de um peso que carregava há anos.",
    },
  },
  {
    id: "5",
    name: "Julien P.",
    city: "Dieppe",
    date: "2025-05-22",
    rating: 5,
    category: "spirituel",
    body: {
      fr: "Une vraie ouverture du cœur. J'ai compris ce qui me bloquait et j'avance enfin sereinement.",
      en: "A true opening of the heart. I understood what was blocking me and finally move forward calmly.",
      es: "Una verdadera apertura del corazón. Entendí lo que me bloqueaba y avanzo con calma.",
      de: "Eine echte Herzöffnung. Ich verstand, was mich blockierte, und gehe nun gelassen voran.",
      it: "Una vera apertura del cuore. Ho capito cosa mi bloccava e ora avanzo sereno.",
      nl: "Een echte hartopening. Ik begreep wat me tegenhield en ga nu rustig verder.",
      pl: "Prawdziwe otwarcie serca. Zrozumiałem, co mnie blokowało i wreszcie idę spokojnie.",
      pt: "Uma verdadeira abertura do coração. Entendi o que me bloqueava e avanço sereno.",
    },
  },
  {
    id: "6",
    name: "Camille B.",
    city: "Le Havre",
    date: "2025-04-18",
    rating: 5,
    category: "guerison",
    body: {
      fr: "Les conseils en plantes ont transformé mon quotidien. Mon énergie est revenue et mes douleurs ont diminué.",
      en: "Plant advice transformed my daily life. My energy returned and pains decreased.",
      es: "Los consejos en plantas transformaron mi día a día. Volvió mi energía y disminuyeron los dolores.",
      de: "Die Pflanzenberatung hat meinen Alltag verändert. Meine Energie kam zurück und Schmerzen ließen nach.",
      it: "I consigli sulle piante hanno trasformato la mia quotidianità. Energia tornata e dolori diminuiti.",
      nl: "Het plantenadvies veranderde mijn dagelijks leven. Energie kwam terug en pijn nam af.",
      pl: "Porady ziołowe odmieniły moją codzienność. Wróciła energia, ból się zmniejszył.",
      pt: "Os conselhos sobre plantas transformaram o meu dia a dia. A energia voltou e as dores diminuíram.",
    },
  },
  {
    id: "7",
    name: "Émilie F.",
    city: "Caen",
    date: "2025-03-30",
    rating: 5,
    category: "energetique",
    body: {
      fr: "Un don, une lumière, une oreille bienveillante. Je recommande à toutes les âmes en quête de paix.",
      en: "A gift, a light, a kind ear. I recommend to all souls seeking peace.",
      es: "Un don, una luz, un oído bondadoso. Lo recomiendo a toda alma que busca paz.",
      de: "Ein Geschenk, ein Licht, ein offenes Ohr. Ich empfehle es allen Seelen auf Friedenssuche.",
      it: "Un dono, una luce, un orecchio benevolo. Lo consiglio a tutte le anime in cerca di pace.",
      nl: "Een geschenk, een licht, een vriendelijk oor. Aanbevolen voor elke ziel die rust zoekt.",
      pl: "Dar, światło, życzliwe ucho. Polecam każdej duszy szukającej spokoju.",
      pt: "Um dom, uma luz, um ouvido bondoso. Recomendo a todas as almas em busca de paz.",
    },
  },
  {
    id: "8",
    name: "Bastien L.",
    city: "Beauvais",
    date: "2025-02-14",
    rating: 5,
    category: "spirituel",
    body: {
      fr: "J'ai trouvé un guide humble et juste. Chaque échange m'élève un peu plus.",
      en: "I found a humble and accurate guide. Every exchange lifts me a little more.",
      es: "Encontré un guía humilde y certero. Cada intercambio me eleva un poco más.",
      de: "Ich habe einen bescheidenen und treffsicheren Begleiter gefunden. Jedes Gespräch hebt mich höher.",
      it: "Ho trovato una guida umile e giusta. Ogni scambio mi eleva un po' di più.",
      nl: "Ik vond een bescheiden en rake gids. Elk gesprek tilt me een beetje meer op.",
      pl: "Znalazłem skromnego i trafnego przewodnika. Każda rozmowa podnosi mnie wyżej.",
      pt: "Encontrei um guia humilde e justo. Cada conversa eleva-me um pouco mais.",
    },
  },
  {
    id: "9",
    name: "Isabelle V.",
    city: "Amiens",
    date: "2025-01-08",
    rating: 5,
    category: "guerison",
    body: {
      fr: "Une présence rare. J'ai pleuré, j'ai ri, et je suis repartie pleine d'espérance.",
      en: "A rare presence. I cried, I laughed, and I left full of hope.",
      es: "Una presencia rara. Lloré, reí y salí llena de esperanza.",
      de: "Eine seltene Präsenz. Ich habe geweint, gelacht und voller Hoffnung weitergemacht.",
      it: "Una presenza rara. Ho pianto, ho riso e sono uscita piena di speranza.",
      nl: "Een zeldzame aanwezigheid. Ik huilde, lachte en vertrok vol hoop.",
      pl: "Rzadka obecność. Płakałam, śmiałam się i wyszłam pełna nadziei.",
      pt: "Uma presença rara. Chorei, ri e saí cheia de esperança.",
    },
  },
];
