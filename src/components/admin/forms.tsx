import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  FormDrawer,
  Field,
  FieldRow,
  FieldSelect,
  FieldTextarea,
  FieldFile,
} from "./form-drawer";

/**
 * Domain-specific form drawers.
 * Each exports a component that renders a trigger + the drawer.
 * The submit handler is a placeholder (toast) — wire to server functions
 * when the backend tables are created.
 */

type TriggerProps = { children: (open: () => void) => ReactNode };

function useDrawer() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}

function notImplemented(entity: string) {
  return async (_: FormData) => {
    toast.success(`${entity} enregistré (démo — connectez le backend).`);
  };
}

/* ---------- New client ---------- */
export function NewClientDrawer({ children }: TriggerProps) {
  const { open, setOpen } = useDrawer();
  return (
    <>
      {children(() => setOpen(true))}
      <FormDrawer
        open={open}
        onOpenChange={setOpen}
        title="Nouveau client"
        description="Créer une fiche client complète."
        onSubmit={async (data) => {
          await notImplemented("Client")(data);
          setOpen(false);
        }}
      >
        <FieldRow>
          <Field label="Prénom" name="first_name" required />
          <Field label="Nom" name="last_name" required />
        </FieldRow>
        <FieldRow>
          <Field label="Email" name="email" type="email" required />
          <Field label="Téléphone" name="phone" type="tel" />
        </FieldRow>
        <FieldRow>
          <Field label="Date de naissance" name="birthdate" type="date" />
          <Field label="Ville" name="city" />
        </FieldRow>
        <FieldTextarea label="Motif de consultation" name="reason" rows={3} />
        <FieldSelect
          label="Statut"
          name="status"
          defaultValue="nouveau"
          options={[
            { value: "nouveau", label: "Nouveau" },
            { value: "actif", label: "Actif" },
            { value: "fidele", label: "Fidèle" },
            { value: "inactif", label: "Inactif" },
          ]}
        />
        <FieldTextarea label="Notes privées" name="notes" rows={3} placeholder="Observations réservées au thérapeute…" />
      </FormDrawer>
    </>
  );
}

/* ---------- New appointment ---------- */
export function NewAppointmentDrawer({ children }: TriggerProps) {
  const { open, setOpen } = useDrawer();
  return (
    <>
      {children(() => setOpen(true))}
      <FormDrawer
        open={open}
        onOpenChange={setOpen}
        title="Nouveau rendez-vous"
        description="Planifier une séance avec un client."
        onSubmit={async (data) => {
          await notImplemented("Rendez-vous")(data);
          setOpen(false);
        }}
      >
        <Field label="Client" name="client" required placeholder="Rechercher un client…" />
        <FieldRow>
          <Field label="Date" name="date" type="date" required />
          <Field label="Heure" name="time" type="time" required />
        </FieldRow>
        <FieldRow>
          <FieldSelect
            label="Type de séance"
            name="type"
            required
            options={[
              { value: "premiere", label: "Première consultation" },
              { value: "suivi", label: "Suivi énergétique" },
              { value: "bilan", label: "Bilan énergétique" },
              { value: "harmonisation", label: "Harmonisation" },
              { value: "guidance", label: "Guidance spirituelle" },
            ]}
          />
          <FieldSelect
            label="Durée"
            name="duration"
            defaultValue="60"
            options={[
              { value: "30", label: "30 min" },
              { value: "60", label: "1 h" },
              { value: "90", label: "1 h 30" },
              { value: "120", label: "2 h" },
            ]}
          />
        </FieldRow>
        <FieldSelect
          label="Lieu"
          name="location"
          defaultValue="cabinet"
          options={[
            { value: "cabinet", label: "Cabinet — Rouen" },
            { value: "distance", label: "À distance (visio)" },
            { value: "domicile", label: "Au domicile du client" },
          ]}
        />
        <FieldTextarea label="Note" name="note" rows={3} placeholder="Précisions, préparation, matériel…" />
      </FormDrawer>
    </>
  );
}

/* ---------- New consultation (compte-rendu) ---------- */
export function NewConsultationDrawer({ children }: TriggerProps) {
  const { open, setOpen } = useDrawer();
  return (
    <>
      {children(() => setOpen(true))}
      <FormDrawer
        open={open}
        onOpenChange={setOpen}
        title="Nouvelle consultation"
        description="Compte-rendu de séance."
        onSubmit={async (data) => {
          await notImplemented("Consultation")(data);
          setOpen(false);
        }}
      >
        <Field label="Client" name="client" required />
        <FieldRow>
          <Field label="Date" name="date" type="date" required />
          <FieldSelect
            label="Durée"
            name="duration"
            defaultValue="60"
            options={[
              { value: "30", label: "30 min" },
              { value: "60", label: "1 h" },
              { value: "90", label: "1 h 30" },
            ]}
          />
        </FieldRow>
        <FieldSelect
          label="Ressenti global"
          name="mood"
          defaultValue="6"
          options={Array.from({ length: 10 }, (_, i) => ({
            value: String(i + 1),
            label: `${i + 1} / 10`,
          }))}
        />
        <FieldTextarea label="Objectifs travaillés" name="objectives" rows={3} />
        <FieldTextarea label="Techniques utilisées" name="techniques" rows={2} placeholder="Magnétisme, harmonisation…" />
        <FieldTextarea label="Compte-rendu" name="report" rows={5} required />
        <FieldTextarea label="Recommandations" name="advice" rows={3} placeholder="Exercices, plantes, rituels…" />
      </FormDrawer>
    </>
  );
}

/* ---------- New protocol ---------- */
export function NewProtocolDrawer({ children }: TriggerProps) {
  const { open, setOpen } = useDrawer();
  return (
    <>
      {children(() => setOpen(true))}
      <FormDrawer
        open={open}
        onOpenChange={setOpen}
        title="Nouveau protocole"
        description="Ajouter un rituel ou une technique à votre bibliothèque."
        onSubmit={async (data) => {
          await notImplemented("Protocole")(data);
          setOpen(false);
        }}
      >
        <Field label="Nom du protocole" name="name" required />
        <FieldTextarea label="Description courte" name="description" rows={2} required />
        <FieldRow>
          <FieldSelect
            label="Catégorie"
            name="category"
            options={[
              { value: "energetique", label: "Énergétique" },
              { value: "meditation", label: "Méditation" },
              { value: "respiration", label: "Respiration" },
              { value: "harmonisation", label: "Harmonisation" },
              { value: "purification", label: "Purification" },
            ]}
          />
          <Field label="Durée (min)" name="duration_minutes" type="number" defaultValue={45} />
        </FieldRow>
        <FieldTextarea label="Étapes détaillées" name="steps" rows={6} placeholder="1. …&#10;2. …&#10;3. …" />
        <FieldTextarea label="Contre-indications" name="warnings" rows={2} />
      </FormDrawer>
    </>
  );
}

/* ---------- Upload document ---------- */
export function UploadDocumentDrawer({ children }: TriggerProps) {
  const { open, setOpen } = useDrawer();
  return (
    <>
      {children(() => setOpen(true))}
      <FormDrawer
        open={open}
        onOpenChange={setOpen}
        title="Importer un document"
        description="PDF, image ou modèle réutilisable."
        submitLabel="Importer"
        onSubmit={async (data) => {
          await notImplemented("Document")(data);
          setOpen(false);
        }}
      >
        <FieldFile label="Fichier" name="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" required />
        <Field label="Titre du document" name="title" required />
        <FieldRow>
          <FieldSelect
            label="Type"
            name="type"
            options={[
              { value: "compte-rendu", label: "Compte-rendu" },
              { value: "bilan", label: "Bilan" },
              { value: "ordonnance", label: "Ordonnance" },
              { value: "modele", label: "Modèle" },
              { value: "autre", label: "Autre" },
            ]}
          />
          <Field label="Client associé" name="client" placeholder="Optionnel" />
        </FieldRow>
        <FieldTextarea label="Description" name="description" rows={2} />
      </FormDrawer>
    </>
  );
}

/* ---------- Add manual donation / payment ---------- */
export function NewPaymentDrawer({ children }: TriggerProps) {
  const { open, setOpen } = useDrawer();
  return (
    <>
      {children(() => setOpen(true))}
      <FormDrawer
        open={open}
        onOpenChange={setOpen}
        title="Enregistrer un don"
        description="Ajouter manuellement une contribution reçue."
        onSubmit={async (data) => {
          await notImplemented("Don")(data);
          setOpen(false);
        }}
      >
        <FieldRow>
          <Field label="Date" name="date" type="date" required />
          <Field label="Montant (€)" name="amount" type="number" required defaultValue={20} />
        </FieldRow>
        <Field label="Donateur" name="donor" placeholder="Nom ou « Anonyme »" required />
        <FieldSelect
          label="Moyen"
          name="method"
          options={[
            { value: "paypal", label: "PayPal" },
            { value: "virement", label: "Virement" },
            { value: "especes", label: "Espèces" },
            { value: "cheque", label: "Chèque" },
            { value: "autre", label: "Autre" },
          ]}
        />
        <Field label="Référence" name="reference" placeholder="TXN-…, VIR-…" />
        <FieldTextarea label="Note" name="note" rows={2} />
      </FormDrawer>
    </>
  );
}

/* ---------- New energy assessment (bilan) ---------- */
export function NewBilanDrawer({ children }: TriggerProps) {
  const { open, setOpen } = useDrawer();
  return (
    <>
      {children(() => setOpen(true))}
      <FormDrawer
        open={open}
        onOpenChange={setOpen}
        title="Nouveau bilan énergétique"
        description="Saisir les valeurs par axe et par chakra."
        onSubmit={async (data) => {
          await notImplemented("Bilan")(data);
          setOpen(false);
        }}
      >
        <Field label="Client" name="client" required />
        <Field label="Date du bilan" name="date" type="date" required />
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-forest">
            Axes énergétiques (0-10)
          </p>
          <div className="grid grid-cols-2 gap-3">
            {["Énergie", "Stress", "Émotions", "Motivation", "Confiance", "Fatigue", "Douleurs", "Concentration"].map(
              (axe) => (
                <label key={axe} className="flex items-center justify-between gap-2 rounded-lg bg-cream-warm/60 px-3 py-2 text-sm">
                  <span className="text-earth/80">{axe}</span>
                  <input
                    type="number"
                    name={`axe_${axe.toLowerCase()}`}
                    min={0}
                    max={10}
                    defaultValue={5}
                    className="w-14 rounded-md border border-gold/25 bg-card px-2 py-1 text-right text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </label>
              ),
            )}
          </div>
        </div>
        <FieldTextarea label="Observations" name="observations" rows={4} placeholder="Ressentis, blocages, dynamiques…" />
      </FormDrawer>
    </>
  );
}
