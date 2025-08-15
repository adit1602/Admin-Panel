// src/context/AuthProvider.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "../services/authService";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (formData: any) => Promise<any>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem("authToken");
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedToken && storedName && storedEmail) {
      setToken(storedToken);
      setUser({ name: storedName, email: storedEmail });
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });

      // Check if login successful
      if (!response.iserror && !response.err_code) {
        // Store token and user info
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userName", response.data.name);
        localStorage.setItem("userEmail", response.data.email);

        // Update state
        setToken(response.data.token);
        setUser({
          name: response.data.name,
          email: response.data.email,
        });
        setIsAuthenticated(true);

        return { success: true, data: response.data };
      } else {
        // Handle login errors
        const errorMessage =
          response.err_message ||
          response.err_message_en ||
          response.message ||
          "Login failed. Please check your credentials.";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = "Network error. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(formData);

      // Check if registration successful
      if (!response.iserror && !response.err_code) {
        return { success: true, data: response.data };
      } else {
        // Handle registration errors
        const errorMessage =
          response.err_message ||
          response.err_message_en ||
          response.message ||
          "Registration failed. Please check your information.";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = "Network error. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    // Reset state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
