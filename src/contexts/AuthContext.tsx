'use client';

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import type { Admin } from '@/types/admin'; 
import { AxiosError } from 'axios';

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  admin: Admin | null;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>; // Mudado para async
  loading: boolean; 
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    api.get('/admins/profile') 
      .then(response => {
        setAdmin(response.data);
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 401) {
          console.log("Admin não está logado.");
        }
        setAdmin(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); 

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('/admins/login', { email, password });

      const { admin: adminData } = response.data;
      
      setAdmin(adminData);
      router.push('/admin/dashboard');
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function signOut() {
    try {
      await api.post('/admins/logout'); 
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setAdmin(null);
      router.push('/admins/login');
    }
  }

  const isAuthenticated = !!admin;

  return (
    <AuthContext.Provider value={{ isAuthenticated, admin, signIn, signOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};