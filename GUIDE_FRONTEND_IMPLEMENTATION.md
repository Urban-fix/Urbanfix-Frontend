# Guía de Implementación - Fase 2: Frontend (Web y Mobile)

## 📋 Resumen del Proyecto

**UrbanFix** es una plataforma para reportar problemas urbanos. Esta guía cubre la implementación del frontend web (React) y mobile (React Native) basada en el backend ya desarrollado en la Fase 1.

**Puntuación Fase 1:** 18/20 ✅

---

## Table of Contents

1. [Arquitectura General](#arquitectura-general)
2. [API REST del Backend](#api-rest-del-backend)
3. [Frontend Web - React](#frontend-web---react)
4. [Frontend Mobile - React Native](#frontend-mobile---react-native)
5. [Deployment](#deployment)
6. [Checklist de Evaluación](#checklist-de-evaluación)

---

## Arquitectura General

### Stack Tecnológico

- **Backend:** Spring Boot (Java) - Ya implementado
- **Frontend Web:** React + TypeScript + TailwindCSS + React Router
- **Frontend Mobile:** React Native + Expo + TypeScript
- **State Management:** Context API (Web) / Context API (Mobile)
- **HTTP Client:** Axios con interceptores
- **Deployment:** AWS/Vercel/Expo

### Estructura de Repositorios Sugerida

```
urbanfix/
├── Urbanfix-backend/          # Ya implementado
├── Urbanfix-web/              # Nuevo - React Web
└── Urbanfix-mobile/           # Nuevo - React Native
```

---

## API REST del Backend

### Base URL
```
http://localhost:8080/api/v1
```

### Endpoints Disponibles

#### 1. Autenticación (`/api/v1/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Registro de usuario | ❌ |
| POST | `/login` | Login de usuario | ❌ |
| POST | `/refresh` | Refresh token | ❌ |
| POST | `/password-reset/request` | Solicitar reset de password | ❌ |
| POST | `/password-reset/confirm` | Confirmar reset de password | ❌ |

**Request/Response DTOs:**

```typescript
// LoginRequestDTO
{
  email: string;
  password: string;
}

// RegisterRequestDTO
{
  nombre: string;
  email: string;
  password: string;
  rol: 'CIUDADANO' | 'ADMIN_MUNICIPAL' | 'TECNICO' | 'SUPERVISOR';
}

// AuthResponseDTO
{
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  usuario: UsuarioResponseDTO;
}
```

#### 2. Reportes (`/api/v1/reportes`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/reportes` | Listar reportes (con filtros) | ❌ |
| GET | `/reportes/{id}` | Obtener reporte por ID | ❌ |
| GET | `/reportes/{id}/detalle` | Obtener detalle completo | ❌ |
| GET | `/reportes/mis-reportes` | Mis reportes | ✅ |
| POST | `/reportes` | Crear reporte | ✅ |
| PUT | `/reportes/{id}` | Actualizar reporte | ✅ |
| DELETE | `/reportes/{id}` | Eliminar reporte | ✅ |
| PATCH | `/reportes/{id}/estado` | Cambiar estado | ✅ (Admin/Técnico) |

**Query Params (GET /reportes):**
- `estado`: REPORTADO, EN_PROCESO, RESUELTO, RECHAZADO
- `categoriaId`: Long
- `zonaId`: Long
- `usuarioId`: Long
- `search`: string (búsqueda por título/descripción)

**Request/Response DTOs:**

```typescript
// ReporteCreateDTO
{
  titulo: string;           // 5-200 caracteres
  descripcion: string;      // 10-2000 caracteres
  latitud: number;          // -90.0 a 90.0
  longitud: number;         // -180.0 a 180.0
  fotoUrl?: string;         // max 500 caracteres
  categoriaId: number;
  zonaId: number;
}

// ReporteUpdateDTO
{
  titulo?: string;
  descripcion?: string;
  latitud?: number;
  longitud?: number;
  fotoUrl?: string;
  categoriaId?: number;
  zonaId?: number;
}

// ReporteResponseDTO
{
  id: number;
  titulo: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  fotoUrl: string;
  fechaCreacion: string;
  estadoActual: EstadoReporte;
  usuario: UsuarioResponseDTO;
  categoria: CategoriaResponseDTO;
  zona: ZonaResponseDTO;
  confirmacionesCount: number;
}

// ReporteDetailDTO (incluye historial, comentarios, confirmaciones)
{
  ...ReporteResponseDTO,
  historialEstados: EstadoHistorialResponseDTO[];
  comentarios: ComentarioResponseDTO[];
  confirmaciones: UsuarioResponseDTO[];
}
```

#### 3. Categorías (`/api/v1/categorias`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/categorias` | Listar categorías | ❌ |
| GET | `/categorias/{id}` | Obtener categoría | ❌ |
| POST | `/categorias` | Crear categoría | ✅ (Admin/Supervisor) |
| PUT | `/categorias/{id}` | Actualizar categoría | ✅ (Admin/Supervisor) |
| DELETE | `/categorias/{id}` | Eliminar categoría | ✅ (Admin) |

#### 4. Zonas (`/api/v1/zonas`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/zonas` | Listar zonas | ❌ |
| GET | `/zonas/{id}` | Obtener zona | ❌ |
| POST | `/zonas` | Crear zona | ✅ (Admin/Supervisor) |
| PUT | `/zonas/{id}` | Actualizar zona | ✅ (Admin/Supervisor) |
| DELETE | `/zonas/{id}` | Eliminar zona | ✅ (Admin) |

#### 5. Comentarios (`/api/v1/reportes/{reporteId}/comentarios`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/comentarios` | Listar comentarios | ❌ |
| POST | `/comentarios` | Crear comentario | ✅ |
| DELETE | `/comentarios/{comentarioId}` | Eliminar comentario | ✅ |

#### 6. Confirmaciones (`/api/v1/reportes/{reporteId}/confirmaciones`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/confirmaciones` | Confirmar reporte | ✅ |
| DELETE | `/confirmaciones` | Eliminar confirmación | ✅ |
| GET | `/confirmaciones` | Usuarios que confirmaron | ❌ |
| GET | `/confirmaciones/conteo` | Conteo de confirmaciones | ❌ |
| GET | `/confirmaciones/verificar` | Verificar si usuario confirmó | ✅ |

---

## Frontend Web - React

### 1. Inicialización del Proyecto

```bash
# Crear proyecto React con TypeScript
npx create-react-app urbanfix-web --template typescript
cd urbanfix-web

# Instalar dependencias
npm install axios react-router-dom @types/react-router-dom
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-hook-form @hookform/resolvers zod
npm install react-hot-toast
npm install @tanstack/react-query
npm install lucide-react
npm install leaflet react-leaflet
npm install @types/leaflet
```

### 2. Estructura de Carpetas

```
src/
├── api/                    # Capa de API (axios)
│   ├── axios.ts           # Configuración centralizada de axios
│   ├── interceptors.ts    # Interceptors de auth y errores
│   ├── auth.ts            # Endpoints de auth
│   ├── reportes.ts        # Endpoints de reportes
│   ├── categorias.ts      # Endpoints de categorías
│   ├── zonas.ts           # Endpoints de zonas
│   └── comentarios.ts     # Endpoints de comentarios
├── components/             # Componentes reutilizables
│   ├── ui/                # Componentes UI base
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Spinner.tsx
│   │   └── Toast.tsx
│   ├── layout/            # Componentes de layout
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── common/            # Componentes comunes
│       ├── ReporteCard.tsx
│       ├── ReporteList.tsx
│       └── CommentItem.tsx
├── pages/                  # Páginas/vistas
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── ReporteList.tsx
│   ├── ReporteDetail.tsx
│   ├── ReporteCreate.tsx
│   ├── ReporteEdit.tsx
│   ├── Profile.tsx
│   └── AdminPanel.tsx
├── hooks/                  # Custom hooks
│   ├── useAuth.ts
│   ├── useReportes.ts
│   ├── useCategorias.ts
│   ├── useZonas.ts
│   └── useForm.ts
├── contexts/               # Context API
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── types/                  # Tipos TypeScript
│   ├── auth.types.ts
│   ├── reporte.types.ts
│   ├── categoria.types.ts
│   └── zona.types.ts
├── utils/                  # Utilidades
│   ├── validation.ts
│   ├── formatters.ts
│   └── constants.ts
├── App.tsx
└── index.tsx
```

### 3. Configuración de Axios con Interceptors

**`src/api/axios.ts`**

```typescript
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor para manejar errores y refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Error 401 - Token expirado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${baseURL}/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${refreshToken}` }
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falló, redirigir a login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 4. Contexto de Autenticación

**`src/contexts/AuthContext.tsx`**

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/axios';
import type { AuthResponseDTO, UsuarioResponseDTO } from '../types/auth.types';

interface AuthContextType {
  user: UsuarioResponseDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
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
      // Validar token y obtener usuario
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

  const register = async (data: RegisterData) => {
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
```

### 5. Custom Hooks para API

**`src/hooks/useReportes.ts`**

```typescript
import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import type { ReporteResponseDTO, ReporteCreateDTO, ReporteUpdateDTO } from '../types/reporte.types';

export const useReportes = (filters?: ReportFilters) => {
  const [reportes, setReportes] = useState<ReporteResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReportes();
  }, [filters]);

  const fetchReportes = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filters?.estado) params.append('estado', filters.estado);
      if (filters?.categoriaId) params.append('categoriaId', filters.categoriaId.toString());
      if (filters?.zonaId) params.append('zonaId', filters.zonaId.toString());
      if (filters?.search) params.append('search', filters.search);

      const response = await api.get<ReporteResponseDTO[]>(`/reportes?${params}`);
      setReportes(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar reportes');
    } finally {
      setIsLoading(false);
    }
  };

  const createReporte = async (data: ReporteCreateDTO) => {
    try {
      const response = await api.post<ReporteResponseDTO>('/reportes', data);
      setReportes([...reportes, response.data]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al crear reporte');
    }
  };

  const updateReporte = async (id: number, data: ReporteUpdateDTO) => {
    try {
      const response = await api.put<ReporteResponseDTO>(`/reportes/${id}`, data);
      setReportes(reportes.map(r => r.id === id ? response.data : r));
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al actualizar reporte');
    }
  };

  const deleteReporte = async (id: number) => {
    try {
      await api.delete(`/reportes/${id}`);
      setReportes(reportes.filter(r => r.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al eliminar reporte');
    }
  };

  return { reportes, isLoading, error, createReporte, updateReporte, deleteReporte, refetch: fetchReportes };
};
```

### 6. Routing con React Router

**`src/App.tsx`**

```typescript
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReporteList from './pages/ReporteList';
import ReporteDetail from './pages/ReporteDetail';
import ReporteCreate from './pages/ReporteCreate';
import ReporteEdit from './pages/ReporteEdit';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

// Components
import Layout from './components/layout/Layout';
import Spinner from './components/ui/Spinner';

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
  if (!user?.rol?.includes('ADMIN')) return <Navigate to="/dashboard" />;
  
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
```

### 7. Vistas Requeridas (Mínimo 4)

#### 7.1 Login (`src/pages/Login.tsx`)

```typescript
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
      toast.success('Login exitoso');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email es requerido' })}
              className="w-full p-2 border rounded"
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              {...register('password', { required: 'Contraseña es requerida' })}
              className="w-full p-2 border rounded"
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
```

#### 7.2 Dashboard (`src/pages/Dashboard.tsx`)

```typescript
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useReportes } from '../hooks/useReportes';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { reportes, isLoading } = useReportes({ usuarioId: user?.id });

  if (isLoading) return <div>Cargando...</div>;

  const stats = {
    total: reportes.length,
    reportados: reportes.filter(r => r.estadoActual === 'REPORTADO').length,
    enProceso: reportes.filter(r => r.estadoActual === 'EN_PROCESO').length,
    resueltos: reportes.filter(r => r.estadoActual === 'RESUELTO').length,
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500 text-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Total</h3>
          <p className="text-3xl">{stats.total}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Reportados</h3>
          <p className="text-3xl">{stats.reportados}</p>
        </div>
        <div className="bg-orange-500 text-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold">En Proceso</h3>
          <p className="text-3xl">{stats.enProceso}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Resueltos</h3>
          <p className="text-3xl">{stats.resueltos}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Mis Reportes</h2>
        <Link to="/reportes/crear" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Nuevo Reporte
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportes.map(reporte => (
          <div key={reporte.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">{reporte.titulo}</h3>
            <p className="text-gray-600 text-sm">{reporte.descripcion}</p>
            <span className={`inline-block px-2 py-1 rounded text-sm mt-2 ${
              reporte.estadoActual === 'RESUELTO' ? 'bg-green-100 text-green-800' :
              reporte.estadoActual === 'EN_PROCESO' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {reporte.estadoActual}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
```

#### 7.3 Lista de Reportes con Paginación (`src/pages/ReporteList.tsx`)

```typescript
import React, { useState } from 'react';
import { useReportes } from '../hooks/useReportes';
import { useCategorias } from '../hooks/useCategorias';
import { useZonas } from '../hooks/useZonas';
import { Link } from 'react-router-dom';

const ReporteList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [estado, setEstado] = useState<string>('');
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [zonaId, setZonaId] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const { reportes, isLoading } = useReportes({ estado, categoriaId, zonaId, search });
  const { categorias } = useCategorias();
  const { zonas } = useZonas();

  // Paginación client-side (backend no tiene paginación implementada)
  const paginatedReportes = reportes.slice(page * size, (page + 1) * size);
  const totalPages = Math.ceil(reportes.length / size);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Reportes</h1>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded"
          />
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Todos los estados</option>
            <option value="REPORTADO">Reportado</option>
            <option value="EN_PROCESO">En Proceso</option>
            <option value="RESUELTO">Resuelto</option>
            <option value="RECHAZADO">Rechazado</option>
          </select>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          <select
            value={zonaId}
            onChange={(e) => setZonaId(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Todas las zonas</option>
            {zonas.map(zona => (
              <option key={zona.id} value={zona.id}>{zona.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {paginatedReportes.map(reporte => (
              <Link key={reporte.id} to={`/reportes/${reporte.id}`} className="block">
                <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                  <h3 className="font-semibold">{reporte.titulo}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{reporte.descripcion}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      reporte.estadoActual === 'RESUELTO' ? 'bg-green-100 text-green-800' :
                      reporte.estadoActual === 'EN_PROCESO' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {reporte.estadoActual}
                    </span>
                    <span className="text-sm text-gray-500">👍 {reporte.confirmacionesCount}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Paginación */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Mostrando {page * size + 1}-{Math.min((page + 1) * size, reportes.length)} de {reportes.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`px-4 py-2 rounded ${page === i ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="p-2 border rounded"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default ReporteList;
```

#### 7.4 Crear Reporte (`src/pages/ReporteCreate.tsx`)

```typescript
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useReportes } from '../hooks/useReportes';
import { useCategorias } from '../hooks/useCategorias';
import { useZonas } from '../hooks/useZonas';
import toast from 'react-hot-toast';

const ReporteCreate: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { createReporte } = useReportes();
  const { categorias } = useCategorias();
  const { zonas } = useZonas();
  const navigate = useNavigate();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => toast.error('No se pudo obtener la ubicación')
      );
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await createReporte({
        ...data,
        latitud: location?.lat || data.latitud,
        longitud: location?.lng || data.longitud,
        categoriaId: Number(data.categoriaId),
        zonaId: Number(data.zonaId),
      });
      toast.success('Reporte creado exitosamente');
      navigate('/reportes');
    } catch (error: any) {
      toast.error(error.message || 'Error al crear reporte');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Reporte</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              {...register('titulo', { required: 'Título es requerido', minLength: { value: 5, message: 'Mínimo 5 caracteres' } })}
              className="w-full p-2 border rounded"
            />
            {errors.titulo && <span className="text-red-500 text-sm">{errors.titulo.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              {...register('descripcion', { required: 'Descripción es requerida', minLength: { value: 10, message: 'Mínimo 10 caracteres' } })}
              className="w-full p-2 border rounded h-32"
            />
            {errors.descripcion && <span className="text-red-500 text-sm">{errors.descripcion.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Latitud</label>
              <input
                type="number"
                step="any"
                {...register('latitud', { required: 'Latitud es requerida' })}
                value={location?.lat || ''}
                onChange={(e) => setLocation({ ...location, lat: Number(e.target.value) })}
                className="w-full p-2 border rounded"
              />
              {errors.latitud && <span className="text-red-500 text-sm">{errors.latitud.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Longitud</label>
              <input
                type="number"
                step="any"
                {...register('longitud', { required: 'Longitud es requerida' })}
                value={location?.lng || ''}
                onChange={(e) => setLocation({ ...location, lng: Number(e.target.value) })}
                className="w-full p-2 border rounded"
              />
              {errors.longitud && <span className="text-red-500 text-sm">{errors.longitud.message}</span>}
            </div>
          </div>

          <button
            type="button"
            onClick={getLocation}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            📍 Usar mi ubicación actual
          </button>

          <div>
            <label className="block text-sm font-medium mb-1">URL de Foto (opcional)</label>
            <input
              type="url"
              {...register('fotoUrl')}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <select
              {...register('categoriaId', { required: 'Categoría es requerida' })}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
            {errors.categoriaId && <span className="text-red-500 text-sm">{errors.categoriaId.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Zona</label>
            <select
              {...register('zonaId', { required: 'Zona es requerida' })}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccionar zona</option>
              {zonas.map(zona => (
                <option key={zona.id} value={zona.id}>{zona.nombre}</option>
              ))}
            </select>
            {errors.zonaId && <span className="text-red-500 text-sm">{errors.zonaId.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Creando...' : 'Crear Reporte'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReporteCreate;
```

### 8. Manejo de Errores y Loading

**Error Boundary (`src/components/ErrorBoundary.tsx`)**

```typescript
import React, { Component } from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Algo salió mal</h1>
            <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 9. Validaciones con React Hook Form + Zod

**`src/utils/validation.ts`**

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  nombre: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  rol: z.enum(['CIUDADANO', 'ADMIN_MUNICIPAL', 'TECNICO', 'SUPERVISOR']),
});

export const reporteCreateSchema = z.object({
  titulo: z.string().min(5, 'Mínimo 5 caracteres').max(200, 'Máximo 200 caracteres'),
  descripcion: z.string().min(10, 'Mínimo 10 caracteres').max(2000, 'Máximo 2000 caracteres'),
  latitud: z.number().min(-90).max(90),
  longitud: z.number().min(-180).max(180),
  fotoUrl: z.string().url().optional().or(z.literal('')),
  categoriaId: z.number(),
  zonaId: z.number(),
});
```

### 10. Componente de Selección de Ubicación con OpenStreetMap

**Importante:** Esta funcionalidad es 100% frontend. El backend ya recibe `latitud` y `longitud` en `ReporteCreateDTO`.

#### 10.1 Web - Leaflet + React Leaflet

**`src/components/LocationPicker.tsx`**

```typescript
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para iconos de Leaflet en React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
}

function LocationMarker({ onLocationSelect, initialPosition }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(initialPosition || null);

  const map = useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

const LocationPicker: React.FC<LocationPickerProps> = ({ 
  onLocationSelect, 
  initialPosition 
}) => {
  // Centro por defecto: Buenos Aires (cambiar según tu ciudad)
  const defaultCenter: [number, number] = [-34.6037, -58.3816];
  const center = initialPosition || defaultCenter;

  return (
    <div className="w-full">
      <p className="text-sm text-gray-600 mb-2">
        Haz clic en el mapa para seleccionar la ubicación del reporte
      </p>
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker 
          onLocationSelect={onLocationSelect} 
          initialPosition={initialPosition}
        />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
```

**Uso en `ReporteCreate.tsx`:**

```typescript
import LocationPicker from '../components/LocationPicker';

const ReporteCreate: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const onSubmit = async (data: any) => {
    await createReporte({
      ...data,
      latitud: selectedLocation?.lat || data.latitud,
      longitud: selectedLocation?.lng || data.longitud,
      // ... resto de campos
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ... otros campos ... */}
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Ubicación en el Mapa</label>
        <LocationPicker onLocationSelect={handleLocationSelect} />
      </div>

      {/* Opción alternativa: input manual */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Latitud (opcional si usas el mapa)</label>
          <input
            type="number"
            step="any"
            {...register('latitud')}
            value={selectedLocation?.lat || ''}
            onChange={(e) => setSelectedLocation({ ...selectedLocation, lat: Number(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Longitud (opcional si usas el mapa)</label>
          <input
            type="number"
            step="any"
            {...register('longitud')}
            value={selectedLocation?.lng || ''}
            onChange={(e) => setSelectedLocation({ ...selectedLocation, lng: Number(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </form>
  );
};
```

#### 10.2 Mobile - React Native Maps con OpenStreetMap

**Instalación:**

```bash
npm install react-native-maps
```

**Configuración en `app.json` o `app.config.js`:**

```javascript
export default {
  expo: {
    plugins: [
      [
        'react-native-maps',
        {
          googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, // Opcional si usas Google Maps
        },
      ],
    ],
  },
};
```

**`src/components/LocationPicker.tsx` (Mobile):**

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition?: { latitude: number; longitude: number };
}

const LocationPicker: React.FC<LocationPickerProps> = ({ 
  onLocationSelect, 
  initialPosition 
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(initialPosition || null);

  // Centro por defecto: Buenos Aires
  const initialRegion: Region = {
    latitude: initialPosition?.latitude || -34.6037,
    longitude: initialPosition?.longitude || -58.3816,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    onLocationSelect(latitude, longitude);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Toca en el mapa para seleccionar la ubicación
      </Text>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onPress={handleMapPress}
        provider={MapView.PROVIDER_DEFAULT} // Usa Google Maps por defecto en Android
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Ubicación seleccionada"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
});

export default LocationPicker;
```

**Versión con OpenStreetMap (sin Google Maps):**

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';

const LocationPickerOSM: React.FC<LocationPickerProps> = ({ 
  onLocationSelect, 
  initialPosition 
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(initialPosition || null);

  const initialRegion: Region = {
    latitude: initialPosition?.latitude || -34.6037,
    longitude: initialPosition?.longitude || -58.3816,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    onLocationSelect(latitude, longitude);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Toca en el mapa para seleccionar la ubicación
      </Text>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onPress={handleMapPress}
      >
        {/* Tile layer de OpenStreetMap */}
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Ubicación seleccionada"
          />
        )}
      </MapView>
    </View>
  );
};

export default LocationPickerOSM;
```

**Uso en `ReporteCreateScreen.tsx` (Mobile):**

```typescript
import LocationPickerOSM from '../components/LocationPicker';

const ReporteCreateScreen = ({ navigation }: any) => {
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ latitude: lat, longitude: lng });
  };

  const onSubmit = async (data: any) => {
    await createReporte({
      ...data,
      latitud: selectedLocation?.latitude || 0,
      longitud: selectedLocation?.longitude || 0,
      // ... resto de campos
    });
  };

  return (
    <ScrollView>
      {/* ... otros campos ... */}
      
      <LocationPickerOSM onLocationSelect={handleLocationSelect} />
      
      {/* Botón para usar GPS actual */}
      <TouchableOpacity onPress={getCurrentLocation}>
        <Text>📍 Usar mi ubicación actual</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
```

### 11. Variables de Entorno

**`.env`**

```env
VITE_API_URL=http://localhost:8080/api/v1
```

---

## Frontend Mobile - React Native

### 1. Inicialización del Proyecto

```bash
# Crear proyecto React Native con Expo
npx create-expo-app urbanfix-mobile --template blank-typescript
cd urbanfix-mobile

# Instalar dependencias
npm install axios @react-navigation/native @react-navigation/stack
npm install @react-navigation/bottom-tabs
npm install expo-camera expo-location expo-secure-store
npm install @react-native-async-storage/async-storage
npm install react-hook-form zod
npm install @hookform/resolvers
```

### 2. Estructura de Carpetas

```
src/
├── api/                    # Capa de API
│   ├── axios.ts
│   ├── auth.ts
│   ├── reportes.ts
│   └── ...
├── components/             # Componentes reutilizables
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Spinner.tsx
│   └── common/
│       └── ReporteCard.tsx
├── screens/                # Pantallas
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   ├── ReporteListScreen.tsx
│   ├── ReporteDetailScreen.tsx
│   ├── ReporteCreateScreen.tsx
│   └── ProfileScreen.tsx
├── hooks/                  # Custom hooks
│   ├── useAuth.ts
│   ├── useReportes.ts
│   ├── useLocation.ts      # Hook para GPS
│   └── useCamera.ts        # Hook para cámara
├── contexts/
│   └── AuthContext.tsx
├── navigation/             # Configuración de navegación
│   ├── AppNavigator.tsx
│   └── TabNavigator.tsx
├── types/
│   └── index.ts
└── utils/
    └── storage.ts          # SecureStore wrapper
```

### 3. Configuración de Axios con SecureStore

**`src/api/axios.ts`**

```typescript
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const baseURL = 'http://YOUR_BACKEND_URL/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor con refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const response = await axios.post(`${baseURL}/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${refreshToken}` }
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        await SecureStore.setItemAsync('accessToken', accessToken);
        await SecureStore.setItemAsync('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        // Navegar a login (usar navigation)
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 4. Implementación de Sensores

#### 4.1 Hook para GPS (`src/hooks/useLocation.ts`)

```typescript
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      return currentLocation;
    } catch (error) {
      setErrorMsg('Error al obtener ubicación');
    }
  };

  return { location, errorMsg, getCurrentLocation };
};
```

#### 4.2 Hook para Cámara (`src/hooks/useCamera.ts`)

```typescript
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export const useCamera = () => {
  const [image, setImage] = useState<string | null>(null);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Se requiere permiso de cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      return result.assets[0].uri;
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      return result.assets[0].uri;
    }
  };

  return { image, takePhoto, pickImage };
};
```

### 5. Pantalla de Crear Reporte con Sensores

**`src/screens/ReporteCreateScreen.tsx`**

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { useLocation } from '../hooks/useLocation';
import { useCamera } from '../hooks/useCamera';
import { useReportes } from '../hooks/useReportes';
import { useCategorias } from '../hooks/useCategorias';
import { useZonas } from '../hooks/useZonas';

const ReporteCreateScreen = ({ navigation }: any) => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { location, getCurrentLocation } = useLocation();
  const { image, takePhoto, pickImage } = useCamera();
  const { createReporte } = useReportes();
  const { categorias } = useCategorias();
  const { zonas } = useZonas();
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(null);
  const [selectedZona, setSelectedZona] = useState<number | null>(null);

  const onSubmit = async (data: any) => {
    try {
      await createReporte({
        ...data,
        latitud: location?.coords.latitude || 0,
        longitud: location?.coords.longitude || 0,
        fotoUrl: image,
        categoriaId: selectedCategoria,
        zonaId: selectedZona,
      });
      Alert.alert('Éxito', 'Reporte creado');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el reporte');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold mb-6">Crear Reporte</Text>

      {/* Título */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Título</Text>
        <TextInput
          className="border p-3 rounded bg-white"
          placeholder="Título del reporte"
          onChangeText={(text) => setValue('titulo', text)}
        />
      </View>

      {/* Descripción */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Descripción</Text>
        <TextInput
          className="border p-3 rounded bg-white h-32"
          placeholder="Descripción detallada"
          multiline
          onChangeText={(text) => setValue('descripcion', text)}
        />
      </View>

      {/* Ubicación */}
      <View className="mb-4">
        <TouchableOpacity
          onPress={getCurrentLocation}
          className="bg-blue-600 p-3 rounded mb-2"
        >
          <Text className="text-white text-center font-medium">
            📍 Usar mi ubicación actual
          </Text>
        </TouchableOpacity>
        {location && (
          <Text className="text-sm text-gray-600">
            Lat: {location.coords.latitude.toFixed(6)}, Lng: {location.coords.longitude.toFixed(6)}
          </Text>
        )}
      </View>

      {/* Cámara */}
      <View className="mb-4">
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={takePhoto}
            className="flex-1 bg-green-600 p-3 rounded"
          >
            <Text className="text-white text-center">📷 Tomar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickImage}
            className="flex-1 bg-purple-600 p-3 rounded"
          >
            <Text className="text-white text-center">🖼️ Galería</Text>
          </TouchableOpacity>
        </View>
        {image && (
          <Text className="text-sm text-green-600 mt-2">✓ Foto seleccionada</Text>
        )}
      </View>

      {/* Categoría */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Categoría</Text>
        <ScrollView className="border rounded bg-white max-h-32">
          {categorias.map((cat: any) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategoria(cat.id)}
              className={`p-3 border-b ${selectedCategoria === cat.id ? 'bg-blue-100' : ''}`}
            >
              <Text>{cat.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Zona */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Zona</Text>
        <ScrollView className="border rounded bg-white max-h-32">
          {zonas.map((zona: any) => (
            <TouchableOpacity
              key={zona.id}
              onPress={() => setSelectedZona(zona.id)}
              className={`p-3 border-b ${selectedZona === zona.id ? 'bg-blue-100' : ''}`}
            >
              <Text>{zona.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Submit */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        className="bg-blue-600 p-4 rounded"
      >
        <Text className="text-white text-center font-bold text-lg">Crear Reporte</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ReporteCreateScreen;
```

### 6. Navegación con React Navigation

**`src/navigation/AppNavigator.tsx`**

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ReporteListScreen from '../screens/ReporteListScreen';
import ReporteCreateScreen from '../screens/ReporteCreateScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Reportes" component={ReporteListScreen} />
    <Tab.Screen name="Crear" component={ReporteCreateScreen} />
    <Tab.Screen name="Perfil" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <Stack.Screen name="Main" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default () => (
  <AuthProvider>
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  </AuthProvider>
);
```

### 7. Consumo de API Externa (Ejemplo: Mapas)

Para integrar mapas, usar `react-native-maps`:

```bash
npm install react-native-maps
```

**`src/screens/ReporteDetailScreen.tsx` (con mapa)**

```typescript
import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const ReporteDetailScreen = ({ route }: any) => {
  const { reporte } = route.params;

  return (
    <View className="flex-1">
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: reporte.latitud,
          longitude: reporte.longitud,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: reporte.latitud,
            longitude: reporte.longitud,
          }}
          title={reporte.titulo}
          description={reporte.descripcion}
        />
      </MapView>
    </View>
  );
};
```

---

## Deployment

### 1. Backend (AWS)

**Opción A: AWS Elastic Beanstalk**

```bash
# Build JAR
./mvnw clean package

# Deploy con EB CLI
eb init urbanfix-backend
eb create production-env
```

**Opción B: AWS ECS + Docker**

```dockerfile
# Dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/urbanfix-backend.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
# Build y push Docker image
docker build -t urbanfix-backend .
docker tag urbanfix-backend:latest YOUR_ECR_URI/urbanfix-backend:latest
docker push YOUR_ECR_URI/urbanfix-backend:latest
```

### 2. Frontend Web (Vercel)

```bash
# Build
npm run build

# Deploy con Vercel CLI
npm install -g vercel
vercel
```

**Configurar variables de entorno en Vercel:**
- `VITE_API_URL`: URL del backend en producción

### 3. Frontend Mobile (Expo)

```bash
# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios

# Publicar en Expo
eas submit --platform android
```

**Configurar `app.config.js`:**

```javascript
export default {
  expo: {
    extra: {
      apiUrl: process.env.API_URL || 'http://localhost:8080/api/v1',
    },
  },
};
```

### 4. Base de Datos (AWS RDS)

- Crear instancia PostgreSQL en RDS
- Configurar security group para permitir acceso desde ECS
- Usar variables de entorno para credentials

### 5. Configuración de CORS en Backend

**`src/main/java/org/example/urbanfixbackend/config/CorsConfig.java`**

```java
@Configuration
public class CorsConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().configurationSource(corsConfigurationSource());
        // ... resto de configuración
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("*"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

---

## Checklist de Evaluación

### Mobile (5 puntos)

- [ ] **1.5 pts - Integración con Backend**
  - [ ] Consume exclusivamente el backend desarrollado
  - [ ] Implementa métodos HTTP correctos (GET, POST, PUT, DELETE, PATCH)
  - [ ] Maneja tokens JWT con SecureStore de Expo
  - [ ] Headers apropiados (Authorization, Content-Type)
  - [ ] Interceptors para manejo centralizado de autenticación
  - [ ] Sin dependencia de datos en memoria

- [ ] **1.0 pt - Arquitectura**
  - [ ] Arquitectura modular con separación de capas
  - [ ] Servicios/API con axios configurado
  - [ ] Custom hooks para lógica reutilizable
  - [ ] Context API para estado global
  - [ ] Componentes funcionales con hooks
  - [ ] Código organizado en carpetas lógicas
  - [ ] Nombres descriptivos en inglés

- [ ] **1.5 pts - Sensores y APIs Externas**
  - [ ] Al menos 2 sensores implementados (cámara + GPS)
  - [ ] Sensores integrados con expo-camera y expo-location
  - [ ] Al menos 1 API externa (mapas con react-native-maps)
  - [ ] Manejo de permisos con mensajes claros
  - [ ] Fallbacks cuando sensores no disponibles

- [ ] **1.0 pt - Manejo de Errores y Loading**
  - [ ] Try-catch en todas las llamadas API
  - [ ] Mensajes de error amigables (no técnicos)
  - [ ] Estados de carga con indicadores visuales
  - [ ] Manejo de errores de red, timeouts, 4xx, 5xx
  - [ ] Retry logic para errores recuperables
  - [ ] Feedback visual para acciones exitosas
  - [ ] Validación de datos antes de enviar
  - [ ] Manejo de casos edge

### Web (5 puntos)

- [ ] **2.0 pts - Integración con Backend**
  - [ ] Consume exclusivamente el backend desarrollado
  - [ ] Axios con configuración centralizada
  - [ ] Manejo de tokens JWT seguro
  - [ ] Interceptors para auth, refresh, errores globales
  - [ ] Request cancellation con AbortController
  - [ ] Sin datos hardcodeados

- [ ] **1.0 pt - Componentes y Arquitectura**
  - [ ] Más de 10 componentes reutilizables
  - [ ] Separación componentes presentacionales/contenedores
  - [ ] Custom hooks (useAuth, useFetch, useForm)
  - [ ] React hooks eficientes
  - [ ] Context API o state management
  - [ ] Arquitectura modular organizada
  - [ ] Props tipadas con TypeScript
  - [ ] Nombres descriptivos en inglés

- [ ] **1.0 pt - Routing y Navegación**
  - [ ] React Router con rutas dinámicas
  - [ ] Query params (?page=1&search=term)
  - [ ] Rutas protegidas (PrivateRoute)
  - [ ] Lazy loading con React.lazy
  - [ ] Navegación programática con useNavigate
  - [ ] Manejo de rutas 404
  - [ ] Configuración centralizada

- [ ] **1.0 pt - Manejo de Errores, Loading y Validaciones**
  - [ ] Try-catch en todas las llamadas API
  - [ ] Error boundaries
  - [ ] Mensajes específicos y amigables
  - [ ] Estados de carga visuales
  - [ ] Manejo de todos los códigos HTTP
  - [ ] Validaciones client-side (React Hook Form + Zod)
  - [ ] Validación en tiempo real
  - [ ] Feedback para acciones exitosas
  - [ ] Manejo de casos edge
  - [ ] Deshabilitar botones durante requests
  - [ ] Retry logic

### Web UI/UX (2 puntos)

- [ ] **0.5 pt - Diseño Visual**
  - [ ] Framework CSS (TailwindCSS)
  - [ ] Componentes consistentemente estilizados
  - [ ] Paleta de colores coherente
  - [ ] Tipografía legible
  - [ ] Responsive design (mobile, tablet, desktop)
  - [ ] Iconos consistentes (Lucide React)
  - [ ] Transiciones sutiles

- [ ] **0.5 pt - Experiencia de Usuario**
  - [ ] Navegación intuitiva
  - [ ] Flujos claros sin fricción
  - [ ] Formularios con labels y placeholders claros
  - [ ] Confirmaciones para acciones destructivas
  - [ ] Búsqueda funcional con debounce
  - [ ] Filtros y ordenamiento
  - [ ] Accesibilidad básica
  - [ ] Mensajes contextuales

- [ ] **0.5 pt - Vistas y Funcionalidades**
  - [ ] Más de 4 vistas diferenciadas
  - [ ] Dashboard con información relevante
  - [ ] Listados con paginación
  - [ ] Vista de detalle completa
  - [ ] Formularios bien estructurados

- [ ] **0.5 pt - Paginación**
  - [ ] Paginación en al menos 2 endpoints
  - [ ] Controles intuitivos (anterior, siguiente, números)
  - [ ] Información de paginación (X-Y de Z)
  - [ ] Cambio de tamaño de página
  - [ ] Estado en query params
  - [ ] Manejo correcto de respuestas paginadas

### Deployment (3 puntos)

- [ ] **3.0 pts - Despliegue Completo**
  - [ ] Backend en AWS (ECS/EC2/Elastic Beanstalk)
  - [ ] Base de datos en RDS
  - [ ] Frontend web en Vercel/Netlify
  - [ ] App mobile en Expo/TestFlight
  - [ ] Sin errores de CORS
  - [ ] Variables de entorno configuradas
  - [ ] Secrets manejados de manera segura
  - [ ] HTTPS en todos los servicios
  - [ ] Autenticación JWT end-to-end
  - [ ] Latencia < 500ms
  - [ ] Disponibilidad continua
  - [ ] Sin vulnerabilidades críticas
  - [ ] URLs públicas accesibles

---

## Recursos Adicionales

### Documentación
- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [React Native](https://reactnative.dev)
- [Expo](https://docs.expo.dev)
- [Axios](https://axios-http.com)
- [TailwindCSS](https://tailwindcss.com)

### Herramientas
- React Hook Form: Validación de formularios
- Zod: Validación de schemas
- React Query: Caching y sincronización de servidor
- Lucide React: Iconos
- React Hot Toast: Notificaciones

### Testing
- Jest + React Testing Library (Web)
- Detox (Mobile E2E)

---

## Notas Importantes

1. **Seguridad:** Nunca hardcodear credenciales. Usar variables de entorno.
2. **Performance:** Implementar lazy loading y code splitting en web.
3. **UX:** Siempre mostrar loading states y manejar errores gracefully.
4. **Testing:** Escribir tests unitarios para custom hooks y componentes críticos.
5. **Documentación:** Mantener el README actualizado con instrucciones de setup.

---

## Próximos Pasos

1. ✅ Revisar esta guía completa
2. 📝 Crear repositorios para web y mobile
3. 🏗️ Inicializar proyectos con las estructuras sugeridas
4. 🔌 Implementar capa de API y autenticación
5. 🎨 Desarrollar vistas principales
6. 📱 Implementar sensores en mobile
7. 🚀 Configurar deployment
8. ✅ Verificar checklist de evaluación

**¡Buena suerte con la Fase 2! 🚀**
