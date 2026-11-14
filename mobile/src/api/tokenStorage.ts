import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS = 'uf_access_token';
const REFRESH = 'uf_refresh_token';

// SecureStore no existe en web; ahí usamos localStorage solo para pruebas.
const isWeb = Platform.OS === 'web';

const get = async (key: string) =>
  isWeb ? globalThis.localStorage?.getItem(key) ?? null : SecureStore.getItemAsync(key);

const set = async (key: string, value: string) =>
  isWeb ? globalThis.localStorage?.setItem(key, value) : SecureStore.setItemAsync(key, value);

const del = async (key: string) =>
  isWeb ? globalThis.localStorage?.removeItem(key) : SecureStore.deleteItemAsync(key);

export const tokenStorage = {
  getAccess: () => get(ACCESS),
  getRefresh: () => get(REFRESH),
  save: async (access: string, refresh?: string) => {
    await set(ACCESS, access);
    if (refresh) await set(REFRESH, refresh);
  },
  clear: async () => {
    await del(ACCESS);
    await del(REFRESH);
  },
};
