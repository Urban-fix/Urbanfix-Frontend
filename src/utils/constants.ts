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
  REPORTADO: 'bg-status-reportado/10 text-status-reportado border-status-reportado/20',
  EN_PROCESO: 'bg-status-en-proceso/10 text-status-en-proceso border-status-en-proceso/20',
  RESUELTO: 'bg-status-resuelto/10 text-status-resuelto border-status-resuelto/20',
  RECHAZADO: 'bg-status-rechazado/10 text-status-rechazado border-status-rechazado/20',
} as const;

export const ESTADO_ICONS = {
  REPORTADO: 'AlertCircle',
  EN_PROCESO: 'Clock',
  RESUELTO: 'CheckCircle2',
  RECHAZADO: 'XCircle',
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const ITEMS_PER_PAGE = [10, 25, 50] as const;
