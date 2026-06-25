import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import {
  login as loginRequest,
  signup as signupRequest,
} from "../api/authService";

const AuthContext = createContext(null);

function normalizeUser(rawUser, decoded = null) {
  const user = rawUser || {};
  return {
    id: user.id || decoded?.userId || null,
    name: user.name || user.full_name || "",
    email: user.email || "",
    role: user.role || decoded?.role || null,
    companyId: user.companyId || user.company_id || decoded?.companyId || null,
    companyCurrency: user.companyCurrency || user.company_currency || null,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("auth_user");

    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(savedToken);
      const maybeUser = savedUser ? JSON.parse(savedUser) : null;
      const hydrated = normalizeUser(maybeUser, decoded);
      setToken(savedToken);
      setUser(hydrated);
      localStorage.setItem("auth_user", JSON.stringify(hydrated));
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("auth_user");
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistAuth = useCallback((nextToken, rawUser) => {
    const decoded = jwtDecode(nextToken);
    const normalized = normalizeUser(rawUser, decoded);
    setToken(nextToken);
    setUser(normalized);
    localStorage.setItem("token", nextToken);
    localStorage.setItem("auth_user", JSON.stringify(normalized));
    return normalized;
  }, []);

  const login = useCallback(
    async (email, password) => {
      setIsLoading(true);
      try {
        const response = await loginRequest({ email, password });
        return persistAuth(response.token, response.user);
      } finally {
        setIsLoading(false);
      }
    },
    [persistAuth],
  );

  const signup = useCallback(
    async (payload) => {
      setIsLoading(true);
      try {
        const response = await signupRequest(payload);
        return persistAuth(response.token, response.user);
      } finally {
        setIsLoading(false);
      }
    },
    [persistAuth],
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    window.location.href = "/login";
  }, []);

  const switchRole = useCallback((role) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, role: String(role).toLowerCase() };
      localStorage.setItem("auth_user", JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      signup,
      logout,
      switchRole,
    }),
    [user, token, isLoading, login, signup, logout, switchRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthContext() {
  return useAuth();
}
