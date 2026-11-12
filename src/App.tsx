import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PasswordResetRequest } from './pages/PasswordResetRequest';
import { PasswordResetConfirm } from './pages/PasswordResetConfirm';
import { Dashboard } from './pages/Dashboard';
import { ReporteList } from './pages/ReporteList';
import { ReporteDetail } from './pages/ReporteDetail';
import { ReporteCreate } from './pages/ReporteCreate';
import { ReporteEdit } from './pages/ReporteEdit';
import { Perfil } from './pages/Perfil';
import { MisReportes } from './pages/MisReportes';
import { AdminPanel } from './pages/AdminPanel';
import { Mapa } from './pages/Mapa';

import { Layout } from './components/layout/Layout';
import { Spinner } from './components/ui/Spinner';

import './api/interceptors';

const queryClient = new QueryClient();

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.rol !== 'ADMIN_MUNICIPAL') return <Navigate to="/dashboard" />;

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/password-reset/request" element={<PasswordResetRequest />} />
              <Route path="/password-reset/confirm" element={<PasswordResetConfirm />} />

              {/* Área autenticada: solo AppShell (sin Header/Footer públicos) */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/mis-reportes" element={<PrivateRoute><MisReportes /></PrivateRoute>} />
              <Route path="/informes" element={<PrivateRoute><ReporteList /></PrivateRoute>} />
              <Route path="/mapa" element={<PrivateRoute><Mapa /></PrivateRoute>} />
              <Route path="/reportes/:id" element={<PrivateRoute><ReporteDetail /></PrivateRoute>} />
              <Route path="/reportes/crear" element={<PrivateRoute><ReporteCreate /></PrivateRoute>} />
              <Route path="/informes/crear" element={<PrivateRoute><ReporteCreate /></PrivateRoute>} />
              <Route path="/reportes/:id/editar" element={<PrivateRoute><ReporteEdit /></PrivateRoute>} />
              <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Toaster position="top-right" />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
