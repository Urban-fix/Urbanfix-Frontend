import { catalogosApi, reportesApi } from '../api/endpoints';
import type { ReportePublicDTO, ReporteResponseDTO, ReportFilters } from '../types/reporte.types';
import type { CategoriaResponseDTO } from '../types/categoria.types';
import type { ZonaResponseDTO } from '../types/zona.types';
import { useAsync } from './useAsync';

export const useMisReportes = () =>
  useAsync<ReporteResponseDTO[]>(() => reportesApi.getMis(), [], [], 'Error al cargar mis reportes');

export const useReportesPublic = () =>
  useAsync<ReportePublicDTO[]>(() => reportesApi.getPublic(), [], [], 'Error al cargar reportes públicos');

export const useReportes = (filters: ReportFilters) =>
  useAsync<ReporteResponseDTO[]>(
    () => reportesApi.getAll(filters),
    [filters.estado, filters.categoriaId, filters.zonaId, filters.search],
    [],
    'Error al cargar reportes',
  );

export const useCategorias = () =>
  useAsync<CategoriaResponseDTO[]>(() => catalogosApi.categorias(), [], [], 'Error al cargar categorías');

export const useZonas = () => useAsync<ZonaResponseDTO[]>(() => catalogosApi.zonas(), [], [], 'Error al cargar zonas');
