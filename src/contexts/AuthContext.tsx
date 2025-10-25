'use client';

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { api } from '@/services/api';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { useRouter } from 'next/navigation';
import type { Admin } from '@/types/admin'; 

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  admin: Admin | null;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  loading: boolean; 
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const { 'easygas.token': token } = parseCookies();

    if (token) {
      api.get('/admins/profile') 
        .then(response => {
          setAdmin(response.data);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {

      setLoading(false);
    }
  }, []); 

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('/admins/login', { email, password });
      const { token, admin: adminData } = response.data;
      setCookie(undefined, 'easygas.token', token, { maxAge: 60 * 60 * 24 * 7, path: '/' });
      setAdmin(adminData);
      router.push('/admin/dashboard');
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  function signOut() {
    destroyCookie(undefined, 'easygas.token');
    delete api.defaults.headers['Authorization'];
    setAdmin(null);
    router.push('/admins/login');
  }

  const isAuthenticated = !!admin;

  return (
    <AuthContext.Provider value={{ isAuthenticated, admin, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};