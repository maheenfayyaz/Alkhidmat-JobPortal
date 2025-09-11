"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  email: string;
  name: string;  // Make name required to avoid missing name
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          // Ensure name is set, fallback to email prefix if missing
          const name = userData.name || userData.email.split('@')[0];
          setUser({
            ...userData,
            name,
            isAuthenticated: true,
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || "Login failed" };
      }

      const data = await response.json();
      const userData = {
        email: data.user.email,
        name: data.user.name,
        isAuthenticated: true,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: (error as Error).message };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.clear();
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user?.isAuthenticated,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
