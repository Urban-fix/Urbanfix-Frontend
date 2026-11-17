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
  REPORTADO: 'bg-warning/15 text-warning border-warning/30',
  EN_PROCESO: 'bg-status-en-proceso/15 text-status-en-proceso border-status-en-proceso/30',
  RESUELTO: 'bg-success/15 text-success border-success/30',
  RECHAZADO: 'bg-error/15 text-error border-error/30',
} as const;

export const ESTADO_ICONS = {
  REPORTADO: 'AlertCircle',
  EN_PROCESO: 'Clock',
  RESUELTO: 'CheckCircle2',
  RECHAZADO: 'XCircle',
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const ITEMS_PER_PAGE = [10, 25, 50] as const;
