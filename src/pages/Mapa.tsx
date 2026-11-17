import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import { CountingNumber } from '@animate-ui/react/primitives/texts/counting-number';
import { Shine } from '@animate-ui/react/primitives/effects/shine';
import { Magnetic } from '@animate-ui/react/primitives/effects/magnetic';
import {
  Close as DialogClose,
  Content as DialogContent,
  Description as DialogDescription,
  Overlay as DialogOverlay,
  Portal as DialogPortal,
  Root as DialogRoot,
  Title as DialogTitle,
} from '@animate-ui/react/primitives/radix-ui/dialog';
import { AppShell } from '../components/layout/AppShell';
import { ReportesMapView } from '../components/map/ReportesMapView';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useReportesPublic } from '../hooks/useReportesPublic';
import { ESTADOS_REPORTE } from '../utils/constants';
import { homeImages } from '../utils/homeMedia';
import { normalizeImageUrl } from '../utils/imageHelper';
import type { ReportePublicDTO } from '../types/reporte.types';
import { MapPin, Plus, X, ArrowRight, Sparkles } from 'lucide-react';

export const Mapa: React.FC = () => {
  const { reportes, isLoading, error, refetch } = useReportesPublic();
  const [selected, setSelected] = useState<ReportePublicDTO | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSelect = (reporte: ReportePublicDTO) => {
    setSelected(reporte);
    setSheetOpen(true);
  };

  return (
    <AppShell
      title="Mapa de reportes"
      subtitle="Problemas urbanos geolocalizados con OpenStreetMap"
      action={
        <Magnetic strength={0.2} onlyOnHover>
          <Link to="/informes/crear">
            <Shine
              enableOnHover
              color="rgba(212,245,140,0.35)"
              className="inline-flex"
            >
              <Button className="inline-flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo reporte
                <Sparkles className="ml-2 h-3 w-3 text-accent/60" />
              </Button>
            </Shine>
          </Link>
        </Magnetic>
      }
    >
      <div className="space-y-4 sm:space-y-5">
        <Effect fade slide={{ direction: 'up', offset: 14 }} inView>
          <Magnetic strength={0.08} onlyOnHover>
            <Shine
              enableOnHover
              color="rgba(212,245,140,0.15)"
              className="block"
            >
              <div className="auth-map-toolbar">
                <div className="flex items-center gap-3">
                  <div className="auth-icon-well">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wider text-text-muted">
                      Pines activos
                    </p>
                    {isLoading ? (
                      <div className="mt-1 h-7 w-16 animate-pulse rounded bg-surface-2" />
                    ) : (
                      <CountingNumber
                        number={reportes.length}
                        className="font-heading text-xl sm:text-2xl text-accent"
                        inView
                      />
                    )}
                  </div>
                </div>
                <p className="max-w-md text-xs sm:text-sm text-text-secondary">
                  Haz clic en un pin para abrir el detalle. Los colores indican el
                  estado del reporte.
                </p>
              </div>
            </Shine>
          </Magnetic>
        </Effect>

        {error && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-error/30 bg-error/10 p-3 text-sm text-error">
            <p>{error}</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        )}

        <Effect fade slide={{ direction: 'up', offset: 16 }} delay={0.06} inView>
          {isLoading ? (
            <div className="auth-map-frame h-[min(60vh,640px)] sm:h-[min(70vh,640px)] animate-pulse bg-surface-2" />
          ) : reportes.length === 0 ? (
            <div className="auth-empty-card py-10 sm:py-14 text-center">
              <p className="mb-5 text-text-secondary">
                No hay reportes en el mapa
              </p>
              <Magnetic strength={0.2} onlyOnHover>
                <Link to="/informes/crear">
                  <Shine
                    enableOnHover
                    color="rgba(212,245,140,0.3)"
                    className="inline-block"
                  >
                    <Button className="inline-flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      Crear primer reporte
                      <Sparkles className="ml-2 h-3 w-3 text-accent/60" />
                    </Button>
                  </Shine>
                </Link>
              </Magnetic>
            </div>
          ) : (
            <div className="auth-map-layout">
              <div className="auth-map-frame min-w-0 flex-1">
                <ReportesMapView
                  reportes={reportes}
                  className="h-[min(60vh,640px)] sm:h-[min(70vh,640px)]"
                  onSelect={(r) => handleSelect(r as ReportePublicDTO)}
                  selectedId={selected?.id}
                />
              </div>

              {selected && (
                <Magnetic strength={0.08} onlyOnHover>
                  <Shine
                    enableOnHover
                    color="rgba(212,245,140,0.12)"
                    className="block"
                  >
                    <aside className="auth-map-detail hidden w-full max-w-sm shrink-0 lg:block">
                      <div className="auth-map-detail-media">
                        <img
                          src={normalizeImageUrl(selected.fotoUrl, selected.id) || homeImages.baches}
                          alt={selected.titulo}
                          loading="lazy"
                        />
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="font-heading text-lg uppercase text-text">
                            {selected.titulo}
                          </h2>
                          <StatusBadge
                            estado={
                              selected.estadoActual as keyof typeof ESTADOS_REPORTE
                            }
                            showIcon={false}
                          />
                        </div>
                        <p className="text-sm leading-relaxed text-text-secondary">
                          {selected.descripcion}
                        </p>
                        <p className="text-xs text-text-muted">
                          {selected.categoria?.nombre} · {selected.zona?.nombre}
                        </p>
                        <Magnetic strength={0.15} onlyOnHover>
                          <Shine
                            enableOnHover
                            color="rgba(212,245,140,0.25)"
                            className="inline-block"
                          >
                            <Link to={`/reportes/${selected.id}`}>
                              <Button className="inline-flex w-full items-center justify-center">
                                Ver detalle completo
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          </Shine>
                        </Magnetic>
                      </div>
                    </aside>
                  </Shine>
                </Magnetic>
              )}
            </div>
          )}
        </Effect>
      </div>

      {/* Mobile bottom sheet */}
      <DialogRoot
        open={sheetOpen && !!selected}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setSelected(null);
        }}
      >
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-40 bg-bg/70 backdrop-blur-sm lg:hidden" />
          <DialogContent
            data-side="bottom"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-auto rounded-t-lg border border-line bg-surface text-text outline-none lg:hidden"
          >
            {selected && (
              <>
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <DialogTitle className="font-heading text-base uppercase text-text">
                    {selected.titulo}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Detalle del reporte en el mapa
                  </DialogDescription>
                  <DialogClose
                    className="rounded p-2 text-text-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label="Cerrar detalle"
                  >
                    <X className="h-5 w-5" />
                  </DialogClose>
                </div>
                <div className="auth-map-detail-media">
                  <img
                    src={normalizeImageUrl(selected.fotoUrl, selected.id) || homeImages.baches}
                    alt={selected.titulo}
                    loading="lazy"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <StatusBadge
                    estado={
                      selected.estadoActual as keyof typeof ESTADOS_REPORTE
                    }
                  />
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {selected.descripcion}
                  </p>
                  <p className="text-xs text-text-muted">
                    {selected.categoria?.nombre} · {selected.zona?.nombre}
                  </p>
                  <Magnetic strength={0.15} onlyOnHover>
                    <Shine
                      enableOnHover
                      color="rgba(212,245,140,0.25)"
                      className="inline-block"
                    >
                      <Link to={`/reportes/${selected.id}`}>
                        <Button className="inline-flex w-full items-center justify-center">
                          Ver detalle completo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </Shine>
                  </Magnetic>
                </div>
              </>
            )}
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    </AppShell>
  );
};
