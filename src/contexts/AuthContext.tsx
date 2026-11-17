import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/axios';
import type { UsuarioResponseDTO, RegisterRequestDTO, AuthResponseDTO } from '../types/auth.types';

interface AuthContextType {
  user: UsuarioResponseDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UsuarioResponseDTO>;
  register: (data: RegisterRequestDTO) => Promise<UsuarioResponseDTO>;
  googleLogin: (idToken: string) => Promise<UsuarioResponseDTO>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UsuarioResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get<UsuarioResponseDTO>('/api/v1/auth/me');
        setUser(response.data);
      } catch (error) {
        // User is not authenticated, that's fine
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<UsuarioResponseDTO> => {
    const response = await api.post<AuthResponseDTO>('/api/v1/auth/login', { email, password });
    const { usuario } = response.data;
    setUser(usuario);
    setIsLoading(false);
    return usuario;
  };

  const register = async (data: RegisterRequestDTO): Promise<UsuarioResponseDTO> => {
    const response = await api.post<AuthResponseDTO>('/api/v1/auth/register', data);
    const { usuario } = response.data;
    setUser(usuario);
    setIsLoading(false);
    
    return usuario;
  };

  const googleLogin = async (idToken: string): Promise<UsuarioResponseDTO> => {
    const response = await api.post<AuthResponseDTO>('/api/v1/auth/google', { idToken });
    const { usuario } = response.data;
    setUser(usuario);
    setIsLoading(false);
    return usuario;
  };

  const logout = async () => {
    try {
      await api.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
