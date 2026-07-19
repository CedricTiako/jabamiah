import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { NewPaymentDrawer, type PaymentRecord } from "../components/admin/new-payment-drawer";
import { useAdmin } from "../lib/admin-context";
import { Heart, Edit3, Trash2 } from "lucide-react";
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

function PaiementsPage() {
  const { signOut } = useAdmin();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<PaymentRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

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

  const rows = payments ?? [];

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = rows.filter((r) => {
      const d = new Date(r.payment_date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
    const thisYear = rows.filter(
      (r) => new Date(r.payment_date).getFullYear() === now.getFullYear(),
    );
    const monthTotal = thisMonth.reduce((s, r) => s + r.amount, 0);
    const yearTotal = thisYear.reduce((s, r) => s + r.amount, 0);
    const average = rows.length > 0 ? rows.reduce((s, r) => s + r.amount, 0) / rows.length : 0;
    const min = rows.length > 0 ? Math.min(...rows.map((r) => r.amount)) : 0;
    const max = rows.length > 0 ? Math.max(...rows.map((r) => r.amount)) : 0;
    return { monthTotal, yearTotal, count: rows.length, average, min, max };
  }, [rows]);

  return (
    <AdminShell
      title="Paiements & Dons"
      subtitle="Cagnotte solidaire · Suivi des contributions"
      onSignOut={signOut}
      actions={<NewPaymentDrawer />}
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

      <div className="mt-8 overflow-x-auto rounded-xl bg-card ring-1 ring-gold/15">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-cream-warm/60 text-left text-xs uppercase tracking-[0.15em] text-forest">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Donateur</th>
              <th className="px-4 py-3">Montant</th>
              <th className="px-4 py-3">Moyen</th>
              <th className="px-4 py-3">Référence</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-earth/60">
                  Chargement…
                </td>
              </tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-earth/60">
                  Aucun don pour le moment.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 text-earth/80">{formatDate(r.payment_date)}</td>
                <td className="px-4 py-3 font-medium text-forest">{r.donor_name || "Anonyme"}</td>
                <td className="px-4 py-3 text-forest">{Number(r.amount).toFixed(2)} €</td>
                <td className="px-4 py-3 text-earth/70">
                  {r.method ? (METHOD_LABELS[r.method] ?? r.method) : "—"}
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
