import { createContext, useContext, useEffect, useState } from "react";
import {
  signIn as apiSignIn,
  signUp as apiSignUp,
  signOut as apiSignOut,
  refreshSession,
} from "../api/auth";

const AuthContext = createContext(null);
const STORAGE_KEY = "leafy_session";

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persist(session) {
  if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else localStorage.removeItem(STORAGE_KEY);
}

function toSession(res) {
  return {
    access_token: res.access_token,
    refresh_token: res.refresh_token,
    expires_in: res.expires_in,
    obtained_at: Date.now(),
    user: res.user,
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = readStored();
    if (!stored) {
      setLoading(false);
      return;
    }

    const expiresAt = stored.obtained_at + stored.expires_in * 1000;
    const needsRefresh = Date.now() > expiresAt - 60_000;

    if (!needsRefresh) {
      setSession(stored);
      setLoading(false);
      return;
    }

    refreshSession(stored.refresh_token)
      .then((fresh) => {
        const next = toSession(fresh);
        persist(next);
        setSession(next);
      })
      .catch(() => {
        persist(null);
        setSession(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = {
    user: session?.user ?? null,
    accessToken: session?.access_token ?? null,
    loading,

    async signIn(email, password) {
      const res = await apiSignIn(email, password);
      const next = toSession(res);
      persist(next);
      setSession(next);
    },

    async signUp(email, password) {
      const res = await apiSignUp(email, password);
      if (!res.access_token) return { needsConfirmation: true };
      const next = toSession(res);
      persist(next);
      setSession(next);
      return { needsConfirmation: false };
    },

    async signOut() {
      if (session?.access_token) {
        try {
          await apiSignOut(session.access_token);
        } catch {
          // Server-side logout failures shouldn't block clearing local state
        }
      }
      persist(null);
      setSession(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}