import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { useAdmin } from "../lib/admin-context";
import { Phone, Mail, MapPin, User, Edit3, Printer, Plus, TrendingUp, FileText, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminGetClient, adminUpdateClientNotes } from "../lib/clients.functions";
import { adminListConsultationsByClient } from "../lib/consultations.functions";
import { adminListEnergyAssessmentsByClient } from "../lib/energy-assessments.functions";
import { adminListPaymentsByClient } from "../lib/payments.functions";
import { adminDeleteDocument, adminGetDocumentSignedUrl, adminListDocumentsByClient } from "../lib/documents.functions";
import { UploadDocumentDrawer } from "../components/admin/upload-document-drawer";
import { NewClientDrawer } from "../components/admin/new-client-drawer";
import { NewPaymentDrawer } from "../components/admin/new-payment-drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

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
  const [editOpen, setEditOpen] = useState(false);

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
          <button
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-gold/30 bg-card px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm"
          >
            <Edit3 className="h-3.5 w-3.5" /> Modifier
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-md border border-gold/30 bg-card px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm"
          >
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
      <NewClientDrawer client={client} open={editOpen} onOpenChange={setEditOpen} />
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
      {tab === "Consultations" && <ConsultationsTab clientId={client.id} />}
      {tab === "Suivi & Évolution" && <SuiviTab clientId={client.id} />}
      {tab === "Documents" && <DocumentsTab clientId={client.id} />}
      {tab === "Paiements" && <PaiementsTab clientId={client.id} />}
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

function ConsultationsTab({ clientId }: { clientId: string }) {
  const listByClient = useServerFn(adminListConsultationsByClient);
  const { data: consultations, isLoading } = useQuery({
    queryKey: ["admin-consultations-by-client", clientId],
    queryFn: () => listByClient({ data: { client_id: clientId } }),
  });

  const rows = consultations ?? [];

  return (
    <div className="mt-8 overflow-hidden rounded-xl bg-card ring-1 ring-gold/15">
      {isLoading && <p className="p-5 text-sm text-earth/60">Chargement…</p>}
      {!isLoading && rows.length === 0 && (
        <p className="p-5 text-sm text-earth/60">Aucune consultation enregistrée pour ce client.</p>
      )}
      <ul className="divide-y divide-gold/10">
        {rows.map((r) => (
          <li key={r.id} className="flex flex-wrap items-start gap-4 p-5">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-forest">{formatDate(r.consultation_date)}</p>
                <p className="text-xs text-earth/60">
                  {r.duration_minutes} min{r.mood ? ` · Ressenti ${r.mood}/10` : ""}
                </p>
              </div>
              <p className="mt-1 text-sm text-earth/80">{r.report}</p>
              {r.advice && <p className="mt-1 text-xs text-earth/60">Recommandations : {r.advice}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const AXIS_LABELS: Record<string, string> = {
  axis_energie: "Énergie",
  axis_stress: "Stress",
  axis_emotions: "Émotions",
  axis_motivation: "Motivation",
  axis_confiance: "Confiance",
  axis_fatigue: "Fatigue",
  axis_douleurs: "Douleurs",
  axis_concentration: "Concentration",
};

function SuiviTab({ clientId }: { clientId: string }) {
  const listAssessments = useServerFn(adminListEnergyAssessmentsByClient);
  const listConsultations = useServerFn(adminListConsultationsByClient);

  const { data: assessments, isLoading: loadingAssessments } = useQuery({
    queryKey: ["admin-energy-assessments-by-client", clientId],
    queryFn: () => listAssessments({ data: { client_id: clientId } }),
  });
  const { data: consultations, isLoading: loadingConsultations } = useQuery({
    queryKey: ["admin-consultations-by-client", clientId],
    queryFn: () => listConsultations({ data: { client_id: clientId } }),
  });

  const isLoading = loadingAssessments || loadingConsultations;
  const latest = assessments?.[0];

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-3">
      <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15 lg:col-span-2">
        <h3 className="font-serif text-xl text-forest">Dernier bilan énergétique</h3>
        {isLoading && <p className="mt-3 text-sm text-earth/60">Chargement…</p>}
        {!isLoading && !latest && (
          <p className="mt-3 text-sm text-earth/60">Aucun bilan énergétique enregistré pour ce client.</p>
        )}
        {latest && (
          <>
            <p className="mt-1 text-xs text-earth/60">{formatDate(latest.assessment_date)}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {Object.entries(AXIS_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between gap-2 rounded-lg bg-cream-warm/60 px-3 py-2 text-sm">
                  <span className="text-earth/80">{label}</span>
                  <span className="font-medium text-forest">{(latest as unknown as Record<string, number>)[key]}/10</span>
                </div>
              ))}
            </div>
            {latest.observations && (
              <p className="mt-4 text-sm text-earth/80">{latest.observations}</p>
            )}
          </>
        )}
      </div>
      <div className="space-y-4">
        <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
          <p className="text-xs uppercase tracking-[0.15em] text-earth/60">Séances suivies</p>
          <p className="mt-2 font-serif text-3xl text-forest">{consultations?.length ?? 0}</p>
        </div>
        <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
          <p className="text-xs uppercase tracking-[0.15em] text-earth/60">Bilans énergétiques</p>
          <p className="mt-2 font-serif text-3xl text-forest">{assessments?.length ?? 0}</p>
        </div>
      </div>
    </div>
  );
}

function PaiementsTab({ clientId }: { clientId: string }) {
  const listByClient = useServerFn(adminListPaymentsByClient);
  const { data: payments, isLoading } = useQuery({
    queryKey: ["admin-payments-by-client", clientId],
    queryFn: () => listByClient({ data: { client_id: clientId } }),
  });

  const rows = payments ?? [];
  const total = rows.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-earth/70">
          {rows.length} paiement{rows.length > 1 ? "s" : ""} · {total.toFixed(2)} € au total
        </p>
        <NewPaymentDrawer defaultClientId={clientId} />
      </div>
      <div className="overflow-hidden rounded-xl bg-card ring-1 ring-gold/15">
        {isLoading && <p className="p-5 text-sm text-earth/60">Chargement…</p>}
        {!isLoading && rows.length === 0 && (
          <p className="p-5 text-sm text-earth/60">Aucun paiement enregistré pour ce client.</p>
        )}
        <ul className="divide-y divide-gold/10">
          {rows.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-sm font-medium text-forest">{formatDate(p.payment_date)}</p>
                <p className="text-xs text-earth/60">{p.method ?? "—"}{p.reference ? ` · ${p.reference}` : ""}</p>
              </div>
              <p className="font-serif text-lg text-forest">{p.amount.toFixed(2)} €</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function DocumentsTab({ clientId }: { clientId: string }) {
  const queryClient = useQueryClient();
  const listByClient = useServerFn(adminListDocumentsByClient);
  const { data: documents, isLoading } = useQuery({
    queryKey: ["admin-documents-by-client", clientId],
    queryFn: () => listByClient({ data: { client_id: clientId } }),
  });

  const getSignedUrl = useServerFn(adminGetDocumentSignedUrl);
  const openMutation = useMutation({
    mutationFn: (storagePath: string) => getSignedUrl({ data: { storage_path: storagePath } }),
    onSuccess: ({ url }) => window.open(url, "_blank", "noopener,noreferrer"),
  });

  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);
  const deleteDocument = useServerFn(adminDeleteDocument);
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDocument({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-documents-by-client", clientId] });
      setPendingDelete(null);
    },
  });

  const rows = documents ?? [];

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {isLoading && <p className="text-sm text-earth/60">Chargement…</p>}
      {!isLoading && rows.length === 0 && (
        <p className="text-sm text-earth/60 lg:col-span-3">Aucun document pour ce client.</p>
      )}
      {rows.map((d) => (
        <div key={d.id} className="rounded-xl bg-card p-5 ring-1 ring-gold/15">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-[color:var(--rose-soft)] text-[color:var(--rose-text)]">
            <FileText className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-medium text-forest">{d.title}</p>
          <p className="text-xs text-earth/60">{d.doc_type ?? "Document"} · {formatSize(d.file_size)}</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => openMutation.mutate(d.storage_path)}
              disabled={openMutation.isPending}
              className="flex-1 rounded-md border border-gold/30 px-3 py-2 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm"
            >
              Ouvrir
            </button>
            <button
              onClick={() => setPendingDelete({ id: d.id, title: d.title })}
              disabled={deleteMutation.isPending}
              className="rounded-md border border-gold/30 px-3 py-2 text-xs text-earth/60 hover:bg-cream-warm hover:text-[color:var(--rose-text)]"
              aria-label="Supprimer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
      <UploadDrawerButton clientId={clientId} />

      <AlertDialog open={!!pendingDelete} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce document ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {pendingDelete?.title} » sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
              className="bg-red-700 text-white hover:bg-red-800"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function UploadDrawerButton({ clientId }: { clientId: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-gold/30 p-5">
      <UploadDocumentDrawer defaultClientId={clientId} />
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
