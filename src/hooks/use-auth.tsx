"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { AdminUser } from "@/data/types";
import { apiJson } from "@/lib/http/client";
import {
  DEMO_SUPER_ADMIN_EMAIL,
  DEMO_SUPER_ADMIN_PASSWORD,
} from "@/lib/demo/account";

interface AuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  demoLogin: () => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isDemo: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiJson<AdminUser>("/api/auth/session")
      .then((sessionUser) => {
        setUser(sessionUser);
        localStorage.setItem("yumm_admin_user", JSON.stringify(sessionUser));
      })
      .catch(() => {
        const stored = localStorage.getItem("yumm_admin_user");
        if (stored) {
          try {
            setUser(JSON.parse(stored) as AdminUser);
          } catch {
            localStorage.removeItem("yumm_admin_user");
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const sessionUser = await apiJson<AdminUser>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        setUser(sessionUser);
        localStorage.setItem("yumm_admin_user", JSON.stringify(sessionUser));
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  const demoLogin = useCallback(async (): Promise<boolean> => {
    try {
      const sessionUser = await apiJson<AdminUser>("/api/auth/demo-login", {
        method: "POST",
        body: JSON.stringify({
          email: DEMO_SUPER_ADMIN_EMAIL,
          password: DEMO_SUPER_ADMIN_PASSWORD,
        }),
      });
      setUser(sessionUser);
      localStorage.setItem("yumm_admin_user", JSON.stringify(sessionUser));
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetPassword = (email: string, _newPassword: string): boolean => {
    return email.includes("@");
  };

  const logout = useCallback(async () => {
    try {
      await apiJson("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    setUser(null);
    localStorage.removeItem("yumm_admin_user");
  }, []);

  const isAuthenticated = !!user;
  const isDemo = user?.isDemo === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        demoLogin,
        resetPassword,
        logout,
        isAuthenticated,
        isDemo,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
