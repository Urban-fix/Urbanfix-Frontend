import { api } from './axios';

export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (data: any) => 
    api.post('/auth/register', data),
  
  refresh: () => 
    api.post('/auth/refresh', {}),
  
  requestPasswordReset: (email: string) => 
    api.post('/auth/password-reset/request', { email }),
  
  confirmPasswordReset: (token: string, newPassword: string) => 
    api.post('/auth/password-reset/confirm', { token, newPassword }),
};
