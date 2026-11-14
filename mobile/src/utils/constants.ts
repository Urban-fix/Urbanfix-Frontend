import Constants from 'expo-constants';
import { colors } from '../theme/tokens';
import type { EstadoReporte } from '../types/reporte.types';

/**
 * URL del backend. Prioridad:
 * 1. EXPO_PUBLIC_API_URL (archivo .env)
 * 2. expo.extra.apiUrl en app.json
 *
 * Ojo: en un celular físico "localhost" es el propio celular.
 * Usa la IP de tu PC en la red (ej. http://192.168.1.20:8080)
 * o 10.0.2.2:8080 en el emulador de Android.
 */
export const API_URL: string =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  'http://localhost:8080';

export const ESTADOS_REPORTE = {
  PENDIENTE: 'PENDIENTE',
  EN_PROGRESO: 'EN_PROGRESO',
  RESUELTO: 'RESUELTO',
  RECHAZADO: 'RECHAZADO',
} as const;

export const ESTADO_COLOR: Record<EstadoReporte, string> = {
  PENDIENTE: colors.warning,
  EN_PROGRESO: colors.info,
  RESUELTO: colors.success,
  RECHAZADO: colors.error,
};

export const ESTADO_ICON: Record<EstadoReporte, 'alert-circle' | 'clock' | 'check-circle' | 'x-circle'> = {
  PENDIENTE: 'alert-circle',
  EN_PROGRESO: 'clock',
  RESUELTO: 'check-circle',
  RECHAZADO: 'x-circle',
};

export const estadoLabel = (estado: string) => estado.replace('_', ' ');

/** Imagen por defecto cuando el reporte no tiene foto (misma que usa el web). */
export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80';

/** Centro por defecto del mapa: Lima. */
export const DEFAULT_REGION = {
  latitude: -12.0464,
  longitude: -77.0428,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};
