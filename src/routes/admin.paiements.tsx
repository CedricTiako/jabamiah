import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { NewPaymentDrawer } from "../components/admin/new-payment-drawer";
import { useAdmin } from "./admin";
import { Heart } from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListPayments } from "../lib/payments.functions";

export const Route = createFileRoute("/admin/paiements")({
  head: () => ({ meta: [{ title: "Paiements & Dons — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: PaiementsPage,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR");
}

const METHOD_LABELS: Record<string, string> = {
  paypal: "PayPal",
  virement: "Virement",
  especes: "Espèces",
  cheque: "Chèque",
  autre: "Autre",
};

function PaiementsPage() {
  const { signOut } = useAdmin();

  const listPayments = useServerFn(adminListPayments);
  const { data: payments, isLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: () => listPayments(),
  });

  const rows = payments ?? [];

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = rows.filter((r) => {
      const d = new Date(r.payment_date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
    const thisYear = rows.filter((r) => new Date(r.payment_date).getFullYear() === now.getFullYear());
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
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-[color:var(--rose-soft)] to-cream p-6 ring-1 ring-gold/15">
          <Heart className="h-5 w-5 text-[color:var(--rose-text)]" />
          <p className="mt-3 text-xs uppercase tracking-[0.15em] text-earth/70">Ce mois</p>
          <p className="font-serif text-4xl text-[color:var(--rose-text)]">{stats.monthTotal.toFixed(0)} €</p>
        </div>
        <div className="rounded-2xl bg-card p-6 ring-1 ring-gold/15">
          <p className="text-xs uppercase tracking-[0.15em] text-earth/60">Cette année</p>
          <p className="mt-3 font-serif text-4xl text-forest">{stats.yearTotal.toFixed(0)} €</p>
          <p className="mt-1 text-xs text-earth/60">{stats.count} don{stats.count > 1 ? "s" : ""} reçu{stats.count > 1 ? "s" : ""}</p>
        </div>
        <div className="rounded-2xl bg-card p-6 ring-1 ring-gold/15">
          <p className="text-xs uppercase tracking-[0.15em] text-earth/60">Don moyen</p>
          <p className="mt-3 font-serif text-4xl text-forest">{stats.average.toFixed(0)} €</p>
          <p className="mt-1 text-xs text-earth/60">min. {stats.min.toFixed(0)} € · max. {stats.max.toFixed(0)} €</p>
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {isLoading && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-earth/60">Chargement…</td></tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-earth/60">Aucun don pour le moment.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 text-earth/80">{formatDate(r.payment_date)}</td>
                <td className="px-4 py-3 font-medium text-forest">{r.donor_name || "Anonyme"}</td>
                <td className="px-4 py-3 text-forest">{Number(r.amount).toFixed(2)} €</td>
                <td className="px-4 py-3 text-earth/70">{r.method ? METHOD_LABELS[r.method] ?? r.method : "—"}</td>
                <td className="px-4 py-3 font-mono text-xs text-earth/60">{r.reference ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
