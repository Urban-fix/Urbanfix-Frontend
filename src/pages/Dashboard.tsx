import React from 'react';
import { Link } from 'react-router-dom';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import { CountingNumber } from '@animate-ui/react/primitives/texts/counting-number';
import { Shine } from '@animate-ui/react/primitives/effects/shine';
import { Magnetic } from '@animate-ui/react/primitives/effects/magnetic';
import { useAuth } from '../hooks/useAuth';
import { useMisReportes } from '../hooks/useMisReportes';
import { useReportesPublic } from '../hooks/useReportesPublic';
import { Button } from '../components/ui/Button';
import { AppShell } from '../components/layout/AppShell';
import { StatusBadge } from '../components/ui/StatusBadge';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Map,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { ESTADOS_REPORTE } from '../utils/constants';
import { formatRelativeTime } from '../utils/formatters';
import { homeImages } from '../utils/homeMedia';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { reportes, isLoading, error, refetch } = useMisReportes();
  const { reportes: publicReportes } = useReportesPublic();

  const userStats = {
    total: reportes.length,
    pendientes: reportes.filter((r) => r.estadoActual === 'PENDIENTE').length,
    enProgreso: reportes.filter((r) => r.estadoActual === 'EN_PROGRESO').length,
    resueltos: reportes.filter((r) => r.estadoActual === 'RESUELTO').length,
  };

  const globalStats = {
    pendientes: publicReportes.filter((r) => r.estadoActual === 'PENDIENTE')
      .length,
    resueltos: publicReportes.filter((r) => r.estadoActual === 'RESUELTO')
      .length,
  };

  const statCards = [
    {
      title: 'Mis Reportes',
      value: userStats.total,
      icon: FileText,
      tone: 'accent' as const,
    },
    {
      title: 'Pendientes',
      value: userStats.pendientes,
      icon: AlertCircle,
      tone: 'warning' as const,
    },
    {
      title: 'En Progreso',
      value: userStats.enProgreso,
      icon: Clock,
      tone: 'info' as const,
    },
    {
      title: 'Resueltos',
      value: userStats.resueltos,
      icon: CheckCircle,
      tone: 'success' as const,
    },
  ];

  return (
    <AppShell
      title="Dashboard"
      subtitle={`Bienvenido, ${user?.nombre}`}
      action={
        <Link to="/informes/crear">
          <Button className="inline-flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Nuevo Reporte
          </Button>
        </Link>
      }
    >
      <div className="space-y-10">
        {error && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-error/30 bg-error/10 p-3 text-sm text-error">
            <p>{error}</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        )}

        <Effect fade slide={{ direction: 'up', offset: 18 }} inView>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Magnetic strength={0.18} onlyOnHover>
              <Link to="/informes" className="block">
                <Shine
                  enableOnHover
                  color="rgba(212,245,140,0.35)"
                  className="auth-quick-card"
                >
                  <div className="flex items-center gap-4 p-1">
                    <div className="auth-icon-well">
                      <FileText className="h-6 w-6 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading uppercase tracking-tight text-text">
                        Informes
                      </h3>
                      <p className="text-sm text-text-secondary">
                        Explora reportes de la comunidad
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-text-muted" />
                  </div>
                </Shine>
              </Link>
            </Magnetic>

            <Magnetic strength={0.18} onlyOnHover>
              <Link to="/mapa" className="block">
                <Shine
                  enableOnHover
                  color="rgba(212,245,140,0.35)"
                  className="auth-quick-card"
                >
                  <div className="flex items-center gap-4 p-1">
                    <div className="auth-icon-well">
                      <Map className="h-6 w-6 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading uppercase tracking-tight text-text">
                        Mapa
                      </h3>
                      <p className="text-sm text-text-secondary">
                        Ubica problemas en OpenStreetMap
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-text-muted" />
                  </div>
                </Shine>
              </Link>
            </Magnetic>
          </div>
        </Effect>

        <section>
          <Effect fade slide={{ direction: 'up', offset: 14 }} inView>
            <h2 className="auth-section-title mb-5">Tu actividad</h2>
          </Effect>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="auth-stat-card h-28 animate-pulse bg-surface-2"
                  />
                ))
              : statCards.map((stat, index) => (
                  <Effect
                    key={stat.title}
                    fade
                    slide={{ direction: 'up', offset: 16 }}
                    delay={0.05 * index}
                    inView
                  >
                    <article className={`auth-stat-card tone-${stat.tone}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="auth-stat-label">{stat.title}</p>
                          <CountingNumber
                            number={stat.value}
                            className="auth-stat-value"
                            inView
                          />
                        </div>
                        <stat.icon className="auth-stat-icon" aria-hidden />
                      </div>
                    </article>
                  </Effect>
                ))}
          </div>
        </section>

        <section>
          <Effect fade slide={{ direction: 'up', offset: 14 }} inView>
            <h2 className="auth-section-title mb-5">Comunidad</h2>
          </Effect>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Effect
              fade
              slide={{ direction: 'up', offset: 14 }}
              delay={0.05}
              inView
            >
              <article className="auth-stat-card tone-accent">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="auth-stat-label">Pendientes globales</p>
                    <CountingNumber
                      number={globalStats.pendientes}
                      className="auth-stat-value"
                      inView
                    />
                  </div>
                  <TrendingUp className="auth-stat-icon" aria-hidden />
                </div>
              </article>
            </Effect>
            <Effect
              fade
              slide={{ direction: 'up', offset: 14 }}
              delay={0.1}
              inView
            >
              <article className="auth-stat-card tone-success">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="auth-stat-label">Resueltos globales</p>
                    <CountingNumber
                      number={globalStats.resueltos}
                      className="auth-stat-value"
                      inView
                    />
                  </div>
                  <CheckCircle className="auth-stat-icon" aria-hidden />
                </div>
              </article>
            </Effect>
          </div>
        </section>

        <section>
          <Effect
            fade
            slide={{ direction: 'up', offset: 14 }}
            inView
            className="mb-5 flex items-end justify-between gap-4"
          >
            <h2 className="auth-section-title mb-0">Mis reportes recientes</h2>
            {reportes.length > 0 && (
              <Link
                to="/mis-reportes"
                className="text-sm text-accent transition-colors hover:text-accent-hover"
              >
                Ver todos
              </Link>
            )}
          </Effect>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="auth-report-card h-64 animate-pulse bg-surface-2"
                />
              ))}
            </div>
          ) : reportes.length === 0 ? (
            <Effect fade slide={{ direction: 'up', offset: 16 }} inView>
              <div className="auth-empty-card py-14 text-center">
                <p className="mb-2 font-heading text-xl uppercase text-text">
                  Sin reportes aún
                </p>
                <p className="mb-5 text-text-secondary">
                  Aún no tienes reportes. Crea el primero.
                </p>
                <Link to="/informes/crear">
                  <Button>Crear primer reporte</Button>
                </Link>
              </div>
            </Effect>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reportes.slice(0, 6).map((reporte, index) => (
                <Effect
                  key={reporte.id}
                  fade
                  slide={{ direction: 'up', offset: 14 }}
                  delay={0.04 * index}
                  inView
                >
                  <article className="auth-report-card flex h-full flex-col">
                    <div className="auth-report-media">
                      <img
                        src={reporte.fotoUrl || homeImages.baches}
                        alt={reporte.titulo}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 font-heading text-base uppercase leading-tight text-text">
                          {reporte.titulo}
                        </h3>
                        <StatusBadge
                          estado={
                            reporte.estadoActual as keyof typeof ESTADOS_REPORTE
                          }
                          showIcon={false}
                        />
                      </div>
                      <p className="mb-3 line-clamp-2 text-sm text-text-secondary">
                        {reporte.descripcion}
                      </p>
                      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                        <span className="text-xs text-text-muted">
                          {formatRelativeTime(reporte.fechaCreacion)}
                        </span>
                        <Link
                          to={`/reportes/${reporte.id}`}
                          className="text-sm font-semibold text-accent hover:text-accent-hover"
                        >
                          Ver detalle
                        </Link>
                      </div>
                    </div>
                  </article>
                </Effect>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
};
