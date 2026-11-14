import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/endpoints';
import { setOnSessionExpired } from '../api/client';
import { tokenStorage } from '../api/tokenStorage';
import type { AuthResponseDTO, RegisterRequestDTO, UsuarioResponseDTO } from '../types/auth.types';

interface AuthContextType {
  user: UsuarioResponseDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UsuarioResponseDTO>;
  register: (data: RegisterRequestDTO) => Promise<UsuarioResponseDTO>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UsuarioResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setOnSessionExpired(() => setUser(null));
    (async () => {
      try {
        if (await tokenStorage.getAccess()) {
          const { data } = await authApi.me();
          setUser(data);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleAuth = useCallback(async (data: AuthResponseDTO) => {
    await tokenStorage.save(data.accessToken, data.refreshToken);
    setUser(data.usuario);
    return data.usuario;
  }, []);

  const login = useCallback(
    async (email: string, password: string) => handleAuth((await authApi.login(email, password)).data),
    [handleAuth],
  );

  const register = useCallback(
    async (payload: RegisterRequestDTO) => handleAuth((await authApi.register(payload)).data),
    [handleAuth],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // aunque falle en el servidor, cerramos la sesión local
    } finally {
      await tokenStorage.clear();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
