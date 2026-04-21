import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';
import { apiFetch } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'user';
  avatar?: string;
  status: string;
  accountType?: string;
  plan?: string;
  duration?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  updateUserContext: (user: User) => void;
  is2FAVerified: boolean;
  verify2FA: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [is2FAVerified, setIs2FAVerified] = useState<boolean>(
    sessionStorage.getItem('is2FAVerified') === 'true'
  );

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Our backend uses apiFetch which automatically supplies the Firebase ID token.
          // The backend /api/auth/me endpoint auto-syncs the user to the database if not present.
          const res = await apiFetch('/api/auth/me');
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            throw new Error("Unable to sync identity with backend");
          }
        } catch (error: any) {
          console.warn("Backend Sync Failed - using fallback user session", error);
          const isOwner = firebaseUser.email?.toLowerCase() === 'muslimani181@gmail.com';
          const fallbackUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            role: isOwner ? 'owner' : 'user', 
            status: 'active',
            avatar: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
            accountType: 'Freelancer',
            plan: 'None',
            duration: 'Trial',
            workspace_id: localStorage.getItem('active_workspace_id') || 'ws-bizos-001'
          } as any;
          setUser(fallbackUser);
        }
      } else {
        setUser(null);
        setIs2FAVerified(false);
        sessionStorage.removeItem('is2FAVerified');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (auth) {
      await signOut(auth);
      setUser(null);
      setIs2FAVerified(false);
      sessionStorage.removeItem('is2FAVerified');
      localStorage.removeItem('active_workspace_id');
    }
  };

  const updateUserContext = (newUser: User) => {
    setUser(newUser);
  }

  const verify2FA = () => {
    setIs2FAVerified(true);
    sessionStorage.setItem('is2FAVerified', 'true');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, updateUserContext, is2FAVerified, verify2FA }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
