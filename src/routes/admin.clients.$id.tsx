import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { useAdmin } from "./admin";
import { Phone, Mail, MapPin, User, Edit3, Printer, Plus, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminGetClient, adminUpdateClientNotes } from "../lib/clients.functions";

export const Route = createFileRoute("/admin/clients/$id")({
  head: () => ({ meta: [{ title: "Fiche client — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ClientDetailPage,
});

const TABS = ["Résumé", "Consultations", "Suivi & Évolution", "Documents", "Paiements", "Notes privées"] as const;

const statusTone: Record<string, string> = {
  Actif: "bg-forest/10 text-forest",
  "Fidèle": "bg-[color:var(--gold-soft)]/60 text-[color:var(--earth)]",
  Nouveau: "bg-[color:var(--rose-soft)] text-[color:var(--rose-text)]",
  Inactif: "bg-earth/10 text-earth/70",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function ageFromBirthDate(birthDate: string | null) {
  if (!birthDate) return null;
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR");
}

function ClientDetailPage() {
  const { id } = Route.useParams();
  const { signOut } = useAdmin();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Résumé");

  const getClient = useServerFn(adminGetClient);
  const { data: client, isLoading } = useQuery({
    queryKey: ["admin-client", id],
    queryFn: () => getClient({ data: { id } }),
  });

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center bg-cream text-earth/70">Chargement…</div>;
  }
  if (!client) throw notFound();

  const age = ageFromBirthDate(client.birth_date);
  const status = client.status ?? "Nouveau";

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
          <Link
            to="/admin/agenda"
            className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft"
          >
            <Plus className="h-3.5 w-3.5" /> Nouveau RDV
          </Link>
        </div>
      }
    >
      {/* Identity card */}
      <div className="rounded-2xl bg-card p-6 ring-1 ring-gold/15 md:p-8">
        <div className="flex flex-wrap items-start gap-6">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-forest text-2xl font-medium text-cream md:h-28 md:w-28">
            {initials(client.full_name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-serif text-3xl text-forest">{client.full_name}</h2>
              <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ${statusTone[status] ?? statusTone.Nouveau}`}>
                {status}
              </span>
            </div>
            <p className="mt-1 text-sm text-earth/70">
              {age !== null ? `${age} ans` : "Âge non renseigné"}
              {client.birth_date ? ` · ${formatDate(client.birth_date)}` : ""}
            </p>
            <div className="mt-4 grid gap-3 text-sm text-earth/80 sm:grid-cols-2">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-forest" />{client.phone ?? "—"}</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-forest" />{client.email ?? "—"}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-forest" />{client.city ?? "—"}</p>
              <p className="flex items-center gap-2"><User className="h-4 w-4 text-forest" />Thérapeute : Loïc Omont</p>
            </div>
          </div>
          <div className="w-full max-w-sm space-y-2 rounded-xl bg-cream-warm p-4 text-sm">
            <MetaRow label="Motif de consultation" value={client.reason ?? "—"} />
            <MetaRow label="Client depuis" value={formatDate(client.created_at)} />
            <MetaRow label="Dernière mise à jour" value={formatDate(client.updated_at)} />
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

      {tab === "Résumé" && <ResumeTab reason={client.reason} />}
      {tab === "Consultations" && (
        <ComingSoonTab title="Consultations" hint="Cette section sera alimentée une fois le module Consultations connecté." />
      )}
      {tab === "Suivi & Évolution" && (
        <ComingSoonTab title="Suivi & Évolution" hint="Vue agrégée à venir : dernière séance, prochain RDV, évolution du ressenti." />
      )}
      {tab === "Documents" && (
        <ComingSoonTab title="Documents" hint="L'espace documents (upload, aperçu, téléchargement) sera bientôt disponible." />
      )}
      {tab === "Paiements" && (
        <ComingSoonTab title="Paiements" hint="L'historique des paiements et dons de ce client sera bientôt disponible." />
      )}
      {tab === "Notes privées" && <NotesTab clientId={client.id} initialNotes={client.private_notes} />}
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

function ComingSoonTab({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mt-8 rounded-xl bg-card p-10 text-center ring-1 ring-gold/15">
      <p className="font-serif text-xl text-forest">{title}</p>
      <p className="mt-2 text-sm text-earth/60">{hint}</p>
    </div>
  );
}

function ResumeTab({ reason }: { reason: string | null }) {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-3">
      <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15 lg:col-span-2">
        <h3 className="font-serif text-xl text-forest">Motif de la consultation</h3>
        <p className="mt-3 text-sm text-earth/80">{reason || "Aucun motif renseigné pour ce client."}</p>
      </div>
      <div className="space-y-6">
        <ComingSoonTab title="État émotionnel" hint="Sera calculé depuis les bilans énergétiques." />
      </div>
    </div>
  );
}

function NotesTab({ clientId, initialNotes }: { clientId: string; initialNotes: string | null }) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const queryClient = useQueryClient();

  useEffect(() => setNotes(initialNotes ?? ""), [initialNotes]);

  const updateNotes = useServerFn(adminUpdateClientNotes);
  const saveMutation = useMutation({
    mutationFn: () => updateNotes({ data: { id: clientId, private_notes: notes } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-client", clientId] });
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
    },
  });

  return (
    <div className="mt-8 rounded-xl bg-card p-6 ring-1 ring-gold/15">
      <div className="flex items-center gap-2 text-xs text-earth/60">
        <TrendingUp className="h-3.5 w-3.5" /> Ces notes ne sont visibles que par vous.
      </div>
      <textarea
        rows={10}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes privées, ressentis, observations personnelles…"
        className="mt-4 w-full rounded-md border border-gold/20 bg-cream-warm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
      />
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="rounded-md bg-forest px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft disabled:opacity-50"
        >
          {saveMutation.isPending ? "Enregistrement…" : "Enregistrer"}
        </button>
        {saveMutation.isSuccess && <span className="text-sm text-forest">Enregistré ✓</span>}
        {saveMutation.isError && <span className="text-sm text-red-700">Erreur lors de l'enregistrement.</span>}
      </div>
    </div>
  );
}
