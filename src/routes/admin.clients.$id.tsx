import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { useAdmin } from "./admin";
import { CLIENTS } from "./admin.clients";
import { Phone, Mail, MapPin, Calendar, User, Edit3, Printer, Plus, FileText, Smile, TrendingUp } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/clients/$id")({
  head: () => ({ meta: [{ title: "Fiche client — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ClientDetailPage,
});

const TABS = ["Résumé", "Consultations", "Suivi & Évolution", "Documents", "Paiements", "Notes privées"] as const;

function ClientDetailPage() {
  const { id } = Route.useParams();
  const { signOut } = useAdmin();
  const client = CLIENTS.find((c) => c.id === id);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Résumé");

  if (!client) throw notFound();

  return (
    <AdminShell
      title="Fiche client"
      subtitle="Consultez et gérez les informations de votre client"
      onSignOut={signOut}
      backTo={{ to: "/admin/clients", label: "Retour aux clients" }}
      actions={
        <div className="hidden gap-2 md:flex">
          <button className="inline-flex items-center gap-2 rounded-md border border-gold/30 bg-card px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm">
            <Edit3 className="h-3.5 w-3.5" /> Modifier
          </button>
          <button className="inline-flex items-center gap-2 rounded-md border border-gold/30 bg-card px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm">
            <Printer className="h-3.5 w-3.5" /> Imprimer
          </button>
          <button className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft">
            <Plus className="h-3.5 w-3.5" /> Nouveau RDV
          </button>
        </div>
      }
    >
      {/* Identity card */}
      <div className="rounded-2xl bg-card p-6 ring-1 ring-gold/15 md:p-8">
        <div className="flex flex-wrap items-start gap-6">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-forest text-2xl font-medium text-cream md:h-28 md:w-28">
            {client.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-serif text-3xl text-forest">{client.name}</h2>
              <span className="rounded-full bg-[color:var(--gold-soft)]/60 px-3 py-1 text-[10px] uppercase tracking-widest text-[color:var(--earth)]">
                {client.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-earth/70">{client.age} ans · 12/05/1982</p>
            <div className="mt-4 grid gap-3 text-sm text-earth/80 sm:grid-cols-2">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-forest" />{client.phone}</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-forest" />{client.email}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-forest" />{client.city}, 76000</p>
              <p className="flex items-center gap-2"><User className="h-4 w-4 text-forest" />Thérapeute : Loïc Omont</p>
            </div>
          </div>
          <div className="w-full max-w-sm space-y-2 rounded-xl bg-cream-warm p-4 text-sm">
            <MetaRow label="Nombre de séances" value={String(client.sessions)} />
            <MetaRow label="Dernière séance" value={client.lastSession} />
            <MetaRow label="Prochaine séance" value={client.nextSession} />
            <MetaRow label="Première consultation" value="15/03/2024" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 overflow-x-auto border-b border-gold/15">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-shrink-0 border-b-2 px-4 py-3 text-sm transition ${
              tab === t
                ? "border-gold font-medium text-forest"
                : "border-transparent text-earth/60 hover:text-forest"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Résumé" && <ResumeTab />}
      {tab === "Consultations" && <ConsultationsTab />}
      {tab === "Suivi & Évolution" && <SuiviTab />}
      {tab === "Documents" && <DocumentsTab />}
      {tab === "Paiements" && <PaiementsTab />}
      {tab === "Notes privées" && <NotesTab />}
    </AdminShell>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gold/10 pb-2 last:border-0 last:pb-0">
      <span className="text-xs uppercase tracking-[0.15em] text-earth/60">{label}</span>
      <span className="text-sm font-medium text-forest">{value}</span>
    </div>
  );
}

function ResumeTab() {
  const objectifs = [
    ["Stress", true], ["Peurs", false],
    ["Anxiété", true], ["Confiance en soi", true],
    ["Fatigue", false], ["Relation familiale", false],
    ["Sommeil", true], ["Relation de couple", false],
    ["Douleurs", false], ["Travail", true],
    ["Burn-out", false], ["Enfant", false],
    ["Deuil", false], ["Troubles digestifs", false],
    ["Dépression", false], ["Équilibre émotionnel", true],
    ["Addictions", false],
  ] as const;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-3">
      <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15 lg:col-span-2">
        <h3 className="font-serif text-xl text-forest">Objectif de la consultation</h3>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {objectifs.map(([label, checked]) => (
            <label key={label} className="flex items-center gap-2 text-earth/80">
              <input type="checkbox" defaultChecked={checked} className="h-4 w-4 accent-[color:var(--gold)]" />
              {label}
            </label>
          ))}
        </div>

        <h3 className="mt-8 font-serif text-xl text-forest">Notes & commentaires</h3>
        <div className="mt-4 space-y-4">
          {[
            { date: "18/05/2024 · 16h30", by: "Loïc Omont", body: "Sophie progresse bien. Moins d'anxiété au quotidien. Travail en cours sur la confiance en soi et la gestion du stress.\n\nConseils : respiration profonde matin et soir, méditation 10 min/jour." },
            { date: "02/05/2024 · 15h10", by: "Loïc Omont", body: "Cliente très à l'écoute et impliquée. Beaucoup de stress lié au travail. Difficultés de sommeil depuis plusieurs mois.\n\nObjectif principal : retrouver un sommeil réparateur." },
          ].map((n) => (
            <div key={n.date} className="rounded-lg bg-cream-warm p-4">
              <div className="flex items-center justify-between text-xs text-earth/60">
                <span>{n.date}</span>
                <span>Par {n.by}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-earth/85">{n.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
          <h3 className="font-serif text-lg text-forest">État émotionnel actuel</h3>
          <div className="mt-4 flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-forest/10">
              <Smile className="h-8 w-8 text-forest" />
            </div>
            <div>
              <p className="font-serif text-2xl text-forest">Bien</p>
              <p className="text-sm text-earth/70">7 / 10</p>
              <p className="text-xs text-[color:var(--gold)]">Évolution positive</p>
            </div>
          </div>
          <div className="mt-5 flex justify-between text-xl">
            {["😊", "🙂", "😐", "☹️", "😢"].map((e, i) => (
              <button key={e} className={`grid h-10 w-10 place-items-center rounded-full ${i === 1 ? "bg-forest text-cream" : "text-earth/60 hover:bg-cream-warm"}`}>
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
          <h3 className="font-serif text-lg text-forest">Techniques utilisées</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {["Magnétisme", "Énergétique", "Harmonisation", "Méditation", "Relaxation", "Respiration"].map((t) => (
              <span key={t} className="rounded-full bg-forest/10 px-3 py-1 text-forest">{t}</span>
            ))}
            {["Nettoyage énergétique", "Protection énergétique"].map((t) => (
              <span key={t} className="rounded-full bg-[color:var(--gold-soft)]/60 px-3 py-1 text-[color:var(--earth)]">{t}</span>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
          <h3 className="font-serif text-lg text-forest">Prochaine séance</h3>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center gap-2 text-forest"><Calendar className="h-4 w-4" /> 25 mai 2024 à 14h00</p>
            <p className="flex items-center gap-2 text-earth/70"><MapPin className="h-4 w-4" /> Cabinet Rouen</p>
          </div>
          <Link
            to="/admin/agenda"
            className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-gold/30 px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm"
          >
            Voir dans l'agenda
          </Link>
        </div>
      </div>
    </div>
  );
}

function ConsultationsTab() {
  const rows = [
    { n: 12, date: "18/05/2024", duration: "1h00", mood: "Bien 7/10", note: "Bonne évolution du sommeil. Moins d'anxiété au quotidien." },
    { n: 11, date: "02/05/2024", duration: "1h00", mood: "Bien 6/10", note: "Moins de stress au travail. Énergie en nette amélioration." },
    { n: 10, date: "18/04/2024", duration: "1h00", mood: "Moyen 5/10", note: "Fatigue passagère. Besoin de lâcher-prise." },
    { n: 9, date: "04/04/2024", duration: "1h00", mood: "Bien 6/10", note: "Sommeil légèrement meilleur. Travail sur la confiance en soi." },
    { n: 8, date: "21/03/2024", duration: "1h00", mood: "Moyen 5/10", note: "Stress toujours présent mais mieux géré." },
  ];
  return (
    <div className="mt-8 overflow-hidden rounded-xl bg-card ring-1 ring-gold/15">
      <ul className="divide-y divide-gold/10">
        {rows.map((r) => (
          <li key={r.n} className="flex flex-wrap items-start gap-4 p-5">
            <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full bg-forest text-sm font-medium text-cream">
              #{r.n}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-forest">Séance n°{r.n} — {r.date}</p>
                <p className="text-xs text-earth/60">{r.duration} · {r.mood}</p>
              </div>
              <p className="mt-1 text-sm text-earth/80">{r.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SuiviTab() {
  const evolution = [
    { label: "Émotionnel", value: 8, delta: "+3" },
    { label: "Mental", value: 7, delta: "+2" },
    { label: "Sommeil", value: 8, delta: "+4" },
    { label: "Énergie", value: 7, delta: "+3" },
    { label: "Bien-être physique", value: 6, delta: "+2" },
    { label: "Travail", value: 7, delta: "+3" },
    { label: "Famille", value: 8, delta: "+3" },
    { label: "Spiritualité", value: 6, delta: "+2" },
  ];
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
        <h3 className="font-serif text-xl text-forest">Évolution globale (3 derniers mois)</h3>
        <div className="mt-5 space-y-4">
          {evolution.map((e) => (
            <div key={e.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-earth/80">{e.label}</span>
                <span className="text-forest font-medium">{e.value}/10 <span className="text-xs text-[color:var(--gold)]">{e.delta}</span></span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-cream-warm">
                <div className="h-full rounded-full bg-forest" style={{ width: `${e.value * 10}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
        <h3 className="font-serif text-xl text-forest">Objectifs & Plan d'action</h3>
        <div className="mt-5 space-y-4">
          {[
            ["Retrouver un équilibre émotionnel", 75],
            ["Améliorer la qualité du sommeil", 80],
            ["Gérer le stress au travail", 60],
            ["Augmenter la confiance en soi", 70],
            ["Faire du sport régulièrement", 40],
          ].map(([label, pct]) => (
            <div key={label as string}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-earth/80">{label}</span>
                <span className="text-forest font-medium">{pct}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-cream-warm">
                <div className="h-full rounded-full bg-[color:var(--gold)]" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg bg-cream-warm p-4 text-sm text-earth/80">
          <p className="mb-2 font-medium text-forest">Plan d'action actuel</p>
          <ul className="space-y-1">
            <li>✓ Méditation quotidienne (10 min)</li>
            <li>✓ Respiration profonde matin et soir</li>
            <li>✓ Écriture émotionnelle</li>
            <li>○ Marche en pleine nature 2x/semaine</li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15 lg:col-span-2">
        <h3 className="font-serif text-xl text-forest">Statistiques du client</h3>
        <p className="text-xs text-earth/60">Évolution sur 12 séances</p>
        <div className="mt-6 flex h-40 items-end gap-2">
          {[3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9].map((v, i) => (
            <div key={i} className="flex-1">
              <div className="rounded-t bg-forest" style={{ height: `${v * 10}%` }} />
              <p className="mt-1 text-center text-[10px] text-earth/60">S{i + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DocumentsTab() {
  const docs = [
    { name: "Compte-rendu 18/05", type: "PDF" },
    { name: "Analyse sanguine", type: "PDF" },
    { name: "Ordonnance", type: "PDF" },
    { name: "Bilan initial", type: "PDF" },
  ];
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {docs.map((d) => (
        <div key={d.name} className="rounded-xl bg-card p-5 ring-1 ring-gold/15">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-[color:var(--rose-soft)] text-[color:var(--rose-text)]">
            <FileText className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-medium text-forest">{d.name}</p>
          <p className="text-xs text-earth/60">{d.type} · 128 Ko</p>
          <button className="mt-4 w-full rounded-md border border-gold/30 px-3 py-2 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm">
            Télécharger
          </button>
        </div>
      ))}
      <button className="rounded-xl border-2 border-dashed border-gold/30 p-5 text-left hover:bg-cream-warm">
        <Plus className="h-6 w-6 text-forest" />
        <p className="mt-4 text-sm font-medium text-forest">Ajouter un document</p>
        <p className="text-xs text-earth/60">PDF, image ou note</p>
      </button>
    </div>
  );
}

function PaiementsTab() {
  const rows = [
    { date: "18/05/2024", label: "Consultation n°12", amount: "Don libre — 50 €", state: "Reçu" },
    { date: "02/05/2024", label: "Consultation n°11", amount: "Don libre — 30 €", state: "Reçu" },
    { date: "18/04/2024", label: "Consultation n°10", amount: "Gratuit", state: "—" },
  ];
  return (
    <div className="mt-8 rounded-xl bg-card ring-1 ring-gold/15">
      <table className="w-full text-sm">
        <thead className="bg-cream-warm/60 text-left text-xs uppercase tracking-[0.15em] text-forest">
          <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Libellé</th><th className="px-4 py-3">Montant</th><th className="px-4 py-3">État</th></tr>
        </thead>
        <tbody className="divide-y divide-gold/10">
          {rows.map((r) => (
            <tr key={r.date}>
              <td className="px-4 py-3 text-earth/80">{r.date}</td>
              <td className="px-4 py-3 text-forest">{r.label}</td>
              <td className="px-4 py-3 text-forest font-medium">{r.amount}</td>
              <td className="px-4 py-3"><span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-xs text-forest">{r.state}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NotesTab() {
  return (
    <div className="mt-8 rounded-xl bg-card p-6 ring-1 ring-gold/15">
      <div className="flex items-center gap-2 text-xs text-earth/60">
        <TrendingUp className="h-3.5 w-3.5" /> Ces notes ne sont visibles que par vous.
      </div>
      <textarea
        rows={10}
        placeholder="Notes privées, ressentis, observations personnelles…"
        className="mt-4 w-full rounded-md border border-gold/20 bg-cream-warm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        defaultValue="Sophie est très réceptive au magnétisme. À poursuivre le travail sur l'ancrage. Sensibilité forte à l'énergie du cabinet."
      />
      <button className="mt-4 rounded-md bg-forest px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft">
        Enregistrer
      </button>
    </div>
  );
}
