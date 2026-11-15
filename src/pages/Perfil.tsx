import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import { Shine } from '@animate-ui/react/primitives/effects/shine';
import { Magnetic } from '@animate-ui/react/primitives/effects/magnetic';
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsHighlight,
  TabsHighlightItem,
  TabsList,
  TabsTrigger,
} from '@animate-ui/react/primitives/tabs';
import { useAuth } from '../hooks/useAuth';
import { useMisReportes } from '../hooks/useMisReportes';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ESTADOS_REPORTE } from '../utils/constants';
import { formatRelativeTime, formatDateTime } from '../utils/formatters';
import { User, Mail, Shield, LogOut, Lock, Calendar, FileText, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const Perfil: React.FC = () => {
  const { user, logout } = useAuth();
  const { reportes, isLoading, error, refetch } = useMisReportes();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  if (!user) {
    return (
      <AppShell title="Perfil">
        <div className="flex items-center justify-center py-16">
          <div className="h-24 w-full max-w-xl animate-pulse rounded bg-surface-2" />
        </div>
      </AppShell>
    );
  }

  const initials =
    `${user.nombre?.[0] ?? ''}${user.apellido?.[0] ?? ''}`.toUpperCase() ||
    user.nombre?.[0]?.toUpperCase() ||
    'U';

  const rolLabel =
    user.rol === 'CIUDADANO'
      ? 'Ciudadano'
      : user.rol === 'ADMIN_MUNICIPAL'
        ? 'Administrador Municipal'
        : user.rol.replace('_', ' ');

  return (
    <AppShell
      title="Mi Perfil"
      subtitle="Gestiona tu información de cuenta"
    >
      <div className="mx-auto max-w-3xl space-y-5">
        <Effect fade slide={{ direction: 'up', offset: 18 }} inView>
          <Shine
            enableOnHover
            color="rgba(212,245,140,0.28)"
            className="auth-profile-hero"
          >
            <div className="flex items-center gap-5">
              <div className="auth-avatar auth-avatar-lg" aria-hidden>
                {initials}
              </div>
              <div>
                <p className="auth-kicker mb-2">Cuenta</p>
                <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-text">
                  {user.nombre} {user.apellido}
                </h2>
                <p className="mt-1 text-text-secondary">{user.email}</p>
                <span className="mt-3 inline-block rounded bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-ink">
                  {rolLabel}
                </span>
              </div>
            </div>
          </Shine>
        </Effect>

        <Effect fade slide={{ direction: 'up', offset: 14 }} delay={0.05} inView>
          <Tabs defaultValue="reportes" className="auth-profile-tabs">
            <TabsHighlight className="mb-5 rounded-full border border-line bg-surface p-1">
              <TabsList className="flex flex-wrap gap-1">
                <TabsHighlightItem value="reportes">
                  <TabsTrigger
                    value="reportes"
                    className="rounded-full px-4 py-2.5 text-sm font-medium text-text-secondary data-[state=active]:bg-accent/15 data-[state=active]:text-accent data-[state=active]:border data-[state=active]:border-accent/30 transition-all duration-200"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Mis reportes
                    {reportes.length > 0 && (
                      <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent">
                        {reportes.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsHighlightItem>
                <TabsHighlightItem value="datos">
                  <TabsTrigger
                    value="datos"
                    className="rounded-full px-4 py-2.5 text-sm font-medium text-text-secondary data-[state=active]:bg-accent/15 data-[state=active]:text-accent data-[state=active]:border data-[state=active]:border-accent/30 transition-all duration-200"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Datos de la cuenta
                  </TabsTrigger>
                </TabsHighlightItem>
                <TabsHighlightItem value="seguridad">
                  <TabsTrigger
                    value="seguridad"
                    className="rounded-full px-4 py-2.5 text-sm font-medium text-text-secondary data-[state=active]:bg-accent/15 data-[state=active]:text-accent data-[state=active]:border data-[state=active]:border-accent/30 transition-all duration-200"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Seguridad
                  </TabsTrigger>
                </TabsHighlightItem>
              </TabsList>
            </TabsHighlight>

            <TabsContents>
              <TabsContent value="reportes" className="outline-none">
                <Effect fade slide={{ direction: 'up', offset: 8 }} inView>
                  {error && (
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded border border-error/30 bg-error/10 p-3 text-sm text-error">
                      <p>{error}</p>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => refetch()}
                      >
                        Reintentar
                      </Button>
                    </div>
                  )}

                  {isLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-20 animate-pulse rounded bg-surface-2"
                        />
                      ))}
                    </div>
                  ) : reportes.length === 0 ? (
                    <div className="auth-empty-card py-10 text-center">
                      <p className="mb-4 text-text-secondary">
                        Aún no tienes reportes. Crea el primero.
                      </p>
                      <Magnetic strength={0.2} onlyOnHover>
                        <Link to="/informes/crear">
                          <Shine
                            enableOnHover
                            color="rgba(212,245,140,0.3)"
                            className="inline-block"
                          >
                            <Button>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Crear reporte
                            </Button>
                          </Shine>
                        </Link>
                      </Magnetic>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {reportes.map((reporte) => (
                        <li key={reporte.id}>
                          <Magnetic strength={0.1} onlyOnHover>
                            <Shine
                              enableOnHover
                              color="rgba(212,245,140,0.15)"
                              className="block"
                            >
                              <Link
                                to={`/reportes/${reporte.id}`}
                                className="auth-info-row transition-colors hover:border-accent/40"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-medium text-text">
                                    {reporte.titulo}
                                  </p>
                                  <p className="text-xs text-text-muted">
                                    {formatRelativeTime(reporte.fechaCreacion)}
                                  </p>
                                </div>
                                <StatusBadge
                                  estado={
                                    reporte.estadoActual as keyof typeof ESTADOS_REPORTE
                                  }
                                  showIcon={false}
                                />
                              </Link>
                            </Shine>
                          </Magnetic>
                        </li>
                      ))}
                    </ul>
                  )}
                </Effect>
              </TabsContent>

              <TabsContent value="datos" className="outline-none">
                <Effect fade slide={{ direction: 'up', offset: 8 }} inView>
                  <div className="auth-profile-grid">
                    <Magnetic strength={0.08} onlyOnHover>
                      <Shine
                        enableOnHover
                        color="rgba(212,245,140,0.12)"
                        className="block"
                      >
                        <div className="auth-info-row">
                          <User className="h-5 w-5 shrink-0 text-accent" />
                          <div>
                            <p className="text-xs uppercase tracking-wider text-text-muted">
                              Nombre
                            </p>
                            <p className="font-medium text-text">{user.nombre}</p>
                          </div>
                        </div>
                      </Shine>
                    </Magnetic>
                    {user.apellido && (
                      <Magnetic strength={0.08} onlyOnHover>
                        <Shine
                          enableOnHover
                          color="rgba(212,245,140,0.12)"
                          className="block"
                        >
                          <div className="auth-info-row">
                            <User className="h-5 w-5 shrink-0 text-accent" />
                            <div>
                              <p className="text-xs uppercase tracking-wider text-text-muted">
                                Apellido
                              </p>
                              <p className="font-medium text-text">{user.apellido}</p>
                            </div>
                          </div>
                        </Shine>
                      </Magnetic>
                    )}
                    <Magnetic strength={0.08} onlyOnHover>
                      <Shine
                        enableOnHover
                        color="rgba(212,245,140,0.12)"
                        className="block"
                      >
                        <div className="auth-info-row">
                          <Mail className="h-5 w-5 shrink-0 text-accent" />
                          <div>
                            <p className="text-xs uppercase tracking-wider text-text-muted">
                              Email
                            </p>
                            <p className="font-medium text-text">{user.email}</p>
                          </div>
                        </div>
                      </Shine>
                    </Magnetic>
                    <Magnetic strength={0.08} onlyOnHover>
                      <Shine
                        enableOnHover
                        color="rgba(212,245,140,0.12)"
                        className="block"
                      >
                        <div className="auth-info-row">
                          <Shield className="h-5 w-5 shrink-0 text-accent" />
                          <div>
                            <p className="text-xs uppercase tracking-wider text-text-muted">
                              Rol
                            </p>
                            <p className="font-medium text-text">{rolLabel}</p>
                          </div>
                        </div>
                      </Shine>
                    </Magnetic>
                    {user.fechaRegistro && (
                      <Magnetic strength={0.08} onlyOnHover>
                        <Shine
                          enableOnHover
                          color="rgba(212,245,140,0.12)"
                          className="block"
                        >
                          <div className="auth-info-row">
                            <Calendar className="h-5 w-5 shrink-0 text-accent" />
                            <div>
                              <p className="text-xs uppercase tracking-wider text-text-muted">
                                Fecha de registro
                              </p>
                              <p className="font-medium text-text">
                                {formatDateTime(user.fechaRegistro)}
                              </p>
                            </div>
                          </div>
                        </Shine>
                      </Magnetic>
                    )}
                  </div>
                  <Magnetic strength={0.15} onlyOnHover>
                    <Shine
                      enableOnHover
                      color="rgba(212,245,140,0.25)"
                      className="inline-block"
                    >
                      <Button
                        variant="secondary"
                        className="mt-4 w-full justify-start"
                        onClick={() =>
                          toast('Función de edición de perfil próximamente')
                        }
                      >
                        <User className="mr-3 h-5 w-5" />
                        Editar perfil
                      </Button>
                    </Shine>
                  </Magnetic>
                </Effect>
              </TabsContent>

              <TabsContent value="seguridad" className="outline-none">
                <Effect fade slide={{ direction: 'up', offset: 8 }} inView>
                  <div className="auth-empty-card space-y-3 p-5 relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/5 blur-3xl" />
                    <div className="relative">
                      <h3 className="font-heading text-lg uppercase tracking-tight text-text">
                        Seguridad
                      </h3>
                      <Magnetic strength={0.12} onlyOnHover>
                        <Shine
                          enableOnHover
                          color="rgba(212,245,140,0.2)"
                          className="block"
                        >
                          <Button
                            variant="secondary"
                            className="w-full justify-start"
                            onClick={() =>
                              toast('Función de cambio de contraseña próximamente')
                            }
                          >
                            <Lock className="mr-3 h-5 w-5" />
                            Cambiar contraseña
                          </Button>
                        </Shine>
                      </Magnetic>
                      <Magnetic strength={0.12} onlyOnHover>
                        <Shine
                          enableOnHover
                          color="rgba(239,68,68,0.15)"
                          className="block"
                        >
                          <Button
                            variant="danger"
                            className="w-full justify-start"
                            onClick={handleLogout}
                          >
                            <LogOut className="mr-3 h-5 w-5" />
                            Cerrar sesión
                          </Button>
                        </Shine>
                      </Magnetic>
                    </div>
                  </div>
                </Effect>
              </TabsContent>
            </TabsContents>
          </Tabs>
        </Effect>
      </div>
    </AppShell>
  );
};
