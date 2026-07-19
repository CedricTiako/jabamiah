import approachEnergy from "../assets/approach-energy.jpg";
import approachMind from "../assets/approach-mind.jpg";
import approachPlants from "../assets/approach-plants.jpg";
import approachHarmony from "../assets/approach-harmony.jpg";
import approachSpirit from "../assets/approach-spirit.jpg";

export type LocalizedText = Record<string, string>;
export type LocalizedList = Record<string, string[]>;

export type Therapy = {
  slug: string;
  iconName: "sparkles" | "sun" | "leaf" | "compass" | "heart-handshake";
  image: string;
  title: LocalizedText;
  short: LocalizedText;
  intro: LocalizedText;
  benefits: LocalizedList;
  forWhom: LocalizedText;
};

const fallback = (text: LocalizedText, locale: string) =>
  text[locale] ?? text.fr ?? text.en ?? Object.values(text)[0] ?? "";

export function localized(text: LocalizedText, locale: string): string {
  return fallback(text, locale);
}

export function localizedList(list: LocalizedList, locale: string): string[] {
  return list[locale] ?? list.fr ?? list.en ?? Object.values(list)[0] ?? [];
}

export const THERAPIES: Therapy[] = [
  {
    slug: "soins-energetiques",
    iconName: "sparkles",
    image: approachEnergy,
    title: {
      fr: "Soins énergétiques",
      en: "Energy healing",
      es: "Cuidados energéticos",
      de: "Energiebehandlungen",
      it: "Cure energetiche",
      nl: "Energetische zorg",
      pl: "Terapia energetyczna",
      pt: "Cuidados energéticos",
    },
    short: {
      fr: "Rééquilibrez vos énergies, libérez les blocages et retrouvez votre harmonie intérieure.",
      en: "Rebalance your energies, release blockages and restore inner harmony.",
      es: "Reequilibre sus energías, libere bloqueos y recupere su armonía interior.",
      de: "Bringen Sie Ihre Energien ins Gleichgewicht und lösen Sie Blockaden.",
      it: "Riequilibra le tue energie, libera i blocchi e ritrova l'armonia interiore.",
      nl: "Breng uw energieën in balans en laat blokkades los.",
      pl: "Zrównoważ swoje energie, uwolnij blokady i odzyskaj wewnętrzną harmonię.",
      pt: "Reequilibre as suas energias, liberte bloqueios e recupere a harmonia interior.",
    },
    intro: {
      fr: "Le soin énergétique agit sur les corps subtils pour rééquilibrer la circulation de l'énergie vitale. À travers l'imposition des mains, la radiesthésie et la connexion au cœur, j'aide votre corps à libérer ce qui pèse et à retrouver sa vitalité naturelle.",
      en: "Energy healing acts on the subtle bodies to rebalance the flow of life force. Through laying on of hands, dowsing and heart connection, I help your body release what weighs it down and recover its natural vitality.",
      es: "El cuidado energético actúa sobre los cuerpos sutiles para reequilibrar el flujo de energía vital.",
      de: "Die Energiebehandlung wirkt auf die feinstofflichen Körper, um den Lebensenergiefluss auszugleichen.",
      it: "La cura energetica agisce sui corpi sottili per riequilibrare il flusso dell'energia vitale.",
      nl: "Energetische zorg werkt op de fijnstoffelijke lichamen om de levensenergie weer in balans te brengen.",
      pl: "Terapia energetyczna działa na subtelne ciała, aby zrównoważyć przepływ energii życiowej.",
      pt: "O cuidado energético atua nos corpos subtis para reequilibrar o fluxo da energia vital.",
    },
    benefits: {
      fr: [
        "Libération des tensions et du stress",
        "Apaisement émotionnel profond",
        "Meilleur sommeil et regain d'énergie",
        "Clarté mentale et reconnexion à soi",
      ],
      en: [
        "Release of tension and stress",
        "Deep emotional relief",
        "Better sleep and renewed energy",
        "Mental clarity and reconnection to self",
      ],
      es: [
        "Liberación de tensiones y estrés",
        "Profundo alivio emocional",
        "Mejor sueño y energía renovada",
        "Claridad mental y reconexión consigo mismo",
      ],
      de: [
        "Lösung von Spannungen und Stress",
        "Tiefe emotionale Erleichterung",
        "Besserer Schlaf und neue Energie",
        "Geistige Klarheit und Selbstverbindung",
      ],
      it: [
        "Liberazione di tensioni e stress",
        "Profondo sollievo emotivo",
        "Sonno migliore ed energia ritrovata",
        "Chiarezza mentale e riconnessione a sé",
      ],
      nl: [
        "Loslaten van spanning en stress",
        "Diepe emotionele verlichting",
        "Betere slaap en hernieuwde energie",
        "Mentale helderheid en verbinding met jezelf",
      ],
      pl: [
        "Uwolnienie napięć i stresu",
        "Głęboka ulga emocjonalna",
        "Lepszy sen i nowa energia",
        "Jasność umysłu i ponowne połączenie z sobą",
      ],
      pt: [
        "Libertação de tensões e stress",
        "Profundo alívio emocional",
        "Melhor sono e energia renovada",
        "Clareza mental e reconexão consigo",
      ],
    },
    forWhom: {
      fr: "Pour toute personne ressentant de la fatigue, du stress, des émotions lourdes ou une recherche d'équilibre profond.",
      en: "For anyone feeling fatigue, stress, heavy emotions or seeking deep balance.",
      es: "Para quien sienta fatiga, estrés, emociones difíciles o busque un equilibrio profundo.",
      de: "Für alle, die Müdigkeit, Stress oder schwere Gefühle erleben oder tiefes Gleichgewicht suchen.",
      it: "Per chi prova stanchezza, stress, emozioni pesanti o cerca un equilibrio profondo.",
      nl: "Voor wie vermoeidheid, stress of zware emoties voelt of diep evenwicht zoekt.",
      pl: "Dla każdego, kto odczuwa zmęczenie, stres lub szuka głębokiej równowagi.",
      pt: "Para quem sente cansaço, stress, emoções pesadas ou procura equilíbrio profundo.",
    },
  },
  {
    slug: "guerison-par-la-pensee",
    iconName: "sun",
    image: approachMind,
    title: {
      fr: "Guérison par la pensée",
      en: "Healing through thought",
      es: "Sanación a través del pensamiento",
      de: "Heilung durch Gedanken",
      it: "Guarigione con il pensiero",
      nl: "Genezing door gedachten",
      pl: "Uzdrawianie myślą",
      pt: "Cura pelo pensamento",
    },
    short: {
      fr: "Transformez vos pensées limitantes et activez votre pouvoir d'auto-guérison.",
      en: "Transform limiting thoughts and activate your self-healing power.",
      es: "Transforme pensamientos limitantes y active su poder de autosanación.",
      de: "Verwandeln Sie einschränkende Gedanken und aktivieren Sie Ihre Selbstheilung.",
      it: "Trasforma i pensieri limitanti e attiva il tuo potere di auto-guarigione.",
      nl: "Transformeer beperkende gedachten en activeer uw zelfgenezend vermogen.",
      pl: "Przekształć ograniczające myśli i uruchom moc samouzdrowienia.",
      pt: "Transforme pensamentos limitantes e ative o seu poder de autocura.",
    },
    intro: {
      fr: "Nos pensées créent notre réalité intérieure. À travers la visualisation, l'intention juste et la méditation guidée, je vous accompagne pour reprogrammer ce qui vous freine et révéler le potentiel lumineux qui sommeille en vous.",
      en: "Our thoughts shape our inner reality. Through visualization, right intention and guided meditation, I help you reprogram what holds you back and reveal the bright potential within you.",
      es: "Nuestros pensamientos crean nuestra realidad interior. Le acompaño con visualización, intención correcta y meditación guiada.",
      de: "Unsere Gedanken formen unsere innere Realität. Durch Visualisierung, rechte Absicht und geführte Meditation begleite ich Sie.",
      it: "I nostri pensieri creano la realtà interiore. Ti accompagno con visualizzazione, intenzione giusta e meditazione guidata.",
      nl: "Onze gedachten vormen onze innerlijke realiteit. Ik begeleid u met visualisatie, juiste intentie en geleide meditatie.",
      pl: "Nasze myśli tworzą wewnętrzną rzeczywistość. Towarzyszę Ci poprzez wizualizację, właściwą intencję i medytację.",
      pt: "Os nossos pensamentos criam a nossa realidade interior. Acompanho-o com visualização, intenção justa e meditação guiada.",
    },
    benefits: {
      fr: [
        "Libération des croyances limitantes",
        "Reprogrammation positive du mental",
        "Confiance et estime de soi renforcées",
        "Activation du pouvoir d'auto-guérison",
      ],
      en: [
        "Release of limiting beliefs",
        "Positive mental reprogramming",
        "Stronger self-confidence",
        "Activation of self-healing",
      ],
      es: [
        "Liberación de creencias limitantes",
        "Reprogramación mental positiva",
        "Mayor confianza en sí mismo",
        "Activación de la autosanación",
      ],
      de: [
        "Lösung einschränkender Überzeugungen",
        "Positive geistige Neuprogrammierung",
        "Stärkeres Selbstvertrauen",
        "Aktivierung der Selbstheilung",
      ],
      it: [
        "Liberazione di credenze limitanti",
        "Riprogrammazione mentale positiva",
        "Maggiore fiducia in sé",
        "Attivazione dell'auto-guarigione",
      ],
      nl: [
        "Loslaten van beperkende overtuigingen",
        "Positieve mentale herprogrammering",
        "Sterker zelfvertrouwen",
        "Activering van zelfgenezing",
      ],
      pl: [
        "Uwolnienie ograniczających przekonań",
        "Pozytywne przeprogramowanie umysłu",
        "Większa pewność siebie",
        "Aktywacja samouzdrowienia",
      ],
      pt: [
        "Libertação de crenças limitantes",
        "Reprogramação mental positiva",
        "Maior confiança em si",
        "Ativação da autocura",
      ],
    },
    forWhom: {
      fr: "Pour celles et ceux qui souhaitent transformer leur dialogue intérieur et avancer avec confiance.",
      en: "For those who want to transform inner dialogue and move forward with confidence.",
      es: "Para quienes desean transformar el diálogo interior y avanzar con confianza.",
      de: "Für alle, die ihren inneren Dialog wandeln und selbstbewusst vorangehen möchten.",
      it: "Per chi desidera trasformare il dialogo interiore e andare avanti con fiducia.",
      nl: "Voor wie zijn innerlijke dialoog wil transformeren en met vertrouwen verder wil.",
      pl: "Dla osób pragnących zmienić wewnętrzny dialog i iść naprzód z pewnością.",
      pt: "Para quem deseja transformar o diálogo interior e avançar com confiança.",
    },
  },
  {
    slug: "plantes-et-remedes-naturels",
    iconName: "leaf",
    image: approachPlants,
    title: {
      fr: "Plantes & remèdes naturels",
      en: "Plants & natural remedies",
      es: "Plantas y remedios naturales",
      de: "Pflanzen & natürliche Heilmittel",
      it: "Piante e rimedi naturali",
      nl: "Planten & natuurlijke remedies",
      pl: "Rośliny i naturalne środki",
      pt: "Plantas e remédios naturais",
    },
    short: {
      fr: "La sagesse des plantes au service de votre bien-être et de votre équilibre naturel.",
      en: "The wisdom of plants serving your well-being and natural balance.",
      es: "La sabiduría de las plantas al servicio de su bienestar.",
      de: "Die Weisheit der Pflanzen im Dienst Ihres Wohlbefindens.",
      it: "La saggezza delle piante al servizio del tuo benessere.",
      nl: "De wijsheid van planten in dienst van uw welzijn.",
      pl: "Mądrość roślin w służbie Twojego dobrostanu.",
      pt: "A sabedoria das plantas ao serviço do seu bem-estar.",
    },
    intro: {
      fr: "Tisanes, élixirs, huiles et préparations naturelles : les plantes sont des alliées puissantes pour accompagner le corps. Selon vos besoins, je vous oriente vers les plantes médicinales et les rituels naturels les plus adaptés.",
      en: "Teas, elixirs, oils and natural preparations: plants are powerful allies for the body. According to your needs, I guide you toward the most suitable medicinal plants and natural rituals.",
      es: "Tisanas, elixires, aceites y preparaciones naturales: las plantas son poderosas aliadas.",
      de: "Tees, Elixiere, Öle und natürliche Zubereitungen: Pflanzen sind kraftvolle Verbündete.",
      it: "Tisane, elisir, oli e preparazioni naturali: le piante sono potenti alleate.",
      nl: "Thees, elixers, oliën en natuurlijke bereidingen: planten zijn krachtige bondgenoten.",
      pl: "Herbaty, eliksiry, olejki i naturalne preparaty: rośliny to potężni sprzymierzeńcy.",
      pt: "Tisanas, elixires, óleos e preparações naturais: as plantas são aliadas poderosas.",
    },
    benefits: {
      fr: [
        "Renforcement de l'immunité",
        "Soulagement naturel des tensions",
        "Soutien du sommeil et de la digestion",
        "Équilibre émotionnel et hormonal",
      ],
      en: [
        "Strengthened immunity",
        "Natural relief of tension",
        "Better sleep and digestion",
        "Emotional and hormonal balance",
      ],
      es: [
        "Refuerzo del sistema inmunitario",
        "Alivio natural de las tensiones",
        "Mejor sueño y digestión",
        "Equilibrio emocional y hormonal",
      ],
      de: [
        "Gestärktes Immunsystem",
        "Natürliche Linderung von Spannungen",
        "Besserer Schlaf und Verdauung",
        "Emotionales und hormonelles Gleichgewicht",
      ],
      it: [
        "Sistema immunitario rafforzato",
        "Sollievo naturale dalle tensioni",
        "Sonno e digestione migliori",
        "Equilibrio emotivo e ormonale",
      ],
      nl: [
        "Versterkte immuniteit",
        "Natuurlijke verlichting van spanning",
        "Betere slaap en spijsvertering",
        "Emotioneel en hormonaal evenwicht",
      ],
      pl: [
        "Wzmocniona odporność",
        "Naturalna ulga w napięciach",
        "Lepszy sen i trawienie",
        "Równowaga emocjonalna i hormonalna",
      ],
      pt: [
        "Reforço da imunidade",
        "Alívio natural das tensões",
        "Melhor sono e digestão",
        "Equilíbrio emocional e hormonal",
      ],
    },
    forWhom: {
      fr: "Pour qui cherche un accompagnement naturel et complémentaire à la médecine conventionnelle.",
      en: "For those seeking natural support alongside conventional medicine.",
      es: "Para quien busca un acompañamiento natural complementario a la medicina convencional.",
      de: "Für alle, die natürliche Begleitung ergänzend zur Schulmedizin suchen.",
      it: "Per chi cerca un accompagnamento naturale complementare alla medicina convenzionale.",
      nl: "Voor wie natuurlijke begeleiding zoekt naast reguliere geneeskunde.",
      pl: "Dla osób szukających naturalnego wsparcia uzupełniającego medycynę konwencjonalną.",
      pt: "Para quem procura acompanhamento natural complementar à medicina convencional.",
    },
  },
  {
    slug: "harmonisation-globale",
    iconName: "compass",
    image: approachHarmony,
    title: {
      fr: "Harmonisation globale",
      en: "Global harmonization",
      es: "Armonización global",
      de: "Ganzheitliche Harmonisierung",
      it: "Armonizzazione globale",
      nl: "Globale harmonisatie",
      pl: "Harmonizacja całościowa",
      pt: "Harmonização global",
    },
    short: {
      fr: "Travail sur le corps, l'esprit et l'âme pour une harmonie profonde et durable.",
      en: "Work on body, mind and soul for deep and lasting harmony.",
      es: "Trabajo sobre cuerpo, mente y alma para una armonía profunda y duradera.",
      de: "Arbeit an Körper, Geist und Seele für tiefe, dauerhafte Harmonie.",
      it: "Lavoro su corpo, mente e anima per un'armonia profonda e duratura.",
      nl: "Werken aan lichaam, geest en ziel voor diepe en blijvende harmonie.",
      pl: "Praca z ciałem, umysłem i duszą dla głębokiej i trwałej harmonii.",
      pt: "Trabalho no corpo, mente e alma para uma harmonia profunda e duradoura.",
    },
    intro: {
      fr: "Une approche complète qui combine plusieurs disciplines pour réaligner les trois plans de votre être. Idéal pour les périodes de transition, de doute ou de grands changements de vie.",
      en: "A complete approach combining several disciplines to realign the three planes of your being. Ideal for transitions, doubts or major life changes.",
      es: "Un enfoque completo que combina varias disciplinas para realinear los tres planos de su ser.",
      de: "Ein ganzheitlicher Ansatz, der mehrere Disziplinen verbindet, um die drei Ebenen Ihres Seins neu auszurichten.",
      it: "Un approccio completo che combina più discipline per riallineare i tre piani del tuo essere.",
      nl: "Een complete aanpak die meerdere disciplines combineert om de drie lagen van uw wezen opnieuw uit te lijnen.",
      pl: "Kompleksowe podejście łączące wiele dyscyplin w celu wyrównania trzech wymiarów Twojej istoty.",
      pt: "Uma abordagem completa que combina várias disciplinas para realinhar os três planos do seu ser.",
    },
    benefits: {
      fr: [
        "Réalignement corps-esprit-âme",
        "Apaisement profond et durable",
        "Clarté sur votre chemin de vie",
        "Renforcement de votre ancrage",
      ],
      en: [
        "Body-mind-soul realignment",
        "Deep, lasting peace",
        "Clarity on your life path",
        "Stronger grounding",
      ],
      es: [
        "Realineación cuerpo-mente-alma",
        "Paz profunda y duradera",
        "Claridad en su camino de vida",
        "Mayor enraizamiento",
      ],
      de: [
        "Körper-Geist-Seele-Ausrichtung",
        "Tiefer, anhaltender Frieden",
        "Klarheit über Ihren Lebensweg",
        "Stärkere Erdung",
      ],
      it: [
        "Riallineamento corpo-mente-anima",
        "Pace profonda e duratura",
        "Chiarezza sul cammino di vita",
        "Radicamento più forte",
      ],
      nl: [
        "Uitlijning van lichaam, geest en ziel",
        "Diepe, blijvende rust",
        "Helderheid over uw levenspad",
        "Sterkere aarding",
      ],
      pl: [
        "Wyrównanie ciała, umysłu i duszy",
        "Głęboki, trwały spokój",
        "Jasność co do drogi życia",
        "Silniejsze zakorzenienie",
      ],
      pt: [
        "Realinhamento corpo-mente-alma",
        "Paz profunda e duradoura",
        "Clareza sobre o seu caminho de vida",
        "Ancoragem reforçada",
      ],
    },
    forWhom: {
      fr: "Pour les âmes en quête de sens, en transition ou souhaitant un travail en profondeur.",
      en: "For souls seeking meaning, in transition or wishing for deep work.",
      es: "Para almas en busca de sentido, en transición o que desean un trabajo profundo.",
      de: "Für Seelen auf Sinnsuche, im Übergang oder mit dem Wunsch nach Tiefenarbeit.",
      it: "Per chi cerca senso, è in transizione o desidera un lavoro profondo.",
      nl: "Voor zielen die zin zoeken, in transitie zijn of diep werk willen.",
      pl: "Dla dusz szukających sensu, w przemianie lub pragnących głębokiej pracy.",
      pt: "Para almas em busca de sentido, em transição ou que desejam um trabalho profundo.",
    },
  },
  {
    slug: "developpement-spirituel",
    iconName: "heart-handshake",
    image: approachSpirit,
    title: {
      fr: "Développement spirituel",
      en: "Spiritual development",
      es: "Desarrollo espiritual",
      de: "Spirituelle Entwicklung",
      it: "Sviluppo spirituale",
      nl: "Spirituele ontwikkeling",
      pl: "Rozwój duchowy",
      pt: "Desenvolvimento espiritual",
    },
    short: {
      fr: "Élevez votre conscience et reconnectez-vous à votre essence profonde.",
      en: "Raise your consciousness and reconnect to your deepest essence.",
      es: "Eleve su conciencia y reconéctese con su esencia profunda.",
      de: "Erweitern Sie Ihr Bewusstsein und finden Sie Ihre tiefe Essenz wieder.",
      it: "Eleva la coscienza e riconnettiti alla tua essenza profonda.",
      nl: "Verhoog uw bewustzijn en herstel de verbinding met uw diepste essentie.",
      pl: "Podnieś świadomość i połącz się ze swoją głęboką esencją.",
      pt: "Eleve a sua consciência e reconecte-se à sua essência profunda.",
    },
    intro: {
      fr: "Méditation guidée, ouverture du cœur, écoute de l'intuition : un cheminement doux pour reconnecter votre âme à sa source et avancer en conscience sur votre chemin.",
      en: "Guided meditation, heart opening, intuition listening: a gentle journey to reconnect your soul to its source and walk consciously.",
      es: "Meditación guiada, apertura del corazón, escucha de la intuición: un viaje suave para reconectar el alma con su fuente.",
      de: "Geführte Meditation, Herzöffnung, intuitives Hören: ein sanfter Weg, die Seele mit ihrer Quelle zu verbinden.",
      it: "Meditazione guidata, apertura del cuore, ascolto dell'intuito: un cammino dolce per riconnettere l'anima alla sua fonte.",
      nl: "Geleide meditatie, hartopening, luisteren naar de intuïtie: een zachte reis om uw ziel te verbinden met haar bron.",
      pl: "Medytacja prowadzona, otwarcie serca, słuchanie intuicji: łagodna droga do ponownego połączenia duszy ze źródłem.",
      pt: "Meditação guiada, abertura do coração, escuta da intuição: um caminho suave para reconectar a alma à sua fonte.",
    },
    benefits: {
      fr: [
        "Ouverture progressive du cœur",
        "Développement de l'intuition",
        "Sentiment d'unité et de paix",
        "Reconnexion à votre mission de vie",
      ],
      en: [
        "Gradual heart opening",
        "Intuition development",
        "Sense of unity and peace",
        "Reconnection to your life mission",
      ],
      es: [
        "Apertura progresiva del corazón",
        "Desarrollo de la intuición",
        "Sentido de unidad y paz",
        "Reconexión con su misión de vida",
      ],
      de: [
        "Schrittweise Herzöffnung",
        "Entwicklung der Intuition",
        "Gefühl von Einheit und Frieden",
        "Wiederverbindung mit der Lebensaufgabe",
      ],
      it: [
        "Apertura graduale del cuore",
        "Sviluppo dell'intuito",
        "Senso di unità e pace",
        "Riconnessione alla missione di vita",
      ],
      nl: [
        "Geleidelijke hartopening",
        "Ontwikkeling van intuïtie",
        "Gevoel van eenheid en vrede",
        "Verbinding met uw levensmissie",
      ],
      pl: [
        "Stopniowe otwarcie serca",
        "Rozwój intuicji",
        "Poczucie jedności i spokoju",
        "Połączenie z misją życia",
      ],
      pt: [
        "Abertura progressiva do coração",
        "Desenvolvimento da intuição",
        "Sentido de unidade e paz",
        "Reconexão com a sua missão de vida",
      ],
    },
    forWhom: {
      fr: "Pour qui souhaite ouvrir son cœur, développer son intuition et avancer sur un chemin de conscience.",
      en: "For those wishing to open their heart, develop intuition and walk a conscious path.",
      es: "Para quien desea abrir su corazón, desarrollar la intuición y caminar con conciencia.",
      de: "Für alle, die ihr Herz öffnen, ihre Intuition entwickeln und bewusst gehen möchten.",
      it: "Per chi desidera aprire il cuore, sviluppare l'intuito e percorrere un cammino di coscienza.",
      nl: "Voor wie zijn hart wil openen, intuïtie wil ontwikkelen en bewust wil leven.",
      pl: "Dla osób pragnących otworzyć serce, rozwijać intuicję i kroczyć drogą świadomości.",
      pt: "Para quem deseja abrir o coração, desenvolver a intuição e seguir um caminho de consciência.",
    },
  },
];

export function findTherapy(slug: string): Therapy | undefined {
  return THERAPIES.find((t) => t.slug === slug);
}
