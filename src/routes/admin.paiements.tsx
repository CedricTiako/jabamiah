import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { NewPaymentDrawer, type PaymentRecord } from "../components/admin/new-payment-drawer";
import { Pill } from "../components/admin/ui";
import { useAdmin } from "../lib/admin-context";
import { Heart, Edit3, Trash2, Search, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminDeletePayment, adminListPayments } from "../lib/payments.functions";
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

export const Route = createFileRoute("/admin/paiements")({
  head: () => ({
    meta: [
      { title: "Paiements & Dons — Jabamiah Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PaiementsPage,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR");
}

const METHOD_LABELS: Record<string, string> = {
  paypal: "PayPal",
  stripe_card: "Carte (Stripe)",
  virement: "Virement",
  especes: "Espèces",
  cheque: "Chèque",
  autre: "Autre",
};

const SOURCE_LABELS: Record<string, string> = {
  manual: "Manuel",
  paypal: "PayPal",
  stripe: "Stripe",
};

const STATUS_LABELS: Record<string, string> = {
  succeeded: "Reçu",
  pending: "En attente",
  failed: "Échoué",
  refunded: "Remboursé",
};

const STATUS_TONE: Record<string, "green" | "gold" | "rose" | "neutral"> = {
  succeeded: "green",
  pending: "gold",
  failed: "rose",
  refunded: "neutral",
};

function toCsvValue(value: string | number | null | undefined) {
  const str = String(value ?? "");
  return /[",\n;]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function PaiementsPage() {
  const { signOut } = useAdmin();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<PaymentRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const listPayments = useServerFn(adminListPayments);
  const { data: payments, isLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: () => listPayments(),
  });

  const del = useServerFn(adminDeletePayment);
  const deleteMutation = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      setPendingDelete(null);
    },
  });

  const rows = useMemo(() => payments ?? [], [payments]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (sourceFilter !== "all" && r.source !== sourceFilter) return false;
      if (!needle) return true;
      return (
        (r.donor_name ?? "").toLowerCase().includes(needle) ||
        (r.reference ?? "").toLowerCase().includes(needle) ||
        (r.stripe_payment_intent_id ?? "").toLowerCase().includes(needle)
      );
    });
  }, [rows, q, statusFilter, sourceFilter]);

  const succeeded = useMemo(() => rows.filter((r) => r.status === "succeeded"), [rows]);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = succeeded.filter((r) => {
      const d = new Date(r.payment_date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
    const thisYear = succeeded.filter(
      (r) => new Date(r.payment_date).getFullYear() === now.getFullYear(),
    );
    const monthTotal = thisMonth.reduce((s, r) => s + r.amount, 0);
    const yearTotal = thisYear.reduce((s, r) => s + r.amount, 0);
    const average =
      succeeded.length > 0 ? succeeded.reduce((s, r) => s + r.amount, 0) / succeeded.length : 0;
    const min = succeeded.length > 0 ? Math.min(...succeeded.map((r) => r.amount)) : 0;
    const max = succeeded.length > 0 ? Math.max(...succeeded.map((r) => r.amount)) : 0;
    return { monthTotal, yearTotal, count: succeeded.length, average, min, max };
  }, [succeeded]);

  function exportCsv() {
    const header = [
      "Date",
      "Donateur",
      "Montant",
      "Moyen",
      "Source",
      "Statut",
      "Référence",
      "Stripe payment_intent",
      "Note",
    ];
    const lines = filtered.map((r) =>
      [
        formatDate(r.payment_date),
        r.donor_name || "Anonyme",
        Number(r.amount).toFixed(2),
        r.method ? (METHOD_LABELS[r.method] ?? r.method) : "",
        SOURCE_LABELS[r.source] ?? r.source,
        STATUS_LABELS[r.status] ?? r.status,
        r.reference ?? "",
        r.stripe_payment_intent_id ?? "",
        r.note ?? "",
      ]
        .map(toCsvValue)
        .join(";"),
    );
    const csv = [header.join(";"), ...lines].join("\n");
    const bom = String.fromCharCode(0xfeff);
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paiements-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminShell
      title="Paiements & Dons"
      subtitle="Cagnotte solidaire · Suivi des contributions"
      onSignOut={signOut}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 rounded-md border border-gold/30 bg-card px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" /> Exporter CSV
          </button>
          <NewPaymentDrawer />
        </div>
      }
    >
      <NewPaymentDrawer
        payment={editing ?? undefined}
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-[color:var(--rose-soft)] to-cream p-6 ring-1 ring-gold/15">
          <Heart className="h-5 w-5 text-[color:var(--rose-text)]" />
          <p className="mt-3 text-xs uppercase tracking-[0.15em] text-earth/70">Ce mois</p>
          <p className="font-serif text-4xl text-[color:var(--rose-text)]">
            {stats.monthTotal.toFixed(0)} €
          </p>
        </div>
        <div className="rounded-2xl bg-card p-6 ring-1 ring-gold/15">
          <p className="text-xs uppercase tracking-[0.15em] text-earth/60">Cette année</p>
          <p className="mt-3 font-serif text-4xl text-forest">{stats.yearTotal.toFixed(0)} €</p>
          <p className="mt-1 text-xs text-earth/60">
            {stats.count} don{stats.count > 1 ? "s" : ""} reçu{stats.count > 1 ? "s" : ""}
          </p>
        </div>
        <div className="rounded-2xl bg-card p-6 ring-1 ring-gold/15">
          <p className="text-xs uppercase tracking-[0.15em] text-earth/60">Don moyen</p>
          <p className="mt-3 font-serif text-4xl text-forest">{stats.average.toFixed(0)} €</p>
          <p className="mt-1 text-xs text-earth/60">
            min. {stats.min.toFixed(0)} € · max. {stats.max.toFixed(0)} €
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-earth/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un donateur, une référence…"
            className="w-full rounded-md border border-gold/20 bg-card py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gold/20 bg-card px-3 py-2.5 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">Tous statuts</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="rounded-md border border-gold/20 bg-card px-3 py-2.5 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">Toutes sources</option>
          {Object.entries(SOURCE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl bg-card ring-1 ring-gold/15">
        <table className="w-full min-w-[680px] text-sm">
          <thead className="bg-cream-warm/60 text-left text-xs uppercase tracking-[0.15em] text-forest">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Donateur</th>
              <th className="px-4 py-3">Montant</th>
              <th className="px-4 py-3">Moyen</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Référence</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-earth/60">
                  Chargement…
                </td>
              </tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-earth/60">
                  Aucun don ne correspond à ces critères.
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 text-earth/80">{formatDate(r.payment_date)}</td>
                <td className="px-4 py-3 font-medium text-forest">{r.donor_name || "Anonyme"}</td>
                <td className="px-4 py-3 text-forest">{Number(r.amount).toFixed(2)} €</td>
                <td className="px-4 py-3 text-earth/70">
                  {r.method ? (METHOD_LABELS[r.method] ?? r.method) : "—"}
                </td>
                <td className="px-4 py-3">
                  <Pill tone={STATUS_TONE[r.status] ?? "neutral"}>
                    {STATUS_LABELS[r.status] ?? r.status}
                  </Pill>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-earth/60">{r.reference ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditing(r as unknown as PaymentRecord)}
                      className="rounded-md p-1.5 text-earth/40 hover:bg-cream-warm hover:text-forest"
                      aria-label="Modifier"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setPendingDelete({ id: r.id, name: r.donor_name || "Anonyme" })
                      }
                      className="rounded-md p-1.5 text-earth/40 hover:bg-cream-warm hover:text-red-700"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce don ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le don de « {pendingDelete?.name} » sera définitivement supprimé.
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
    </AdminShell>
  );
}
