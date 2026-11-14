import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '../utils/constants';
import { tokenStorage } from './tokenStorage';

/**
 * En el web la sesión viaja en cookies HttpOnly. En móvil no hay navegador
 * que las gestione, así que guardamos los tokens en SecureStore y los enviamos
 * en el header `Authorization: Bearer …` (el JwtAuthenticationFilter del
 * backend ya lo acepta).
 */
export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Se llama cuando el refresh falla: el AuthContext limpia la sesión. */
let onSessionExpired: (() => void) | null = null;
export const setOnSessionExpired = (fn: () => void) => {
  onSessionExpired = fn;
};

const NO_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/password-reset', '/reportes/public'];

let refreshing: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = await tokenStorage.getRefresh();
  if (!refreshToken) return null;
  // El endpoint /refresh lee el refreshToken de la cookie, así que la enviamos a mano.
  const { data } = await axios.post(
    `${API_URL}/api/v1/auth/refresh`,
    {},
    { headers: { Cookie: `refreshToken=${refreshToken}` } },
  );
  await tokenStorage.save(data.accessToken, data.refreshToken);
  return data.accessToken as string;
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const url = original?.url ?? '';

    if (!original || error.response?.status !== 401 || original._retry || NO_REFRESH.some((p) => url.includes(p))) {
      return Promise.reject(error);
    }

    original._retry = true;
    try {
      refreshing = refreshing ?? refreshAccessToken();
      const newToken = await refreshing;
      refreshing = null;
      if (!newToken) throw error;
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (e) {
      refreshing = null;
      await tokenStorage.clear();
      onSessionExpired?.();
      return Promise.reject(e);
    }
  },
);

/** Extrae un mensaje legible del error de axios (igual que en el web). */
export const errorMessage = (err: unknown, fallback: string) => {
  const e = err as AxiosError<{ message?: string }>;
  return e?.response?.data?.message ?? fallback;
};
