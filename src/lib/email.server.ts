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
export async function sendOwnerNotification({ subject, html }: { subject: string; html: string }) {
  const resend = getResend();
  if (!resend) {
    console.error("[email] RESEND_API_KEY missing, skipping send:", subject);
    return;
  }
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to: OWNER_CC, subject, html });
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

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const STATUS_LABELS: Record<string, string> = {
  "Planifié": "planifié",
  "Confirmé": "confirmé",
  "Annulé": "annulé",
  "Honoré": "honoré",
  "No-show": "marqué comme absence",
};

export function appointmentConfirmedEmail(clientName: string, startsAt: string, sessionType: string | null) {
  return layout(`
    <h1 style="font-size:22px;color:#1e3a2b;margin:0 0 16px;">Rendez-vous confirmé</h1>
    <p style="font-size:15px;line-height:1.6;">Bonjour ${clientName},</p>
    <p style="font-size:15px;line-height:1.6;">Votre rendez-vous a bien été enregistré :</p>
    <p style="font-size:15px;line-height:1.6;background-color:#f7f1e8;border-radius:8px;padding:14px 18px;">
      📅 ${formatDateTime(startsAt)}${sessionType ? `<br />✨ ${sessionType}` : ""}
    </p>
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

export function consultationReportEmail(clientName: string, consultationDate: string) {
  return layout(`
    <h1 style="font-size:22px;color:#1e3a2b;margin:0 0 16px;">Compte-rendu de séance disponible</h1>
    <p style="font-size:15px;line-height:1.6;">Bonjour ${clientName},</p>
    <p style="font-size:15px;line-height:1.6;">
      Le compte-rendu de votre séance du <strong>${formatDateTime(consultationDate)}</strong> a été ajouté à votre dossier.
    </p>
    <p style="font-size:15px;line-height:1.6;">N'hésitez pas à me contacter si vous souhaitez en discuter.</p>
    <p style="font-size:15px;line-height:1.6;">À bientôt,<br />Loïc</p>
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
