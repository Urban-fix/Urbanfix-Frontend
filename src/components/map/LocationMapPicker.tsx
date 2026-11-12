import React, { useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import { Crosshair, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import 'leaflet/dist/leaflet.css';

export type Coords = { lat: number; lng: number };

/** Centro por defecto (Lima, PE). */
export const DEFAULT_MAP_CENTER: Coords = { lat: -12.0464, lng: -77.0428 };

const pinIcon = L.divIcon({
  className: 'uf-map-pin',
  html: `<span class="uf-map-pin-dot"></span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

function MapClickHandler({ onPick }: { onPick: (coords: Coords) => void }) {
  useMapEvents({
    click(event) {
      onPick({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
}

/** Vuela al pin solo si está lejos del centro actual (evita saltos al arrastrar). */
function FollowPin({ target }: { target: Coords | null }) {
  const map = useMap();

  useEffect(() => {
    if (!target) return;
    const distance = map.distance(map.getCenter(), L.latLng(target.lat, target.lng));
    if (distance > 120) {
      map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 15), {
        duration: 0.6,
      });
    }
  }, [target?.lat, target?.lng, map, target]);

  return null;
}

interface LocationMapPickerProps {
  value: Coords | null;
  onChange: (coords: Coords) => void;
  error?: string;
  className?: string;
}

export const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  value,
  onChange,
  error,
  className = '',
}) => {
  const center = value ?? DEFAULT_MAP_CENTER;

  const latDisplay = useMemo(
    () => (value ? String(Number(value.lat.toFixed(6))) : ''),
    [value],
  );
  const lngDisplay = useMemo(
    () => (value ? String(Number(value.lng.toFixed(6))) : ''),
    [value],
  );

  const applyManual = (field: 'lat' | 'lng', raw: string) => {
    if (raw.trim() === '' || raw === '-' || raw === '.' || raw === '-.') return;
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;

    const next: Coords = {
      lat: field === 'lat' ? parsed : (value?.lat ?? DEFAULT_MAP_CENTER.lat),
      lng: field === 'lng' ? parsed : (value?.lng ?? DEFAULT_MAP_CENTER.lng),
    };

    if (next.lat < -90 || next.lat > 90) return;
    if (next.lng < -180 || next.lng > 180) return;
    onChange(next);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalización no soportada en este navegador');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        toast.success('Ubicación actual fijada en el mapa');
      },
      () => toast.error('No se pudo obtener tu ubicación'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className={`location-picker ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-medium text-text">Ubicación del reporte</p>
          <p className="text-xs text-text-muted mt-0.5">
            Haz clic en el mapa para fijar el pin, arrástralo, o escribe las
            coordenadas.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={useMyLocation}
          className="inline-flex items-center gap-2 h-10"
        >
          <Crosshair className="w-4 h-4" />
          Mi ubicación
        </Button>
      </div>

      <div className="location-picker-map rounded border border-line overflow-hidden mb-4">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={value ? 16 : 13}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onPick={onChange} />
          <FollowPin target={value} />
          {value && (
            <Marker
              position={[value.lat, value.lng]}
              icon={pinIcon}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const marker = event.target as L.Marker;
                  const pos = marker.getLatLng();
                  onChange({ lat: pos.lat, lng: pos.lng });
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Latitud"
          type="number"
          step="any"
          min={-90}
          max={90}
          value={latDisplay}
          onChange={(e) => applyManual('lat', e.target.value)}
          placeholder="-12.046400"
        />
        <Input
          label="Longitud"
          type="number"
          step="any"
          min={-180}
          max={180}
          value={lngDisplay}
          onChange={(e) => applyManual('lng', e.target.value)}
          placeholder="-77.042800"
        />
      </div>

      {value ? (
        <p className="mt-3 text-xs text-text-muted flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
          Pin fijado en {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
        </p>
      ) : (
        <p className="mt-3 text-xs text-warning">
          Aún no hay ubicación. Haz clic en el mapa o completa latitud/longitud.
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-error flex items-center gap-1">
          <span className="text-xs">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};
