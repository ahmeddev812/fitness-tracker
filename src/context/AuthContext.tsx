"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  type AuthUser,
  loginUser,
  signupUser,
  logoutUser,
  getCurrentUser,
} from "@/lib/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; message: string };
  signup: (name: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    setUser(getCurrentUser());
    setHydrated(true);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const result = loginUser(email, password);
    if (result.success) {
      setUser(getCurrentUser());
    }
    return result;
  }, []);

  const signup = useCallback((name: string, email: string, password: string) => {
    const result = signupUser(name, email, password);
    if (result.success) {
      setUser(getCurrentUser());
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading: !hydrated,
      isAuthenticated: hydrated ? user !== null : false,
      login,
      signup,
      logout,
    }),
    [user, hydrated, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
