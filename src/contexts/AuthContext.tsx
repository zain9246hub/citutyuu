import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'explorer' | 'business' | 'super-admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  city?: string;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, role: UserRole, city?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

async function fetchUserRole(userId: string): Promise<UserRole> {
  const { data, error } = await supabase.rpc('get_user_role', { _user_id: userId });
  if (error || !data) return 'explorer';
  return data as UserRole;
}

async function buildUser(supabaseUser: SupabaseUser): Promise<User> {
  const role = await fetchUserRole(supabaseUser.id);
  return {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
    email: supabaseUser.email || '',
    role,
    city: supabaseUser.user_metadata?.city,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Use setTimeout to avoid potential deadlock with Supabase client
        setTimeout(async () => {
          const user = await buildUser(session.user);
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          setIsLoading(false);
        }, 0);
      } else {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
        setIsLoading(false);
      }
    });

    // THEN check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const user = await buildUser(session.user);
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setIsLoading(false);
      throw new Error(error.message);
    }
    // User will be set via onAuthStateChange
  };

  const signUp = async (name: string, email: string, password: string, role: UserRole, city?: string) => {
    setIsLoading(true);
    // Never allow self-assigning super-admin via signup
    const safeRole: UserRole = role === 'business' ? 'business' : 'explorer';
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, city, role: safeRole },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      setIsLoading(false);
      throw new Error(error.message);
    }
    // User will be set via onAuthStateChange; role assigned by DB trigger from metadata
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
