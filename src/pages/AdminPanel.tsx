import React, { useState } from 'react';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import { CountingNumber } from '@animate-ui/react/primitives/texts/counting-number';
import { Shine } from '@animate-ui/react/primitives/effects/shine';
import { Magnetic } from '@animate-ui/react/primitives/effects/magnetic';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AppShell } from '../components/layout/AppShell';
import { useCategorias } from '../hooks/useCategorias';
import { useZonas } from '../hooks/useZonas';
import { useReportes } from '../hooks/useReportes';
import { authApi } from '../api/auth';
import { Settings, Users, FileText, Map, Plus, X, Sparkles } from 'lucide-react';
import { useForm } from '../hooks/useForm';
import type { Rol } from '../types/auth.types';
import toast from 'react-hot-toast';

export const AdminPanel: React.FC = () => {
  const { categorias } = useCategorias();
  const { zonas } = useZonas();
  const { reportes } = useReportes();
  const [showCreateUser, setShowCreateUser] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const roles: Rol[] = [
    'CIUDADANO',
    'ADMIN_MUNICIPAL',
    'TECNICO',
    'SUPERVISOR',
    'OPERADOR',
    'AUDITOR',
  ];

  const onCreateUser = async (data: Record<string, unknown>) => {
    try {
      await authApi.createUserAsAdmin(data);
      toast.success('Usuario creado exitosamente');
      reset();
      setShowCreateUser(false);
    } catch (error: unknown) {
      let errorMessage = 'Error al crear usuario';
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message
      ) {
        errorMessage = (error as { response?: { data?: { message?: string } } }).response!.data!.message!;
      }
      toast.error(errorMessage);
    }
  };

  const stats = [
    {
      title: 'Total Reportes',
      value: reportes.length,
      icon: FileText,
      tone: 'accent' as const,
    },
    {
      title: 'Categorías',
      value: categorias.length,
      icon: Users,
      tone: 'success' as const,
    },
    {
      title: 'Zonas',
      value: zonas.length,
      icon: Map,
      tone: 'info' as const,
    },
    {
      title: 'Usuarios Activos',
      value: null as number | null,
      icon: Settings,
      tone: 'warning' as const,
      display: '—',
    },
  ];

  return (
    <AppShell
      title="Administración"
      subtitle="Gestión municipal de usuarios, categorías y zonas"
      action={
        <Magnetic strength={0.2} onlyOnHover>
          <Shine
            enableOnHover
            color="rgba(11,99,255,0.35)"
            className="inline-flex"
          >
            <Button
              onClick={() => setShowCreateUser((v) => !v)}
              className="inline-flex items-center"
            >
              {showCreateUser ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Usuario
                  <Sparkles className="ml-2 h-3 w-3 text-accent/60" />
                </>
              )}
            </Button>
          </Shine>
        </Magnetic>
      }
    >
      <div className="space-y-6 sm:space-y-8">
        <Effect fade slide={{ direction: 'up', offset: 16 }} inView>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Effect
                key={stat.title}
                fade
                slide={{ direction: 'up', offset: 16 }}
                delay={0.05 * index}
                inView
              >
                <Magnetic strength={0.15} onlyOnHover>
                  <Shine
                    enableOnHover
                    color="rgba(11,99,255,0.25)"
                    className="block"
                  >
                    <article className={`auth-stat-card tone-${stat.tone} relative overflow-hidden`}>
                      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-current opacity-5 blur-2xl" />
                      <div className="relative flex items-start justify-between gap-3">
                        <div>
                          <p className="auth-stat-label text-xs">{stat.title}</p>
                          {stat.display != null ? (
                            <p className="auth-stat-value text-xl">{stat.display}</p>
                          ) : (
                            <CountingNumber
                              number={stat.value ?? 0}
                              className="auth-stat-value text-xl"
                              inView
                            />
                          )}
                        </div>
                        <stat.icon className="auth-stat-icon h-5 w-5" aria-hidden />
                      </div>
                    </article>
                  </Shine>
                </Magnetic>
              </Effect>
            ))}
          </div>
        </Effect>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-10">
            <Effect fade slide={{ direction: 'up', offset: 14 }} delay={0.05} inView>
              <Magnetic strength={0.08} onlyOnHover>
                <Shine
                  enableOnHover
                  color="rgba(11,99,255,0.12)"
                  className="block"
                >
                  <div className="auth-filter-panel h-full relative overflow-hidden">
                    <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/5 blur-3xl" />
                    <div className="relative">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="auth-section-title">Gestión de Usuarios</h2>
                        <Button
                          size="sm"
                          variant={showCreateUser ? 'secondary' : 'primary'}
                          onClick={() => setShowCreateUser((v) => !v)}
                          className="inline-flex items-center md:hidden"
                        >
                          {showCreateUser ? 'Cancelar' : 'Crear'}
                        </Button>
                      </div>

                  {showCreateUser && (
                    <form
                      onSubmit={handleSubmit(onCreateUser)}
                      className="mb-2 space-y-4 rounded border border-line bg-surface-2 p-4"
                    >
                      <Input
                        label="Nombre"
                        {...register('nombre', { required: 'Nombre es requerido' })}
                        error={errors.nombre?.message as string}
                      />
                      <Input
                        label="Apellido"
                        {...register('apellido', {
                          required: 'Apellido es requerido',
                        })}
                        error={errors.apellido?.message as string}
                      />
                      <Input
                        label="Email"
                        type="email"
                        {...register('email', {
                          required: 'Email es requerido',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Email inválido',
                          },
                        })}
                        error={errors.email?.message as string}
                      />
                      <Input
                        label="Contraseña"
                        type="password"
                        {...register('password', {
                          required: 'Contraseña es requerida',
                          minLength: {
                            value: 8,
                            message: 'Mínimo 8 caracteres',
                          },
                        })}
                        error={errors.password?.message as string}
                      />
                      <div>
                        <label className="mb-2 block text-sm font-medium text-text">
                          Rol
                        </label>
                        <select
                          {...register('rol', { required: 'Rol es requerido' })}
                          className="auth-select"
                        >
                          <option value="">Selecciona un rol</option>
                          {roles.map((rol) => (
                            <option key={rol} value={rol}>
                              {rol.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                        {errors.rol && (
                          <p className="mt-2 text-sm text-error">
                            {errors.rol.message as string}
                          </p>
                        )}
                      </div>
                      <Button type="submit" isLoading={isSubmitting} className="w-full">
                        {isSubmitting ? 'Creando…' : 'Crear Usuario'}
                      </Button>
                    </form>
                  )}

                  {!showCreateUser && (
                    <p className="text-sm text-text-secondary">
                      Crea cuentas municipales con rol y credenciales iniciales.
                    </p>
                  )}
                      </div>
                    </div>
                  </Shine>
                </Magnetic>
              </Effect>

              <Effect
                fade
                slide={{ direction: 'up', offset: 14 }}
                delay={0.1}
                inView
              >
                <Magnetic strength={0.08} onlyOnHover>
                  <Shine
                    enableOnHover
                    color="rgba(11,99,255,0.12)"
                    className="block"
                  >
                    <div className="auth-filter-panel relative overflow-hidden">
                      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/5 blur-3xl" />
                      <div className="relative">
                        <h2 className="auth-section-title mb-4">Zonas</h2>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {zonas.map((zona, index) => (
                            <Effect
                              key={zona.id}
                              fade
                              slide={{ direction: 'up', offset: 8 }}
                              delay={0.02 * index}
                              inView
                            >
                              <div className="auth-info-row justify-between">
                                <span className="text-sm text-text">{zona.nombre}</span>
                                <span className="text-xs uppercase tracking-wide text-text-muted">
                                  #{zona.id}
                                </span>
                              </div>
                            </Effect>
                          ))}
                          {zonas.length === 0 && (
                            <p className="col-span-full py-6 text-center text-sm text-text-muted">
                              No hay zonas
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Shine>
                </Magnetic>
              </Effect>
            </div>

          <Effect fade slide={{ direction: 'up', offset: 14 }} delay={0.08} inView>
            <Magnetic strength={0.08} onlyOnHover>
              <Shine
                enableOnHover
                color="rgba(11,99,255,0.12)"
                className="block"
              >
                <div className="auth-filter-panel h-full relative overflow-hidden">
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/5 blur-3xl" />
                  <div className="relative">
                    <h2 className="auth-section-title mb-4">Categorías</h2>
                    <div className="space-y-2">
                      {categorias.map((cat, index) => (
                        <Effect
                          key={cat.id}
                          fade
                          slide={{ direction: 'up', offset: 8 }}
                          delay={0.03 * index}
                          inView
                        >
                          <div className="auth-info-row justify-between">
                            <span className="text-sm text-text">{cat.nombre}</span>
                            <span className="text-xs uppercase tracking-wide text-text-muted">
                              #{cat.id}
                            </span>
                          </div>
                        </Effect>
                      ))}
                      {categorias.length === 0 && (
                        <p className="py-6 text-center text-sm text-text-muted">
                          No hay categorías
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Shine>
            </Magnetic>
          </Effect>
        </div>
      </div>
    </AppShell>
  );
};
