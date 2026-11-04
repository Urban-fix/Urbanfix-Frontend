export type Rol = 'CIUDADANO' | 'ADMIN_MUNICIPAL' | 'TECNICO' | 'SUPERVISOR';

export interface UsuarioResponseDTO {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegisterRequestDTO {
  nombre: string;
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
