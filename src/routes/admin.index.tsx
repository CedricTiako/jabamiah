import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "../integrations/supabase/client";
import {
  adminDeletePost,
  adminListPosts,
  adminListContactMessages,
  checkIsAdmin,
} from "../lib/posts.functions";
import { adminGetSettings, adminUpdateSetting } from "../lib/settings.functions";
import { SUPPORTED_LANGUAGES } from "../i18n";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — Jabamiah" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminIndex,
});

function AdminIndex() {
  const { t } = useTranslation();
  const [authState, setAuthState] = useState<"loading" | "anon" | "auth">("loading");
  const [adminCheck, setAdminCheck] = useState<{ isAdmin: boolean; userId: string } | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthState(session ? "auth" : "anon");
    });
    supabase.auth.getSession().then(({ data }) => setAuthState(data.session ? "auth" : "anon"));
    return () => sub.subscription.unsubscribe();
  }, []);

  const check = useServerFn(checkIsAdmin);
  useEffect(() => {
    if (authState === "auth") {
      check().then(setAdminCheck).catch(() => setAdminCheck({ isAdmin: false, userId: "" }));
    } else {
      setAdminCheck(null);
    }
  }, [authState, check]);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthError(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(t("admin.signInError"));
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (authState === "loading") {
    return <div className="bg-cream py-24 text-center text-earth/70">…</div>;
  }

  if (authState === "anon") {
    return (
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-sm rounded-xl bg-card p-8 ring-1 ring-gold/20">
          <h1 className="font-serif text-3xl text-forest">{t("admin.title")}</h1>
          <p className="mt-2 text-sm text-earth/70">{t("admin.signIn")}</p>
          <form onSubmit={handleSignIn} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("admin.email")}</span>
              <input name="email" type="email" required className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("admin.password")}</span>
              <input name="password" type="password" required className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
            </label>
            {authError && <p className="text-sm text-red-700">{authError}</p>}
            <button type="submit" className="w-full rounded-md bg-forest px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft">
              {t("admin.signIn")}
            </button>
          </form>
        </div>
      </section>
    );
  }

  if (!adminCheck) {
    return <div className="bg-cream py-24 text-center text-earth/70">…</div>;
  }

  if (!adminCheck.isAdmin) {
    return (
      <section className="bg-cream py-24 text-center">
        <h1 className="font-serif text-3xl text-forest">{t("admin.notAdmin")}</h1>
        <p className="mt-2 text-sm text-earth/70">User ID: <code className="text-xs">{adminCheck.userId}</code></p>
        <button onClick={handleSignOut} className="mt-6 rounded-md border border-gold/40 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-forest">
          {t("admin.signOut")}
        </button>
      </section>
    );
  }

  return <AdminDashboard onSignOut={handleSignOut} />;
}

function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const list = useServerFn(adminListPosts);
  const del = useServerFn(adminDeletePost);
  const listMessages = useServerFn(adminListContactMessages);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => list(),
  });

  const { data: messages } = useQuery({
    queryKey: ["admin-contact-messages"],
    queryFn: () => listMessages(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-posts"] }),
  });

  return (
    <section className="bg-cream py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between border-b border-gold/20 pb-6">
          <div>
            <h1 className="font-serif text-3xl text-forest">{t("admin.title")}</h1>
          </div>
          <button onClick={onSignOut} className="text-xs uppercase tracking-[0.18em] text-earth/70 hover:text-forest">
            {t("admin.signOut")}
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-forest">{t("admin.postsTitle")}</h2>
          <Link
            to="/admin/posts/$id"
            params={{ id: "new" }}
            className="rounded-md bg-forest px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft"
          >
            + {t("admin.newPost")}
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl bg-card ring-1 ring-gold/20">
          {isLoading ? (
            <div className="p-8 text-center text-earth/70">…</div>
          ) : !posts || posts.length === 0 ? (
            <div className="p-8 text-center text-earth/70">{t("admin.noPosts")}</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-cream-warm text-left text-xs uppercase tracking-[0.15em] text-forest">
                <tr>
                  <th className="px-4 py-3">{t("admin.postTitle")}</th>
                  <th className="px-4 py-3">{t("admin.slug")}</th>
                  <th className="px-4 py-3">{t("admin.status")}</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {posts.map((p) => {
                  const fr = (p.post_translations as Array<{ title: string; locale: string }> | null)?.find((x) => x.locale === "fr");
                  return (
                    <tr key={p.id}>
                      <td className="px-4 py-3 text-forest">{fr?.title ?? p.slug}</td>
                      <td className="px-4 py-3 font-mono text-xs text-earth/70">{p.slug}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${p.status === "published" ? "bg-forest text-cream" : "bg-cream-warm text-earth"}`}>
                          {t(`admin.${p.status}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link to="/admin/posts/$id" params={{ id: p.id }} className="text-xs uppercase tracking-[0.15em] text-gold hover:text-forest">
                          {t("admin.editPost")}
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(t("admin.deleteConfirm"))) deleteMutation.mutate(p.id);
                          }}
                          className="ml-4 text-xs uppercase tracking-[0.15em] text-red-700 hover:text-red-900"
                        >
                          {t("admin.delete")}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <h2 className="mt-12 font-serif text-2xl text-forest">{t("admin.contactMessages")}</h2>
        <div className="mt-4 overflow-hidden rounded-xl bg-card ring-1 ring-gold/20">
          {!messages || messages.length === 0 ? (
            <div className="p-8 text-center text-earth/70">{t("admin.noMessages")}</div>
          ) : (
            <ul className="divide-y divide-gold/10">
              {messages.map((m) => (
                <li key={m.id} className="p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <p className="font-medium text-forest">{m.name} — <a href={`mailto:${m.email}`} className="text-gold hover:underline">{m.email}</a></p>
                      {m.subject && <p className="text-xs text-earth/70">{m.subject}</p>}
                    </div>
                    <time className="text-xs text-earth/60">{new Date(m.created_at).toLocaleString()}</time>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-earth/80">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <SettingsSection />

        <p className="mt-12 text-xs text-earth/50">{SUPPORTED_LANGUAGES.length} langues prises en charge</p>
      </div>
    </section>
  );
}

function SettingsSection() {
  const { t } = useTranslation();
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

  const isConfigured = Boolean(settings?.paypal_client_id);

  return (
    <div className="mt-12">
      <h2 className="font-serif text-2xl text-forest">{t("admin.settingsTitle")}</h2>
      <div className="mt-4 rounded-xl bg-card p-6 ring-1 ring-gold/20">
        <div className="space-y-5">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("admin.paypalClientId")}</span>
            <p className="mt-0.5 text-xs text-earth/60">{t("admin.paypalClientIdHint")}</p>
            <input
              type="text"
              value={paypalClientId}
              onChange={(e) => setPaypalClientId(e.target.value)}
              placeholder="AZDxx… ou SB-xxx…"
              className="mt-2 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 font-mono text-sm text-forest focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("admin.donationAmounts")}</span>
            <p className="mt-0.5 text-xs text-earth/60">{t("admin.donationAmountsHint")}</p>
            <input
              type="text"
              value={donationAmounts}
              onChange={(e) => setDonationAmounts(e.target.value)}
              placeholder="5,10,20,50"
              className="mt-2 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </label>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="rounded-md bg-forest px-6 py-2.5 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft disabled:opacity-60"
          >
            {saveStatus === "saving" ? t("admin.saving") : t("admin.save")}
          </button>
          {saveStatus === "saved" && <p className="text-xs text-forest">{t("admin.settingsSaved")}</p>}
          {saveStatus === "error" && <p className="text-xs text-red-700">{t("admin.settingsSaveError")}</p>}
        </div>

        <div className="mt-5">
          {isConfigured ? (
            <p className="rounded-md bg-forest/10 px-4 py-3 text-xs text-forest">
              ✓ PayPal configuré — la page /don affiche le bouton de paiement.
            </p>
          ) : (
            <p className="rounded-md bg-cream-warm px-4 py-3 text-xs text-earth/70">
              ⚠ Aucun PayPal Client ID — la page /don affiche un placeholder « bientôt disponible ».
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
