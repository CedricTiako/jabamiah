import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "../components/admin/admin-shell";
import { TeamPanel } from "../components/admin/team-panel";
import { useAdmin } from "../lib/admin-context";
import { adminGetSettings, adminUpdateSetting } from "../lib/settings.functions";
import { getMyProfile, upsertMyProfile } from "../lib/profiles.functions";
import { adminListClients } from "../lib/clients.functions";
import { adminListConsultations } from "../lib/consultations.functions";
import { adminListDocuments } from "../lib/documents.functions";
import { adminListAppointments } from "../lib/appointments.functions";
import { supabase } from "../integrations/supabase/client";
import {
  User,
  Bell,
  Palette,
  CalendarCog,
  Shield,
  CreditCard,
  FileText,
  Users,
  LifeBuoy,
  Info,
  Settings as SettingsIcon,
} from "lucide-react";

export const Route = createFileRoute("/admin/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres — Jabamiah Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ParametresPage,
});

const tiles = [
  {
    icon: User,
    label: "Mon profil",
    desc: "Gérez vos informations personnelles et professionnelles.",
    cta: "Modifier",
    anchor: "mon-profil",
  },
  {
    icon: Bell,
    label: "Notifications",
    desc: "Choisissez vos préférences de notifications et rappels.",
    cta: "Configurer",
    anchor: "notifications",
  },
  {
    icon: Palette,
    label: "Préférences",
    desc: "Personnalisez votre interface et vos préférences d'utilisation.",
    cta: "Personnaliser",
    anchor: "preferences",
  },
  {
    icon: CalendarCog,
    label: "Agenda",
    desc: "Définissez vos horaires, durées de consultation et disponibilités.",
    cta: "Paramétrer",
    anchor: "agenda-settings",
  },
  {
    icon: Shield,
    label: "Confidentialité",
    desc: "Gérez la confidentialité de vos données et celles de vos clients.",
    cta: "Voir",
    anchor: "confidentialite",
  },
  {
    icon: FileText,
    label: "Modèles & Documents",
    desc: "Gérez vos modèles de documents, ordonnances et comptes-rendus.",
    cta: "Gérer",
    anchor: "modeles",
  },
  {
    icon: Shield,
    label: "Sécurité",
    desc: "Changez votre mot de passe et renforcez la sécurité de votre compte.",
    cta: "Sécuriser",
    anchor: "securite",
  },
  {
    icon: Users,
    label: "Équipe",
    desc: "Gérez les membres de votre équipe et leurs accès.",
    cta: "Gérer",
    anchor: "equipe",
  },
  {
    icon: SettingsIcon,
    label: "Paramètres généraux",
    desc: "Paramètres généraux de l'application et du compte.",
    cta: "Configurer",
    anchor: "parametres-generaux",
  },
  {
    icon: Info,
    label: "À propos de Jabamiah",
    desc: "Informations sur la plateforme Jabamiah Médecine Parallèle.",
    cta: "En savoir plus",
    anchor: "a-propos",
  },
];

function ParametresPage() {
  const { signOut } = useAdmin();
  const listClients = useServerFn(adminListClients);
  const listConsultations = useServerFn(adminListConsultations);
  const listDocuments = useServerFn(adminListDocuments);
  const listAppointments = useServerFn(adminListAppointments);

  const { data: clients } = useQuery({ queryKey: ["admin-clients"], queryFn: () => listClients() });
  const { data: consultations } = useQuery({
    queryKey: ["admin-consultations"],
    queryFn: () => listConsultations(),
  });
  const { data: documents } = useQuery({
    queryKey: ["admin-documents"],
    queryFn: () => listDocuments(),
  });
  const { data: appointments } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: () => listAppointments(),
  });

  const now = new Date();
  const nextAppointment = (appointments ?? [])
    .filter((a) => new Date(a.starts_at) >= now && a.status !== "Annulé")
    .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())[0];

  return (
    <AdminShell
      title="Paramètres"
      subtitle="Gérez votre compte et vos préférences"
      onSignOut={signOut}
    >
      {/* Welcome banner */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-card p-6 ring-1 ring-gold/15 md:p-8">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-forest text-lg font-medium text-cream">
            LO
          </div>
          <div>
            <h2 className="font-serif text-2xl text-forest">Bienvenue, Loïc</h2>
            <p className="text-sm text-earth/70">
              Configurez votre espace Jabamiah selon vos besoins.
            </p>
          </div>
        </div>
        <div className="text-right italic text-sm text-earth/70">
          <p>Prendre soin de l'autre,</p>
          <p>commence par s'organiser.</p>
        </div>
      </div>

      {/* Tiles — overview / quick links to the sections below */}
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
              <a
                href={`#${t.anchor}`}
                className="mt-5 inline-flex items-center justify-between rounded-md border border-gold/30 px-3 py-2 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm"
              >
                <span>{t.cta}</span>
                <span>›</span>
              </a>
            </div>
          );
        })}

        <Link
          to="/admin/aide"
          className="flex flex-col rounded-xl bg-card p-6 ring-1 ring-gold/15 hover:bg-cream-warm"
        >
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--gold-soft)]/50 text-forest">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-serif text-lg text-forest">Aide & support</h3>
          <p className="mt-1 flex-1 text-sm text-earth/70">
            Accédez à l'aide en ligne et contactez notre support.
          </p>
          <span className="mt-5 inline-flex items-center justify-between rounded-md border border-gold/30 px-3 py-2 text-xs uppercase tracking-[0.15em] text-forest">
            <span>Accéder</span>
            <span>›</span>
          </span>
        </Link>

        {/* Mon profil */}
        <SettingsSection
          id="mon-profil"
          icon={User}
          title="Mon profil"
          desc="Vos informations personnelles et professionnelles."
        >
          <ProfileSettings />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection
          id="notifications"
          icon={Bell}
          title="Notifications"
          desc="Choisissez les notifications que vous recevez."
        >
          <NotificationsSettings />
        </SettingsSection>

        {/* Préférences */}
        <SettingsSection
          id="preferences"
          icon={Palette}
          title="Préférences"
          desc="Interface et préférences d'utilisation."
        >
          <GenericSettingsGroup
            fields={PREFERENCES_FIELDS}
            successMessage="Préférences enregistrées ✓"
          />
        </SettingsSection>

        {/* Agenda */}
        <SettingsSection
          id="agenda-settings"
          icon={CalendarCog}
          title="Agenda"
          desc="Horaires et durées de consultation par défaut."
        >
          <GenericSettingsGroup
            fields={AGENDA_FIELDS}
            successMessage="Paramètres d'agenda enregistrés ✓"
          />
        </SettingsSection>

        {/* Confidentialité */}
        <SettingsSection
          id="confidentialite"
          icon={Shield}
          title="Confidentialité"
          desc="Confidentialité de vos données et de celles de vos clients."
        >
          <GenericSettingsGroup
            fields={PRIVACY_FIELDS}
            successMessage="Paramètres de confidentialité enregistrés ✓"
          />
        </SettingsSection>

        {/* Modèles & Documents */}
        <SettingsSection
          id="modeles"
          icon={FileText}
          title="Modèles & Documents"
          desc="Modèles de comptes-rendus et de factures."
        >
          <GenericSettingsGroup fields={TEMPLATE_FIELDS} successMessage="Modèles enregistrés ✓" />
        </SettingsSection>

        {/* Sécurité */}
        <SettingsSection
          id="securite"
          icon={Shield}
          title="Sécurité"
          desc="Mot de passe et sessions actives."
        >
          <SecuritySettings />
        </SettingsSection>

        {/* Équipe */}
        <SettingsSection
          id="equipe"
          icon={Users}
          title="Équipe"
          desc="Membres ayant accès au tableau de bord admin."
        >
          <TeamPanel />
        </SettingsSection>

        {/* Paramètres généraux */}
        <SettingsSection
          id="parametres-generaux"
          icon={SettingsIcon}
          title="Paramètres généraux"
          desc="Identité et coordonnées de l'application."
        >
          <GenericSettingsGroup
            fields={GENERAL_FIELDS}
            successMessage="Paramètres généraux enregistrés ✓"
          />
        </SettingsSection>

        {/* À propos */}
        <SettingsSection
          id="a-propos"
          icon={Info}
          title="À propos de Jabamiah"
          desc="Texte de présentation de la plateforme."
        >
          <GenericSettingsGroup fields={ABOUT_FIELDS} successMessage="Enregistré ✓" />
        </SettingsSection>

        {/* Paiements donations settings — real */}
        <div className="flex flex-col rounded-xl bg-card p-6 ring-1 ring-gold/15 sm:col-span-2 lg:col-span-3 xl:col-span-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--gold-soft)]/50 text-forest">
            <CreditCard className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-serif text-lg text-forest">Paiements — Configuration PayPal</h3>
          <p className="mt-1 text-sm text-earth/70">
            Client ID PayPal et montants de dons suggérés pour la page /don.
          </p>
          <PaymentsSettings />
        </div>

        {/* Legal / RGPD settings */}
        <div className="flex flex-col rounded-xl bg-card p-6 ring-1 ring-gold/15 sm:col-span-2 lg:col-span-3 xl:col-span-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--gold-soft)]/50 text-forest">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-serif text-lg text-forest">
            Informations légales (Mentions légales / RGPD)
          </h3>
          <p className="mt-1 text-sm text-earth/70">
            Ces champs alimentent les pages <em>Mentions légales</em>,{" "}
            <em>Politique de confidentialité</em> et <em>CGU</em>.
          </p>
          <LegalSettings />
        </div>
      </div>

      {/* Sidebar summary */}
      <div className="mt-10 rounded-2xl bg-gradient-to-br from-cream-warm to-cream p-6 ring-1 ring-gold/15">
        <h3 className="font-serif text-xl text-forest">Résumé du compte</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {[
            [
              "Prochain RDV",
              nextAppointment
                ? new Date(nextAppointment.starts_at).toLocaleString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Aucun",
            ],
            ["Clients", String(clients?.length ?? "—")],
            ["Consultations", String(consultations?.length ?? "—")],
            ["Documents", String(documents?.length ?? "—")],
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

function SettingsSection({
  id,
  icon: Icon,
  title,
  desc,
  children,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="flex scroll-mt-6 flex-col rounded-xl bg-card p-6 ring-1 ring-gold/15 sm:col-span-2 lg:col-span-3 xl:col-span-4"
    >
      <div className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--gold-soft)]/50 text-forest">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-serif text-lg text-forest">{title}</h3>
      <p className="mt-1 text-sm text-earth/70">{desc}</p>
      {children}
    </div>
  );
}

function PaymentsSettings() {
  const getSettings = useServerFn(adminGetSettings);
  const updateSetting = useServerFn(adminUpdateSetting);
  const { data: settings } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => getSettings(),
  });

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
      const amounts = donationAmounts
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n) && n > 0);
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

const LEGAL_FIELDS: { key: string; label: string; placeholder: string; multiline?: boolean }[] = [
  {
    key: "legal_editor_name",
    label: "Raison sociale / nom de l'éditeur",
    placeholder: "Ex. Loïc Omont",
  },
  {
    key: "legal_editor_status",
    label: "Statut juridique",
    placeholder: "EI / EIRL / auto-entrepreneur / SASU…",
  },
  { key: "legal_editor_siret", label: "SIRET", placeholder: "14 chiffres" },
  {
    key: "legal_editor_address",
    label: "Adresse postale",
    placeholder: "N°, rue, code postal, ville",
    multiline: true,
  },
  {
    key: "legal_publication_director",
    label: "Directeur / directrice de la publication",
    placeholder: "Nom et prénom",
  },
];

function LegalSettings() {
  const getSettings = useServerFn(adminGetSettings);
  const updateSetting = useServerFn(adminUpdateSetting);
  const { data: settings, refetch } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => getSettings(),
  });

  const [values, setValues] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    if (!settings) return;
    const next: Record<string, string> = {};
    for (const f of LEGAL_FIELDS) next[f.key] = settings[f.key] ?? "";
    setValues(next);
  }, [settings]);

  async function handleSave() {
    setSaveStatus("saving");
    try {
      for (const f of LEGAL_FIELDS) {
        await updateSetting({ data: { key: f.key, value: (values[f.key] ?? "").trim() } });
      }
      await refetch();
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
    }
  }

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {LEGAL_FIELDS.map((f) => (
        <label key={f.key} className={`block ${f.multiline ? "md:col-span-2" : ""}`}>
          <span className="text-xs uppercase tracking-[0.15em] text-forest">{f.label}</span>
          {f.multiline ? (
            <textarea
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              rows={2}
              className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-gold"
            />
          ) : (
            <input
              type="text"
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-gold"
            />
          )}
        </label>
      ))}
      <div className="md:col-span-2 flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className="rounded-md bg-forest px-6 py-2.5 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft disabled:opacity-60"
        >
          {saveStatus === "saving" ? "Enregistrement…" : "Enregistrer"}
        </button>
        {saveStatus === "saved" && (
          <p className="text-xs text-forest">Informations légales enregistrées ✓</p>
        )}
        {saveStatus === "error" && <p className="text-xs text-red-700">Erreur d'enregistrement.</p>}
      </div>
    </div>
  );
}

/* ---------- Generic site_settings field-group (Préférences / Agenda / Confidentialité / Modèles / Généraux / À propos) ---------- */

type SettingField = { key: string; label: string; placeholder?: string; multiline?: boolean };

const GENERAL_FIELDS: SettingField[] = [
  { key: "site_name", label: "Nom du site", placeholder: "Jabamiah" },
  { key: "contact_email", label: "Email de contact", placeholder: "contact@jabamiah.eu" },
  { key: "contact_phone", label: "Téléphone de contact", placeholder: "+33 7 45 15 54 51" },
  { key: "timezone", label: "Fuseau horaire", placeholder: "Europe/Paris" },
];

const ABOUT_FIELDS: SettingField[] = [
  {
    key: "about_text",
    label: "Texte de présentation",
    placeholder: "Jabamiah accompagne…",
    multiline: true,
  },
];

const AGENDA_FIELDS: SettingField[] = [
  { key: "booking_default_duration_minutes", label: "Durée par défaut (min)", placeholder: "60" },
  {
    key: "booking_working_hours",
    label: "Horaires de disponibilité",
    placeholder: "Lun-Ven 9h-18h",
  },
];

const PRIVACY_FIELDS: SettingField[] = [
  {
    key: "privacy_data_retention_days",
    label: "Durée de conservation des données (jours)",
    placeholder: "365",
  },
  {
    key: "privacy_export_enabled",
    label: "Export des données activé (true/false)",
    placeholder: "true",
  },
];

const PREFERENCES_FIELDS: SettingField[] = [
  { key: "ui_density", label: "Densité de l'interface", placeholder: "confortable ou compact" },
  { key: "ui_default_locale", label: "Langue par défaut", placeholder: "fr" },
];

const TEMPLATE_FIELDS: SettingField[] = [
  {
    key: "template_compte_rendu",
    label: "Modèle de compte-rendu",
    placeholder: "Séance du {{date}} avec {{client}}…",
    multiline: true,
  },
  {
    key: "template_facture",
    label: "Modèle de facture / reçu",
    placeholder: "Reçu pour {{client}}, montant {{montant}}…",
    multiline: true,
  },
];

function GenericSettingsGroup({
  fields,
  successMessage,
}: {
  fields: SettingField[];
  successMessage: string;
}) {
  const getSettings = useServerFn(adminGetSettings);
  const updateSetting = useServerFn(adminUpdateSetting);
  const { data: settings } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => getSettings(),
  });

  const [values, setValues] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    if (!settings) return;
    const next: Record<string, string> = {};
    for (const f of fields) next[f.key] = settings[f.key] ?? "";
    setValues(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  async function handleSave() {
    setSaveStatus("saving");
    try {
      for (const f of fields) {
        await updateSetting({ data: { key: f.key, value: (values[f.key] ?? "").trim() } });
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
    }
  }

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {fields.map((f) => (
        <label key={f.key} className={`block ${f.multiline ? "md:col-span-2" : ""}`}>
          <span className="text-xs uppercase tracking-[0.15em] text-forest">{f.label}</span>
          {f.multiline ? (
            <textarea
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              rows={3}
              className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-gold"
            />
          ) : (
            <input
              type="text"
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-gold"
            />
          )}
        </label>
      ))}
      <div className="md:col-span-2 flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className="rounded-md bg-forest px-6 py-2.5 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft disabled:opacity-60"
        >
          {saveStatus === "saving" ? "Enregistrement…" : "Enregistrer"}
        </button>
        {saveStatus === "saved" && <p className="text-xs text-forest">{successMessage}</p>}
        {saveStatus === "error" && <p className="text-xs text-red-700">Erreur d'enregistrement.</p>}
      </div>
    </div>
  );
}

/* ---------- Mon profil ---------- */

function ProfileSettings() {
  const getProfile = useServerFn(getMyProfile);
  const upsertProfile = useServerFn(upsertMyProfile);
  const { data: profile } = useQuery({ queryKey: ["my-profile"], queryFn: () => getProfile() });

  const [form, setForm] = useState({ full_name: "", phone: "", title: "", bio: "" });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name ?? "",
      phone: profile.phone ?? "",
      title: profile.title ?? "",
      bio: profile.bio ?? "",
    });
  }, [profile]);

  async function handleSave() {
    setSaveStatus("saving");
    try {
      await upsertProfile({ data: form });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
    }
  }

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <label className="block">
        <span className="text-xs uppercase tracking-[0.15em] text-forest">Nom complet</span>
        <input
          value={form.full_name}
          onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
          className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.15em] text-forest">Téléphone</span>
        <input
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.15em] text-forest">Titre professionnel</span>
        <input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Praticien en soins énergétiques"
          className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </label>
      <label className="block md:col-span-2">
        <span className="text-xs uppercase tracking-[0.15em] text-forest">Bio</span>
        <textarea
          rows={3}
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
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
        {saveStatus === "saved" && <p className="text-xs text-forest">Profil enregistré ✓</p>}
        {saveStatus === "error" && <p className="text-xs text-red-700">Erreur d'enregistrement.</p>}
      </div>
    </div>
  );
}

/* ---------- Notifications ---------- */

const NOTIFICATION_TOGGLES: { key: string; label: string }[] = [
  { key: "email_new_message", label: "Email pour chaque nouveau message" },
  { key: "email_new_appointment", label: "Email pour chaque nouveau rendez-vous" },
  { key: "email_weekly_summary", label: "Résumé hebdomadaire par email" },
];

function NotificationsSettings() {
  const getProfile = useServerFn(getMyProfile);
  const upsertProfile = useServerFn(upsertMyProfile);
  const { data: profile } = useQuery({ queryKey: ["my-profile"], queryFn: () => getProfile() });

  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    if (!profile) return;
    setPrefs((profile.notification_prefs as Record<string, boolean>) ?? {});
  }, [profile]);

  async function handleSave() {
    setSaveStatus("saving");
    try {
      await upsertProfile({ data: { notification_prefs: prefs } });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
    }
  }

  return (
    <div className="mt-4 space-y-3">
      {NOTIFICATION_TOGGLES.map((t) => (
        <label
          key={t.key}
          className="flex items-center justify-between gap-4 rounded-lg bg-cream-warm/60 px-3 py-2 text-sm"
        >
          <span className="text-earth/80">{t.label}</span>
          <input
            type="checkbox"
            checked={prefs[t.key] ?? true}
            onChange={(e) => setPrefs((p) => ({ ...p, [t.key]: e.target.checked }))}
            className="h-4 w-4 accent-forest"
          />
        </label>
      ))}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className="rounded-md bg-forest px-6 py-2.5 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft disabled:opacity-60"
        >
          {saveStatus === "saving" ? "Enregistrement…" : "Enregistrer"}
        </button>
        {saveStatus === "saved" && (
          <p className="text-xs text-forest">Préférences enregistrées ✓</p>
        )}
        {saveStatus === "error" && <p className="text-xs text-red-700">Erreur d'enregistrement.</p>}
      </div>
    </div>
  );
}

/* ---------- Sécurité ---------- */

function SecuritySettings() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [signOutStatus, setSignOutStatus] = useState<"idle" | "working" | "done">("idle");

  async function handlePasswordChange() {
    setErrorMessage("");
    if (password.length < 8) {
      setStatus("error");
      setErrorMessage("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setStatus("error");
      setErrorMessage("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setStatus("saving");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }
    setPassword("");
    setConfirmPassword("");
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2500);
  }

  async function handleSignOutOthers() {
    setSignOutStatus("working");
    await supabase.auth.signOut({ scope: "others" });
    setSignOutStatus("done");
    setTimeout(() => setSignOutStatus("idle"), 2500);
  }

  return (
    <div className="mt-4 space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.15em] text-forest">
            Nouveau mot de passe
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.15em] text-forest">
            Confirmer le mot de passe
          </span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </label>
        <div className="md:col-span-2 flex items-center gap-4">
          <button
            type="button"
            onClick={handlePasswordChange}
            disabled={status === "saving"}
            className="rounded-md bg-forest px-6 py-2.5 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft disabled:opacity-60"
          >
            {status === "saving" ? "Enregistrement…" : "Changer le mot de passe"}
          </button>
          {status === "saved" && <p className="text-xs text-forest">Mot de passe mis à jour ✓</p>}
          {status === "error" && <p className="text-xs text-red-700">{errorMessage}</p>}
        </div>
      </div>

      <div className="border-t border-gold/15 pt-4">
        <p className="text-sm text-earth/80">
          Déconnecter toutes les autres sessions actives (autres navigateurs/appareils).
        </p>
        <button
          type="button"
          onClick={handleSignOutOthers}
          disabled={signOutStatus === "working"}
          className="mt-3 rounded-md border border-gold/30 px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm disabled:opacity-60"
        >
          {signOutStatus === "working"
            ? "Déconnexion…"
            : signOutStatus === "done"
              ? "Fait ✓"
              : "Déconnecter les autres sessions"}
        </button>
      </div>
    </div>
  );
}
