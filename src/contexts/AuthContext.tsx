import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/axios';
import type { AuthResponseDTO, UsuarioResponseDTO, RegisterRequestDTO } from '../types/auth.types';

interface AuthContextType {
  user: UsuarioResponseDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequestDTO) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UsuarioResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      refreshToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponseDTO>('/auth/login', { email, password });
    const { accessToken, refreshToken, usuario } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(usuario);
  };

  const register = async (data: RegisterRequestDTO) => {
    const response = await api.post<AuthResponseDTO>('/auth/register', data);
    const { accessToken, refreshToken, usuario } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(usuario);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('refreshToken');
      const response = await api.post<AuthResponseDTO>('/auth/refresh', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { accessToken, refreshToken: newRefreshToken, usuario } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      setUser(usuario);
    } catch (error) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
