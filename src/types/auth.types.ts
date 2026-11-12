export type Rol = 'CIUDADANO' | 'ADMIN_MUNICIPAL' | 'TECNICO' | 'SUPERVISOR' | 'OPERADOR' | 'AUDITOR';

export interface UsuarioResponseDTO {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
  fechaRegistro?: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegisterRequestDTO {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: Rol;
}

export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  usuario: UsuarioResponseDTO;
}

export interface PasswordResetRequestDTO {
  email: string;
}

export interface PasswordResetConfirmDTO {
  code: string;
  newPassword: string;
}

export interface PasswordResetResponseDTO {
  message: string;
}
