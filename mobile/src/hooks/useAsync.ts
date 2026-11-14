import { useCallback, useEffect, useRef, useState } from 'react';
import { errorMessage } from '../api/client';

/**
 * Hook genérico para cargar datos: devuelve data, loading, error y refetch.
 * `deps` vuelve a disparar la carga (p.ej. cuando cambian los filtros).
 */
export function useAsync<T>(fn: () => Promise<{ data: T }>, deps: unknown[], fallback: T, errorText: string) {
  const [data, setData] = useState<T>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const load = useCallback(
    async (mode: 'initial' | 'refresh' = 'initial') => {
      mode === 'refresh' ? setIsRefreshing(true) : setIsLoading(true);
      try {
        const res = await fnRef.current();
        setData(res.data);
        setError(null);
      } catch (e) {
        setError(errorMessage(e, errorText));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [errorText],
  );

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, setData, isLoading, isRefreshing, error, refetch: () => load('refresh') };
}
