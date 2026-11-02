'use client';

import React, { createContext, useContext } from 'react';
import { authClient } from '@/lib/auth-client';
import { User } from '@/types';
import { toast } from 'sonner';

type AuthSession = typeof authClient.$Infer.Session.session;

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending, refetch } = authClient.useSession();
  const authUser = data?.user;
  const user: User | null = authUser
    ? {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        image: authUser.image ?? undefined,
      }
    : null;

  const loginWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/events`,
      });
    } catch (error: unknown) {
      toast.error('Google Sign-In failed', {
        description:
          error instanceof Error ? error.message : 'Please try again later',
      });
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
      toast.success('Logged out successfully', {
        description: 'See you next time on HopeHarbor!',
      });
      window.location.href = '/';
    } catch (error: unknown) {
      toast.error('Logout error', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  const refreshUser = async () => {
    await refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session: data?.session ?? null,
        isLoading: isPending,
        logout,
        loginWithGoogle,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
