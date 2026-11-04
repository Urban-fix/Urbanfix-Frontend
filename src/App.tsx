import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ReporteList } from './pages/ReporteList';
import { ReporteDetail } from './pages/ReporteDetail';
import { ReporteCreate } from './pages/ReporteCreate';
import { ReporteEdit } from './pages/ReporteEdit';
import { Profile } from './pages/Profile';
import { AdminPanel } from './pages/AdminPanel';

// Components
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
  if (!user?.rol.includes('ADMIN')) return <Navigate to="/dashboard" />;
  
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
              <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
              <Route path="/reportes" element={<Layout><ReporteList /></Layout>} />
              <Route path="/reportes/:id" element={<Layout><ReporteDetail /></Layout>} />
              <Route path="/reportes/crear" element={<PrivateRoute><Layout><ReporteCreate /></Layout></PrivateRoute>} />
              <Route path="/reportes/:id/editar" element={<PrivateRoute><Layout><ReporteEdit /></Layout></PrivateRoute>} />
              <Route path="/perfil" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
              <Route path="/admin" element={<AdminRoute><Layout><AdminPanel /></Layout></AdminRoute>} />
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
