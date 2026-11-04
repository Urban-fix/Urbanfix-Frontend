export const ESTADOS_REPORTE = {
  REPORTADO: 'REPORTADO',
  EN_PROCESO: 'EN_PROCESO',
  RESUELTO: 'RESUELTO',
  RECHAZADO: 'RECHAZADO',
} as const;

export const ROLES = {
  CIUDADANO: 'CIUDADANO',
  ADMIN_MUNICIPAL: 'ADMIN_MUNICIPAL',
  TECNICO: 'TECNICO',
  SUPERVISOR: 'SUPERVISOR',
} as const;

export const ESTADO_COLORS = {
  REPORTADO: 'bg-red-100 text-red-800',
  EN_PROCESO: 'bg-yellow-100 text-yellow-800',
  RESUELTO: 'bg-green-100 text-green-800',
  RECHAZADO: 'bg-gray-100 text-gray-800',
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const ITEMS_PER_PAGE = [10, 25, 50] as const;
