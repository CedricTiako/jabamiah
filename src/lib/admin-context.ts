import { createContext, useContext } from "react";

type AdminCtx = { userId: string; signOut: () => Promise<void> };

export const AdminContext = createContext<AdminCtx | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin outside AdminContext");
  return ctx;
}
