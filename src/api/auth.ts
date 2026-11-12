import { api } from './axios';

export const authApi = {
  login: (email: string, password: string) => 
    api.post('/api/v1/auth/login', { email, password }),
  
  register: (data: any) => 
    api.post('/api/v1/auth/register', data),
  
  refresh: () => 
    api.post('/api/v1/auth/refresh', {}),
  
  requestPasswordReset: (email: string) => 
    api.post('/api/v1/auth/password-reset/request', { email }),
  
  validatePasswordReset: (code: string) => 
    api.post('/api/v1/auth/password-reset/validate', { code }),
  
  confirmPasswordReset: (code: string, newPassword: string) => 
    api.post('/api/v1/auth/password-reset/confirm', { code, newPassword }),
  
  googleLogin: (idToken: string) => 
    api.post('/api/v1/auth/google', { idToken }),

  createUserAsAdmin: (data: any) =>
    api.post('/api/v1/auth/admin/create-user', data),
  
  me: () =>
    api.get('/api/v1/auth/me'),
  
  logout: () =>
    api.post('/api/v1/auth/logout'),
};
