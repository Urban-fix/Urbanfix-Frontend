import { api } from './axios';

// Response interceptor para manejar errores y redirección automática
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest.url;

    // No intentar refresh para endpoints de autenticación que deben fallar con 401 cuando no hay sesión
    if (url?.includes('/api/v1/auth/me') || 
        url?.includes('/api/v1/auth/login') ||
        url?.includes('/api/v1/auth/register') ||
        url?.includes('/api/v1/auth/refresh') ||
        url?.includes('/api/v1/auth/password-reset')) {
      return Promise.reject(error);
    }

    // No intentar refresh para endpoints públicos
    if (url?.includes('/api/v1/reportes/public')) {
      return Promise.reject(error);
    }

    // Error 401 - Token expirado, intentar refresh automático (solo una vez)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Llamar al endpoint de refresh (usa cookies HttpOnly automáticamente)
        await api.post('/api/v1/auth/refresh');
        // Reintentar la petición original
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falló, limpiar estado y redirigir a login
        // No redirigir si ya estamos en login para evitar bucles
        if (window.location.pathname !== '/login' && 
            window.location.pathname !== '/register' &&
            window.location.pathname !== '/password-reset/request' &&
            window.location.pathname !== '/password-reset/confirm') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
