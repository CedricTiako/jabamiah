import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState, createContext, useContext } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "../integrations/supabase/client";
import { checkIsAdmin } from "../lib/posts.functions";

type AdminCtx = { userId: string; signOut: () => Promise<void> };
const AdminContext = createContext<AdminCtx | null>(null);
export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin outside AdminContext");
  return ctx;
}

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Jabamiah" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const [authState, setAuthState] = useState<"loading" | "anon" | "auth">("loading");
  const [adminCheck, setAdminCheck] = useState<{ isAdmin: boolean; userId: string } | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const check = useServerFn(checkIsAdmin);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthState(session ? "auth" : "anon");
    });
    supabase.auth.getSession().then(({ data }) => setAuthState(data.session ? "auth" : "anon"));
    return () => sub.subscription.unsubscribe();
  }, []);

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
    if (error) setAuthError("Identifiants incorrects.");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (authState === "loading" || (authState === "auth" && !adminCheck)) {
    return <div className="grid min-h-screen place-items-center bg-cream text-earth/70">Chargement…</div>;
  }

  if (authState === "anon") {
    return (
      <section className="grid min-h-screen place-items-center bg-cream px-4 py-12">
        <div className="w-full max-w-sm rounded-xl bg-card p-8 ring-1 ring-gold/20">
          <h1 className="font-serif text-3xl text-forest">Jabamiah Admin</h1>
          <p className="mt-2 text-sm text-earth/70">Connectez-vous pour accéder au tableau de bord.</p>
          <form onSubmit={handleSignIn} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Email</span>
              <input name="email" type="email" required autoComplete="email" className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Mot de passe</span>
              <input name="password" type="password" required autoComplete="current-password" className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
            </label>
            {authError && <p className="text-sm text-red-700">{authError}</p>}
            <button type="submit" className="w-full rounded-md bg-forest px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft">
              Se connecter
            </button>
          </form>
        </div>
      </section>
    );
  }

  if (!adminCheck?.isAdmin) {
    return (
      <section className="grid min-h-screen place-items-center bg-cream px-4 text-center">
        <div>
          <h1 className="font-serif text-3xl text-forest">Accès refusé</h1>
          <p className="mt-2 text-sm text-earth/70">
            Votre compte n'a pas les droits administrateur.
          </p>
          <p className="mt-2 text-xs text-earth/60">User ID : <code>{adminCheck?.userId}</code></p>
          <button onClick={handleSignOut} className="mt-6 rounded-md border border-gold/40 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-forest">
            Se déconnecter
          </button>
        </div>
      </section>
    );
  }

  return (
    <AdminContext.Provider value={{ userId: adminCheck.userId, signOut: handleSignOut }}>
      <Outlet />
    </AdminContext.Provider>
  );
}
