import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { API_BASE } from "../lib/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("ff_token") || ""
  );
  const [user, setUser] = useState(null);
  const isAuthed = !!token;

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setUser(data.user))
      .catch(() => {
        setUser(null);
      });
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthed,
      login: ({ token, user }) => {
        setToken(token);
        localStorage.setItem("ff_token", token);
        setUser(user);
      },
      logout: () => {
        setToken("");
        localStorage.removeItem("ff_token");
        setUser(null);
      },
    }),
    [token, user, isAuthed]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
