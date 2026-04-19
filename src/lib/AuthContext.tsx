import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

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
          if (db) {
            // Fetch detailed user document from Firestore
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
              setUser(userDocSnap.data() as User);
            } else {
              // Fallback during registration transition or Google/Apple Login
              const isOwner = firebaseUser.email?.toLowerCase() === 'muslimani181@gmail.com';
              const defaultUser: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                role: isOwner ? 'admin' : 'user', 
                status: isOwner ? 'active' : 'trial', // Owner gets 'active', normal users get 'trial'
                avatar: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
                accountType: 'Freelancer', // Best default guess for social logic
                plan: 'None',
                duration: 'Trial'
              };
              await setDoc(userDocRef, defaultUser);
              setUser(defaultUser);
            }
          }
        } catch (error: any) {
          console.error("Error fetching user data from Firestore", error);
          
          if (error.message?.includes("client is offline") || error.code === 'unavailable') {
            const isOwner = firebaseUser.email?.toLowerCase() === 'muslimani181@gmail.com';
            // Set temporary session if Firestore fails
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              role: isOwner ? 'admin' : 'user', 
              status: isOwner ? 'active' : 'trial',
              avatar: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
              accountType: 'Freelancer',
              plan: 'None',
              duration: 'Trial'
            });
          }
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
