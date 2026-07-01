import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "../components/admin/admin-shell";
import { useAdmin } from "./admin";
import { adminGetSettings, adminUpdateSetting } from "../lib/settings.functions";
import { User, Bell, Palette, CalendarCog, Shield, CreditCard, FileText, Users, LifeBuoy, Info, Settings as SettingsIcon } from "lucide-react";

export const Route = createFileRoute("/admin/parametres")({
  head: () => ({ meta: [{ title: "Paramètres — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ParametresPage,
});

const tiles = [
  { icon: User, label: "Mon profil", desc: "Gérez vos informations personnelles et professionnelles.", cta: "Modifier" },
  { icon: Bell, label: "Notifications", desc: "Choisissez vos préférences de notifications et rappels.", cta: "Configurer" },
  { icon: Palette, label: "Préférences", desc: "Personnalisez votre interface et vos préférences d'utilisation.", cta: "Personnaliser" },
  { icon: CalendarCog, label: "Agenda", desc: "Définissez vos horaires, durées de consultation et disponibilités.", cta: "Paramétrer" },
  { icon: Shield, label: "Confidentialité", desc: "Gérez la confidentialité de vos données et celles de vos clients.", cta: "Voir" },
  { icon: FileText, label: "Modèles & Documents", desc: "Gérez vos modèles de documents, ordonnances et comptes-rendus.", cta: "Gérer" },
  { icon: Shield, label: "Sécurité", desc: "Changez votre mot de passe et renforcez la sécurité de votre compte.", cta: "Sécuriser" },
  { icon: Users, label: "Équipe", desc: "Gérez les membres de votre équipe et leurs accès.", cta: "Gérer" },
  { icon: SettingsIcon, label: "Paramètres généraux", desc: "Paramètres généraux de l'application et du compte.", cta: "Configurer" },
  { icon: Info, label: "À propos de Jabamiah", desc: "Informations sur la plateforme Jabamiah Médecine Parallèle.", cta: "En savoir plus" },
  { icon: LifeBuoy, label: "Aide & support", desc: "Accédez à l'aide en ligne et contactez notre support.", cta: "Accéder" },
];

function ParametresPage() {
  const { signOut } = useAdmin();
  return (
    <AdminShell title="Paramètres" subtitle="Gérez votre compte et vos préférences" onSignOut={signOut}>
      {/* Welcome banner */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-card p-6 ring-1 ring-gold/15 md:p-8">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-forest text-lg font-medium text-cream">LO</div>
          <div>
            <h2 className="font-serif text-2xl text-forest">Bienvenue, Loïc</h2>
            <p className="text-sm text-earth/70">Configurez votre espace Jabamiah selon vos besoins.</p>
          </div>
        </div>
        <div className="text-right italic text-sm text-earth/70">
          <p>Prendre soin de l'autre,</p>
          <p>commence par s'organiser.</p>
        </div>
      </div>

      {/* Tiles */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="flex flex-col rounded-xl bg-card p-6 ring-1 ring-gold/15">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--gold-soft)]/50 text-forest">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-serif text-lg text-forest">{t.label}</h3>
              <p className="mt-1 flex-1 text-sm text-earth/70">{t.desc}</p>
              <button className="mt-5 inline-flex items-center justify-between rounded-md border border-gold/30 px-3 py-2 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm">
                <span>{t.cta}</span>
                <span>›</span>
              </button>
            </div>
          );
        })}

        {/* Paiements donations settings — real */}
        <div className="flex flex-col rounded-xl bg-card p-6 ring-1 ring-gold/15 sm:col-span-2 lg:col-span-3 xl:col-span-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--gold-soft)]/50 text-forest">
            <CreditCard className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-serif text-lg text-forest">Paiements — Configuration PayPal</h3>
          <p className="mt-1 text-sm text-earth/70">Client ID PayPal et montants de dons suggérés pour la page /don.</p>
          <PaymentsSettings />
        </div>
      </div>

      {/* Sidebar summary */}
      <div className="mt-10 rounded-2xl bg-gradient-to-br from-cream-warm to-cream p-6 ring-1 ring-gold/15">
        <h3 className="font-serif text-xl text-forest">Résumé du compte</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {[
            ["Prochain RDV", "Demain à 14h00"],
            ["Clients", "28"],
            ["Consultations", "152"],
            ["Documents", "36"],
            ["Abonnement", "Premium"],
            ["Fin d'abonnement", "15/06/2026"],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-xs uppercase tracking-[0.15em] text-earth/60">{k}</p>
              <p className="mt-1 text-sm font-medium text-forest">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

function PaymentsSettings() {
  const getSettings = useServerFn(adminGetSettings);
  const updateSetting = useServerFn(adminUpdateSetting);
  const { data: settings } = useQuery({ queryKey: ["admin-settings"], queryFn: () => getSettings() });

  const [paypalClientId, setPaypalClientId] = useState("");
  const [donationAmounts, setDonationAmounts] = useState("5,10,20,50");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    if (!settings) return;
    setPaypalClientId(settings.paypal_client_id ?? "");
    try {
      const parsed = JSON.parse(settings.donation_amounts ?? "[5,10,20,50]") as number[];
      setDonationAmounts(parsed.join(","));
    } catch {
      setDonationAmounts("5,10,20,50");
    }
  }, [settings]);

  async function handleSave() {
    setSaveStatus("saving");
    try {
      await updateSetting({ data: { key: "paypal_client_id", value: paypalClientId.trim() } });
      const amounts = donationAmounts.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n) && n > 0);
      await updateSetting({ data: { key: "donation_amounts", value: JSON.stringify(amounts) } });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
    }
  }

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <label className="block">
        <span className="text-xs uppercase tracking-[0.15em] text-forest">Client ID PayPal</span>
        <input
          type="text"
          value={paypalClientId}
          onChange={(e) => setPaypalClientId(e.target.value)}
          placeholder="AZDxx… ou SB-xxx…"
          className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 font-mono text-sm text-forest focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.15em] text-forest">Montants de dons</span>
        <input
          type="text"
          value={donationAmounts}
          onChange={(e) => setDonationAmounts(e.target.value)}
          placeholder="5,10,20,50"
          className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </label>
      <div className="md:col-span-2 flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className="rounded-md bg-forest px-6 py-2.5 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft disabled:opacity-60"
        >
          {saveStatus === "saving" ? "Enregistrement…" : "Enregistrer"}
        </button>
        {saveStatus === "saved" && <p className="text-xs text-forest">Paramètres enregistrés ✓</p>}
        {saveStatus === "error" && <p className="text-xs text-red-700">Erreur d'enregistrement.</p>}
      </div>
    </div>
  );
}
