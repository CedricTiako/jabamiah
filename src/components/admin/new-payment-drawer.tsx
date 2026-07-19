import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../ui/drawer";
import { DateField } from "./ui";
import { adminCreatePayment, adminUpdatePayment } from "../../lib/payments.functions";

const METHODS = [
  { value: "paypal", label: "PayPal" },
  { value: "stripe_card", label: "Carte (Stripe)" },
  { value: "virement", label: "Virement" },
  { value: "especes", label: "Espèces" },
  { value: "cheque", label: "Chèque" },
  { value: "autre", label: "Autre" },
];

export type PaymentRecord = {
  id: string;
  payment_date: string;
  amount: number;
  donor_name: string | null;
  method: string | null;
  reference: string | null;
  note: string | null;
};

function emptyForm(defaultClientId?: string) {
  return {
    date: new Date().toISOString().slice(0, 10),
    amount: 20,
    donor_name: "",
    method: "paypal",
    reference: "",
    note: "",
    client_id: defaultClientId ?? "",
  };
}

export function NewPaymentDrawer({
  payment,
  defaultClientId,
  onCreated,
  open,
  onOpenChange,
}: {
  payment?: PaymentRecord | null;
  defaultClientId?: string;
  onCreated?: (id: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = (v: boolean) => (isControlled ? onOpenChange?.(v) : setInternalOpen(v));

  const [form, setForm] = useState(emptyForm(defaultClientId));
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isOpen) return;
    if (payment) {
      setForm({
        date: payment.payment_date.slice(0, 10),
        amount: payment.amount,
        donor_name: payment.donor_name ?? "",
        method: payment.method ?? "paypal",
        reference: payment.reference ?? "",
        note: payment.note ?? "",
        client_id: defaultClientId ?? "",
      });
    } else {
      setForm(emptyForm(defaultClientId));
    }
  }, [isOpen, payment, defaultClientId]);

  const create = useServerFn(adminCreatePayment);
  const update = useServerFn(adminUpdatePayment);
  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        payment_date: new Date(form.date).toISOString(),
        amount: form.amount,
        donor_name: form.donor_name || null,
        method: form.method || null,
        reference: form.reference || null,
        note: form.note || null,
        client_id: form.client_id || null,
      };
      return payment ? update({ data: { ...payload, id: payment.id } }) : create({ data: payload });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      if (defaultClientId)
        queryClient.invalidateQueries({ queryKey: ["admin-payments-by-client", defaultClientId] });
      setForm(emptyForm(defaultClientId));
      setOpen(false);
      if ("id" in result) onCreated?.(result.id);
    },
  });

  const field = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((s) => ({ ...s, [key]: value }));

  const canSubmit = form.date && form.amount > 0;

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      {!isControlled && (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft"
        >
          <Plus className="h-3.5 w-3.5" /> Enregistrer un don
        </button>
      )}
      <DrawerContent className="bg-cream">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle className="font-serif text-2xl text-forest">
              {payment ? "Modifier le don" : "Enregistrer un don"}
            </DrawerTitle>
            <DrawerDescription>Ajouter ou ajuster une contribution reçue.</DrawerDescription>
          </DrawerHeader>

          <div className="grid gap-4 px-4 pb-4 sm:grid-cols-2">
            <DateField label="Date" value={form.date} onChange={(v) => field("date", v)} required />
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Montant (€) *</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.amount}
                onChange={(e) => field("amount", Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Donateur</span>
              <input
                value={form.donor_name}
                onChange={(e) => field("donor_name", e.target.value)}
                placeholder="Nom ou « Anonyme »"
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Moyen</span>
              <select
                value={form.method}
                onChange={(e) => field("method", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Référence</span>
              <input
                value={form.reference}
                onChange={(e) => field("reference", e.target.value)}
                placeholder="TXN-…, VIR-…"
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Note</span>
              <textarea
                rows={2}
                value={form.note}
                onChange={(e) => field("note", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
          </div>

          <div className="flex items-center gap-4 border-t border-gold/15 px-4 py-4">
            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !canSubmit}
              className="rounded-md bg-forest px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft disabled:opacity-50"
            >
              {saveMutation.isPending ? "Enregistrement…" : payment ? "Enregistrer" : "Enregistrer"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md border border-gold/30 px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm"
            >
              Annuler
            </button>
            {saveMutation.isError && (
              <span className="text-sm text-red-700">Erreur lors de l'enregistrement.</span>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
