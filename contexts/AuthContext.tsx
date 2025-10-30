"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { pb, onAuthChange, getCurrentUser, isAuthenticated, signOut } from "@/lib/pocketbase";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

// Helper function to convert PocketBase AuthModel to User type
function convertToUser(authModel: any): User {
  return {
    id: authModel.id || "",
    email: authModel.email || "",
    name: authModel.name || authModel.username || "",
    avatar: authModel.avatar || "",
    created: authModel.created || new Date().toISOString(),
    updated: authModel.updated || new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser && !isAuthenticated()) {
      signOut();
      setUser(null);
    } else {
      setUser(currentUser ? convertToUser(currentUser) : null);
    }
    setIsLoading(false);

    const unsubscribe = onAuthChange((model) => {
      setUser(model ? convertToUser(model) : null);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
