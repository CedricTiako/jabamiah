import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { useAdmin } from "../lib/admin-context";
import { HelpCircle, Mail, MessageSquare, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

export const Route = createFileRoute("/admin/aide")({
  head: () => ({
    meta: [
      { title: "Aide & support — Jabamiah Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AidePage,
});

const faqs = [
  {
    q: "Comment créer un nouvel article de blog ?",
    a: "Allez dans Contenu (Blog) puis cliquez sur « Nouvel article ». Renseignez le slug, le statut, et le contenu par langue.",
  },
  {
    q: "Comment configurer les dons PayPal ?",
    a: "Ouvrez Paramètres > Paiements et renseignez le Client ID PayPal ainsi que les montants suggérés.",
  },
  {
    q: "Comment ajouter un client ?",
    a: "Depuis la page Clients, cliquez sur « Nouveau client » en haut à droite.",
  },
  {
    q: "Puis-je exporter mes données ?",
    a: "Oui. Cette fonctionnalité est disponible via le support — contactez-nous.",
  },
];

const STARTUP_STEPS = [
  {
    title: "Complétez votre profil",
    text: "Rendez-vous dans Paramètres > Mon profil pour renseigner votre nom, votre titre et votre photo.",
  },
  {
    title: "Ajoutez votre premier client",
    text: "Depuis la page Clients, cliquez sur « Nouveau client » et renseignez ses coordonnées.",
  },
  {
    title: "Planifiez un rendez-vous",
    text: "Dans Agenda, créez un rendez-vous pour ce client : date, heure, lieu et type de séance.",
  },
  {
    title: "Consignez vos séances",
    text: "Après chaque rendez-vous, ajoutez une consultation (compte-rendu) ou un bilan énergétique depuis la fiche du client.",
  },
  {
    title: "Personnalisez vos paramètres",
    text: "Vérifiez Paramètres généraux (nom, contact) et Paiements pour que les dons en ligne fonctionnent correctement.",
  },
];

function AidePage() {
  const { signOut } = useAdmin();
  return (
    <AdminShell title="Aide & support" subtitle="Documentation, FAQ et contact" onSignOut={signOut}>
      <div className="grid gap-6 md:grid-cols-3">
        <StartupGuideCard />

        <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-forest/10 text-forest">
            <HelpCircle className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-serif text-lg text-forest">Centre d'aide</h3>
          <p className="mt-1 text-sm text-earth/70">
            Trouvez des réponses aux questions les plus fréquentes.
          </p>
          <a
            href="#questions-frequentes"
            className="mt-4 inline-block rounded-md border border-gold/30 px-3 py-2 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm"
          >
            Ouvrir
          </a>
        </div>

        <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-forest/10 text-forest">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-serif text-lg text-forest">Contactez-nous</h3>
          <p className="mt-1 text-sm text-earth/70">Notre équipe vous répond sous 24h ouvrées.</p>
          <a
            href="mailto:support@jabamiah.eu"
            className="mt-4 inline-block rounded-md border border-gold/30 px-3 py-2 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm"
          >
            Ouvrir
          </a>
        </div>
      </div>

      <div
        id="questions-frequentes"
        className="mt-8 scroll-mt-24 rounded-xl bg-card p-6 ring-1 ring-gold/15"
      >
        <h3 className="font-serif text-xl text-forest">Questions fréquentes</h3>
        <ul className="mt-5 divide-y divide-gold/10">
          {faqs.map((f) => (
            <li key={f.q} className="py-4">
              <p className="font-medium text-forest">{f.q}</p>
              <p className="mt-1 text-sm text-earth/75">{f.a}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-forest to-forest-soft p-6 text-cream">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cream/70">
            Besoin d'aide personnalisée ?
          </p>
          <p className="mt-2 font-serif text-2xl">Écrivez-nous à support@jabamiah.eu</p>
        </div>
        <a
          href="mailto:support@jabamiah.eu"
          className="inline-flex items-center gap-2 rounded-md bg-cream px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm"
        >
          <Mail className="h-3.5 w-3.5" /> Envoyer un email
        </a>
      </div>
    </AdminShell>
  );
}

function StartupGuideCard() {
  return (
    <Dialog>
      <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-forest/10 text-forest">
          <BookOpen className="h-5 w-5" />
        </div>
        <h3 className="mt-4 font-serif text-lg text-forest">Guide de démarrage</h3>
        <p className="mt-1 text-sm text-earth/70">Prenez en main votre espace en 5 minutes.</p>
        <DialogTrigger asChild>
          <button className="mt-4 rounded-md border border-gold/30 px-3 py-2 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm">
            Ouvrir
          </button>
        </DialogTrigger>
      </div>
      <DialogContent className="max-w-xl bg-cream">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-forest">Guide de démarrage</DialogTitle>
          <DialogDescription>
            Cinq étapes pour prendre en main votre espace praticien.
          </DialogDescription>
        </DialogHeader>
        <ol className="space-y-4">
          {STARTUP_STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest/10 text-xs font-medium text-forest">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-forest">{step.title}</p>
                <p className="mt-0.5 text-sm text-earth/70">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
