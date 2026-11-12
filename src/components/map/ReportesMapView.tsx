import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import type {
  ReporteResponseDTO,
  ReportePublicDTO,
} from '../../types/reporte.types';
import { DEFAULT_MAP_CENTER } from './LocationMapPicker';
import { StatusBadge } from '../ui/StatusBadge';
import { ESTADOS_REPORTE } from '../../utils/constants';
import 'leaflet/dist/leaflet.css';

type MapReporte = ReporteResponseDTO | ReportePublicDTO;

const ESTADO_PIN: Record<string, string> = {
  PENDIENTE: 'var(--color-status-reportado)',
  EN_PROGRESO: 'var(--color-status-en-proceso)',
  RESUELTO: 'var(--color-status-resuelto)',
  RECHAZADO: 'var(--color-status-rechazado)',
};

function pinIcon(estado: string) {
  const color = ESTADO_PIN[estado] ?? 'var(--color-accent)';
  return L.divIcon({
    className: 'uf-map-pin uf-map-pin-report',
    html: `<span class="uf-map-pin-dot" style="background:${color}"></span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -24],
  });
}

function FitBounds({ reportes }: { reportes: MapReporte[] }) {
  const map = useMap();

  useEffect(() => {
    if (reportes.length === 0) {
      map.setView([DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng], 12);
      return;
    }

    if (reportes.length === 1) {
      map.setView([reportes[0].latitud, reportes[0].longitud], 15);
      return;
    }

    const bounds = L.latLngBounds(
      reportes.map((r) => [r.latitud, r.longitud] as [number, number]),
    );
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
  }, [map, reportes]);

  return null;
}

interface ReportesMapViewProps {
  reportes: MapReporte[];
  className?: string;
  onSelect?: (reporte: MapReporte) => void;
  selectedId?: number | null;
}

export const ReportesMapView: React.FC<ReportesMapViewProps> = ({
  reportes,
  className = '',
  onSelect,
  selectedId,
}) => {
  const [geoDenied, setGeoDenied] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => setGeoDenied(false),
      () => setGeoDenied(true),
      { timeout: 4000, maximumAge: 60_000 },
    );
  }, []);

  const withCoords = useMemo(
    () =>
      reportes.filter(
        (r) =>
          Number.isFinite(r.latitud) &&
          Number.isFinite(r.longitud) &&
          !(r.latitud === 0 && r.longitud === 0),
      ),
    [reportes],
  );

  return (
    <div
      className={`reportes-map-view relative overflow-hidden rounded border border-line ${className}`}
    >
      {geoDenied && (
        <p className="uf-map-banner" role="status">
          No se pudo usar tu ubicación. El mapa está centrado en la zona por
          defecto.
        </p>
      )}

      <div className="uf-map-legend" aria-label="Leyenda de estados">
        {(
          [
            ['PENDIENTE', 'Pendiente'],
            ['EN_PROGRESO', 'En progreso'],
            ['RESUELTO', 'Resuelto'],
            ['RECHAZADO', 'Rechazado'],
          ] as const
        ).map(([key, label]) => (
          <span key={key} className="uf-map-legend-item">
            <span
              className="uf-map-legend-swatch"
              style={{ background: ESTADO_PIN[key] }}
            />
            {label}
          </span>
        ))}
      </div>

      <MapContainer
        center={[DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng]}
        zoom={12}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FitBounds reportes={withCoords} />
        {withCoords.map((reporte) => (
          <Marker
            key={reporte.id}
            position={[reporte.latitud, reporte.longitud]}
            icon={pinIcon(reporte.estadoActual)}
            opacity={selectedId && selectedId !== reporte.id ? 0.55 : 1}
            eventHandlers={{
              click: () => onSelect?.(reporte),
            }}
          >
            <Popup className="uf-map-popup">
              <div className="uf-map-popup-card">
                <div className="uf-map-popup-head">
                  <strong className="uf-map-popup-title">{reporte.titulo}</strong>
                  <StatusBadge
                    estado={
                      reporte.estadoActual as keyof typeof ESTADOS_REPORTE
                    }
                    showIcon={false}
                  />
                </div>
                <p className="uf-map-popup-desc">{reporte.descripcion}</p>
                <p className="uf-map-popup-meta">
                  {reporte.categoria?.nombre} · {reporte.zona?.nombre}
                </p>
                <div className="uf-map-popup-actions">
                  {onSelect && (
                    <button
                      type="button"
                      className="uf-map-popup-btn"
                      onClick={() => onSelect(reporte)}
                    >
                      Abrir panel
                    </button>
                  )}
                  <Link
                    to={`/reportes/${reporte.id}`}
                    className="uf-map-popup-link"
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
