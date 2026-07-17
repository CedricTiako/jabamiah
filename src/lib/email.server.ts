// Server-side Resend client for client-facing notification emails.
// Load inside server handlers: const { sendClientEmail } = await import("./email.server");
// Top-level import is safe only in .server.ts modules — *.functions.ts files ship to the client bundle.
import { Resend } from "resend";

const FROM = "Jabamiah <contact@jabamiah.eu>";

// Every client-facing notification also goes to the practice owner as a paper trail
// (proof of send for disputes/cancellations, quick archive without opening the admin panel).
const OWNER_CC = "eirl.omont@gmail.com";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

// Best-effort: a failed/misconfigured send must never break the admin action that triggered it.
export async function sendClientEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const resend = getResend();
  if (!resend) {
    console.error("[email] RESEND_API_KEY missing, skipping send:", subject);
    return;
  }
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to, cc: OWNER_CC, subject, html });
    if (error) console.error("[email] Resend error:", error);
    else console.log("[email] sent:", data?.id, "to", to, "-", subject);
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}

// For internal notifications to the owner (not client-facing) — no CC needed since
// they're already the recipient.
export async function sendOwnerNotification({ subject, html, replyTo }: { subject: string; html: string; replyTo?: string }) {
  const resend = getResend();
  if (!resend) {
    console.error("[email] RESEND_API_KEY missing, skipping send:", subject);
    return;
  }
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to: OWNER_CC, subject, html, ...(replyTo ? { replyTo } : {}) });
    if (error) console.error("[email] Resend error:", error);
    else console.log("[email] sent:", data?.id, "to", OWNER_CC, "-", subject);
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}

function layout(bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<body style="margin:0;padding:0;background-color:#f7f1e8;font-family:Georgia,'Times New Roman',serif;color:#3a3226;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f1e8;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:520px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background-color:#1e3a2b;padding:28px 32px;">
          <span style="color:#e9c987;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Jabamiah</span>
          <div style="color:#f7f1e8;font-size:13px;margin-top:4px;">Médecine parallèle &amp; soins énergétiques</div>
        </td></tr>
        <tr><td style="padding:32px;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:20px 32px;background-color:#f7f1e8;font-size:12px;color:#8a7f6b;">
          Jabamiah — Loïc Omont · Forges-les-Eaux, Normandie<br />
          Cet email vous a été envoyé suite à une action sur votre dossier chez Jabamiah.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// The server process's local timezone is not guaranteed to be Europe/Paris (Plesk/Node
// hosts often default to UTC), which silently shifted every emailed time by the UTC
// offset. Pin the zone explicitly so the client always reads the time Loïc actually set.
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });
}

const STATUS_LABELS: Record<string, string> = {
  "Planifié": "planifié",
  "Confirmé": "confirmé",
  "Annulé": "annulé",
  "Honoré": "honoré",
  "No-show": "marqué comme absence",
};

const SESSION_TYPE_LABELS: Record<string, string> = {
  premiere: "Première consultation",
  suivi: "Suivi énergétique",
  bilan: "Bilan énergétique",
  harmonisation: "Harmonisation",
  guidance: "Guidance spirituelle",
};

const LOCATION_LABELS: Record<string, string> = {
  cabinet: "Cabinet — Forges-les-Eaux",
  distance: "À distance (visio)",
  domicile: "Au domicile du client",
};

export type AppointmentEmailDetails = {
  startsAt: string;
  sessionType: string | null;
  durationMinutes: number;
  location: string | null;
  note: string | null;
};

function appointmentDetailsBlock(appt: AppointmentEmailDetails) {
  const sessionLabel = appt.sessionType ? SESSION_TYPE_LABELS[appt.sessionType] ?? appt.sessionType : null;
  const locationLabel = appt.location ? LOCATION_LABELS[appt.location] ?? appt.location : null;
  return `
    <p style="font-size:15px;line-height:1.6;background-color:#f7f1e8;border-radius:8px;padding:14px 18px;">
      📅 ${formatDateTime(appt.startsAt)}<br />
      ⏱️ ${appt.durationMinutes} minutes
      ${sessionLabel ? `<br />✨ ${esc(sessionLabel)}` : ""}
      ${locationLabel ? `<br />📍 ${esc(locationLabel)}` : ""}
    </p>
    ${appt.note ? `<p style="font-size:14px;line-height:1.6;color:#6b6353;"><strong>Note :</strong> ${esc(appt.note)}</p>` : ""}
  `;
}

export function appointmentConfirmedEmail(clientName: string, appt: AppointmentEmailDetails) {
  return layout(`
    <h1 style="font-size:22px;color:#1e3a2b;margin:0 0 16px;">Rendez-vous confirmé</h1>
    <p style="font-size:15px;line-height:1.6;">Bonjour ${clientName},</p>
    <p style="font-size:15px;line-height:1.6;">Votre rendez-vous a bien été enregistré :</p>
    ${appointmentDetailsBlock(appt)}
    <p style="font-size:15px;line-height:1.6;">À bientôt,<br />Loïc</p>
  `);
}

export function appointmentUpdatedEmail(clientName: string, appt: AppointmentEmailDetails) {
  return layout(`
    <h1 style="font-size:22px;color:#1e3a2b;margin:0 0 16px;">Rendez-vous modifié</h1>
    <p style="font-size:15px;line-height:1.6;">Bonjour ${clientName},</p>
    <p style="font-size:15px;line-height:1.6;">Votre rendez-vous a été mis à jour. Voici les nouvelles informations :</p>
    ${appointmentDetailsBlock(appt)}
    <p style="font-size:15px;line-height:1.6;">À bientôt,<br />Loïc</p>
  `);
}

export function appointmentStatusEmail(clientName: string, startsAt: string, status: string) {
  return layout(`
    <h1 style="font-size:22px;color:#1e3a2b;margin:0 0 16px;">Mise à jour de votre rendez-vous</h1>
    <p style="font-size:15px;line-height:1.6;">Bonjour ${clientName},</p>
    <p style="font-size:15px;line-height:1.6;">
      Votre rendez-vous du <strong>${formatDateTime(startsAt)}</strong> est désormais
      <strong>${STATUS_LABELS[status] ?? status}</strong>.
    </p>
    <p style="font-size:15px;line-height:1.6;">À bientôt,<br />Loïc</p>
  `);
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

export type ConsultationEmailDetails = {
  consultationDate: string;
  durationMinutes: number;
  objectives: string | null;
  techniques: string | null;
  report: string;
  advice: string | null;
};

function fieldBlock(label: string, value: string | null) {
  if (!value) return "";
  return `
    <p style="font-size:14px;line-height:1.6;margin:14px 0 4px;color:#1e3a2b;font-weight:bold;">${esc(label)}</p>
    <p style="font-size:15px;line-height:1.6;white-space:pre-wrap;">${esc(value)}</p>
  `;
}

export function consultationReportEmail(clientName: string, consult: ConsultationEmailDetails) {
  return layout(`
    <h1 style="font-size:22px;color:#1e3a2b;margin:0 0 16px;">Compte-rendu de séance disponible</h1>
    <p style="font-size:15px;line-height:1.6;">Bonjour ${clientName},</p>
    <p style="font-size:15px;line-height:1.6;">
      Voici le compte-rendu de votre séance du <strong>${formatDateTime(consult.consultationDate)}</strong> (${consult.durationMinutes} minutes) :
    </p>
    <div style="background-color:#f7f1e8;border-radius:8px;padding:14px 18px;">
      ${fieldBlock("Objectifs travaillés", consult.objectives)}
      ${fieldBlock("Techniques utilisées", consult.techniques)}
      ${fieldBlock("Compte-rendu", consult.report)}
      ${fieldBlock("Conseils & recommandations", consult.advice)}
    </div>
    <p style="font-size:15px;line-height:1.6;margin-top:16px;">N'hésitez pas à me contacter si vous souhaitez en discuter.</p>
    <p style="font-size:15px;line-height:1.6;">À bientôt,<br />Loïc</p>
  `);
}

export function newContactMessageEmail(name: string, email: string, subject: string | null, message: string) {
  return layout(`
    <h1 style="font-size:22px;color:#1e3a2b;margin:0 0 16px;">Nouveau message du site</h1>
    <p style="font-size:15px;line-height:1.6;"><strong>${esc(name)}</strong> (<a href="mailto:${esc(email)}">${esc(email)}</a>) vous a écrit${subject ? ` — ${esc(subject)}` : ""} :</p>
    <p style="font-size:15px;line-height:1.6;background-color:#f7f1e8;border-radius:8px;padding:14px 18px;white-space:pre-wrap;">${esc(message)}</p>
    <p style="font-size:15px;line-height:1.6;">Répondez directement à cet email pour lui répondre.</p>
  `);
}

export function newReviewPendingEmail(authorName: string, rating: number, body: string) {
  return layout(`
    <h1 style="font-size:22px;color:#1e3a2b;margin:0 0 16px;">Nouvel avis à modérer</h1>
    <p style="font-size:15px;line-height:1.6;">
      <strong>${authorName}</strong> a laissé un avis ${"★".repeat(rating)}${"☆".repeat(5 - rating)}
    </p>
    <p style="font-size:15px;line-height:1.6;background-color:#f7f1e8;border-radius:8px;padding:14px 18px;white-space:pre-wrap;">${body}</p>
    <p style="font-size:15px;line-height:1.6;">Rendez-vous dans l'admin → Avis clients pour l'approuver ou le refuser avant qu'il apparaisse sur le site.</p>
  `);
}

const AXIS_LABELS: Record<string, string> = {
  axis_energie: "Énergie générale",
  axis_stress: "Stress",
  axis_emotions: "Émotions",
  axis_motivation: "Motivation",
  axis_confiance: "Confiance en soi",
  axis_fatigue: "Fatigue",
  axis_douleurs: "Douleurs",
  axis_concentration: "Concentration",
};

export type EnergyAssessmentEmailDetails = {
  assessmentDate: string;
  axisEnergie: number;
  axisStress: number;
  axisEmotions: number;
  axisMotivation: number;
  axisConfiance: number;
  axisFatigue: number;
  axisDouleurs: number;
  axisConcentration: number;
  observations: string | null;
};

export function energyAssessmentEmail(clientName: string, bilan: EnergyAssessmentEmailDetails) {
  const rows: Array<[string, number]> = [
    [AXIS_LABELS.axis_energie, bilan.axisEnergie],
    [AXIS_LABELS.axis_stress, bilan.axisStress],
    [AXIS_LABELS.axis_emotions, bilan.axisEmotions],
    [AXIS_LABELS.axis_motivation, bilan.axisMotivation],
    [AXIS_LABELS.axis_confiance, bilan.axisConfiance],
    [AXIS_LABELS.axis_fatigue, bilan.axisFatigue],
    [AXIS_LABELS.axis_douleurs, bilan.axisDouleurs],
    [AXIS_LABELS.axis_concentration, bilan.axisConcentration],
  ];
  return layout(`
    <h1 style="font-size:22px;color:#1e3a2b;margin:0 0 16px;">Votre bilan énergétique est disponible</h1>
    <p style="font-size:15px;line-height:1.6;">Bonjour ${clientName},</p>
    <p style="font-size:15px;line-height:1.6;">
      Voici votre bilan énergétique du <strong>${formatDateTime(bilan.assessmentDate)}</strong> :
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f1e8;border-radius:8px;padding:8px 0;">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="padding:6px 18px;font-size:14px;">${esc(label)}</td>
          <td style="padding:6px 18px;font-size:14px;font-weight:bold;color:#1e3a2b;text-align:right;">${value} / 10</td>
        </tr>`,
        )
        .join("")}
    </table>
    ${fieldBlock("Observations", bilan.observations)}
    <p style="font-size:15px;line-height:1.6;margin-top:16px;">N'hésitez pas à me contacter si vous souhaitez en discuter.</p>
    <p style="font-size:15px;line-height:1.6;">À bientôt,<br />Loïc</p>
  `);
}

export function documentAddedEmail(clientName: string, documentTitle: string) {
  return layout(`
    <h1 style="font-size:22px;color:#1e3a2b;margin:0 0 16px;">Nouveau document dans votre dossier</h1>
    <p style="font-size:15px;line-height:1.6;">Bonjour ${clientName},</p>
    <p style="font-size:15px;line-height:1.6;">
      Un nouveau document a été ajouté à votre dossier : <strong>${documentTitle}</strong>.
    </p>
    <p style="font-size:15px;line-height:1.6;">Contactez-moi si vous souhaitez en recevoir une copie.</p>
    <p style="font-size:15px;line-height:1.6;">À bientôt,<br />Loïc</p>
  `);
}
