"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  lastLoginAt: string | null;
  role: { id: string; name: string } | null;
  permissions: string[];
};

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  hasPermission: (permission: string) => boolean;
  refreshUser: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

let refreshPromise: Promise<boolean> | null = null;

async function refreshSession() {
  refreshPromise ??= fetch("/api/auth/refresh", { method: "POST", credentials: "include" })
    .then((response) => response.ok)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

export async function apiFetch<T>(path: string, init?: RequestInit, allowRefresh = true): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;
  const response = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  const isAuthAttempt = path === "/api/auth/login" || path === "/api/auth/refresh" || path === "/api/auth/logout";
  if (response.status === 401 && allowRefresh && !isAuthAttempt) {
    const refreshed = await refreshSession();
    if (refreshed) return apiFetch<T>(path, init, false);
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  }

  const payload = (await response.json().catch(() => null)) as { message?: string } | null;
  if (!response.ok) {
    throw new Error(payload?.message ?? "Permintaan gagal");
  }

  return payload as T;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      const result = await apiFetch<{ data: AuthUser }>("/api/auth/me");
      setUser(result.data);
    } catch {
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/auth/me", { credentials: "include", signal: controller.signal })
      .then(async (response) => {
        if (response.status === 401) {
          const refreshed = await refreshSession();
          if (!refreshed) {
            setUser(null);
            setReady(true);
            return;
          }
          const retry = await fetch("/api/auth/me", { credentials: "include", signal: controller.signal });
          if (!retry.ok) {
            setUser(null);
            setReady(true);
            return;
          }
          const retried = (await retry.json()) as { data: AuthUser };
          setUser(retried.data);
          setReady(true);
          return;
        }

        if (!response.ok) {
          setUser(null);
          setReady(true);
          return;
        }

        const result = (await response.json()) as { data: AuthUser };
        setUser(result.data);
        setReady(true);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setUser(null);
        setReady(true);
      });

    return () => controller.abort();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      hasPermission: (permission) => user?.permissions.includes(permission) ?? false,
      refreshUser,
      setUser,
    }),
    [user, ready, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return context;
}
