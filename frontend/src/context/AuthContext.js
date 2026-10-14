import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../services/http";

const TOKEN_KEY = "leaflens_token";
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const acceptSession = useCallback((session) => {
    localStorage.setItem(TOKEN_KEY, session.token);
    setToken(session.token);
    setUser(session.user);
    return session.user;
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await apiClient.post("/auth/login", { email, password });
    return acceptSession(data);
  }, [acceptSession]);

  const register = useCallback(async (name, email, password) => {
    const { data } = await apiClient.post("/auth/register", { name, email, password });
    return acceptSession(data);
  }, [acceptSession]);

  useEffect(() => {
    let active = true;
    const handleUnauthorized = () => logout();
    window.addEventListener("leaflens:unauthorized", handleUnauthorized);
    if (token) {
      apiClient.get("/auth/me")
        .then(({ data }) => { if (active) setUser(data.user); })
        .catch(() => { if (active) logout(); })
        .finally(() => { if (active) setLoading(false); });
    } else {
      setLoading(false);
    }
    return () => {
      active = false;
      window.removeEventListener("leaflens:unauthorized", handleUnauthorized);
    };
  }, [token, logout]);

  const value = useMemo(() => ({ token, user, loading, isAuthenticated: Boolean(token && user), login, register, logout }), [token, user, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
