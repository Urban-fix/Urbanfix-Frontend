import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import { api } from '../api/axios';
import { Button } from '../components/ui/Button';
import { AppShell } from '../components/layout/AppShell';
import { StatusBadge } from '../components/ui/StatusBadge';
import { CommentItem } from '../components/common/CommentItem';
import { ESTADOS_REPORTE } from '../utils/constants';
import { formatDateTime } from '../utils/formatters';
import {
  ThumbsUp,
  MapPin,
  Calendar,
  User,
  ArrowLeft,
  Pencil,
  MessageSquare,
  History,
} from 'lucide-react';
import type { ReporteDetailDTO } from '../types/reporte.types';
import { useAuth } from '../hooks/useAuth';
import { useReportes } from '../hooks/useReportes';
import { homeImages } from '../utils/homeMedia';
import toast from 'react-hot-toast';

export const ReporteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { cambiarEstado } = useReportes();
  const [reporte, setReporte] = useState<ReporteDetailDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState('');
  const [isUpdatingEstado, setIsUpdatingEstado] = useState(false);

  const puedeCambiarEstado =
    user?.rol === 'ADMIN_MUNICIPAL' ||
    user?.rol === 'TECNICO' ||
    user?.rol === 'SUPERVISOR';

  const esDueno = user != null && reporte?.usuario?.id === user.id;

  useEffect(() => {
    fetchReporte();
  }, [id]);

  const fetchReporte = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ReporteDetailDTO>(
        `/api/v1/reportes/${id}/detalle`
      );
      setReporte(response.data);

      if (user && response.data.confirmaciones) {
        setHasConfirmed(
          response.data.confirmaciones.some((c) => c.id === user.id)
        );
      }
    } catch {
      toast.error('Error al cargar el reporte');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      await api.post(`/api/v1/reportes/${id}/confirmaciones`);
      toast.success('Reporte confirmado');
      setHasConfirmed(true);
      fetchReporte();
    } catch {
      toast.error('Error al confirmar reporte');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setIsCommenting(true);
      await api.post(`/api/v1/reportes/${id}/comentarios`, {
        contenido: comment,
      });
      toast.success('Comentario agregado');
      setComment('');
      fetchReporte();
    } catch {
      toast.error('Error al agregar comentario');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleCambiarEstado = async () => {
    if (!selectedEstado || !id) return;

    try {
      setIsUpdatingEstado(true);
      await cambiarEstado(Number(id), selectedEstado);
      toast.success('Estado actualizado');
      setSelectedEstado('');
      fetchReporte();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error al cambiar estado';
      toast.error(message);
    } finally {
      setIsUpdatingEstado(false);
    }
  };

  if (isLoading) {
    return (
      <AppShell title="Detalle" subtitle="Cargando reporte…">
        <div className="flex items-center justify-center py-16">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-accent" />
        </div>
      </AppShell>
    );
  }

  if (!reporte) {
    return (
      <AppShell title="Detalle" subtitle="Reporte no encontrado">
        <div className="auth-empty-card py-14 text-center">
          <p className="mb-5 text-text-muted">Reporte no encontrado</p>
          <Link to="/informes">
            <Button>Volver a Informes</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const shortTitle =
    reporte.titulo.length > 42
      ? `${reporte.titulo.slice(0, 42)}…`
      : reporte.titulo;

  return (
    <AppShell
      title={shortTitle}
      subtitle="Detalle del reporte ciudadano"
      action={
        <div className="flex items-center gap-2">
          {esDueno && (
            <Link to={`/reportes/${reporte.id}/editar`}>
              <Button variant="secondary" className="inline-flex items-center">
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </Link>
          )}
          <Link to="/informes">
            <Button variant="secondary" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        <Effect fade slide={{ direction: 'up', offset: 16 }} inView>
          <article className="auth-report-card overflow-hidden">
            <div className="auth-report-media !h-56 md:!h-72">
              <img
                src={reporte.fotoUrl || homeImages.baches}
                alt={reporte.titulo}
              />
            </div>
            <div className="p-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-heading text-xl uppercase tracking-tight text-text md:text-2xl">
                    {reporte.titulo}
                  </h2>
                  <div className="mt-2">
                    <StatusBadge
                      estado={
                        reporte.estadoActual as keyof typeof ESTADOS_REPORTE
                      }
                    />
                  </div>
                </div>
                <p className="inline-flex items-center gap-1.5 text-sm text-text-muted">
                  <ThumbsUp className="h-4 w-4 text-accent" />
                  {reporte.confirmacionesCount} confirmaciones
                </p>
              </div>

              <p className="mb-6 leading-relaxed text-text-secondary">
                {reporte.descripcion}
              </p>

              <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="auth-info-row">
                  <User className="h-4 w-4 shrink-0 text-accent" />
                  <span className="text-sm text-text">
                    {reporte.usuario.nombre}
                  </span>
                </div>
                <div className="auth-info-row">
                  <MapPin className="h-4 w-4 shrink-0 text-accent" />
                  <span className="text-sm text-text">{reporte.zona.nombre}</span>
                </div>
                <div className="auth-info-row">
                  <Calendar className="h-4 w-4 shrink-0 text-accent" />
                  <span className="text-sm text-text">
                    {formatDateTime(reporte.fechaCreacion)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleConfirm}
                  disabled={hasConfirmed || isConfirming}
                  isLoading={isConfirming}
                  variant={hasConfirmed ? 'secondary' : 'primary'}
                  className="inline-flex items-center"
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {hasConfirmed ? 'Confirmado' : 'Confirmar'}
                </Button>
                {esDueno && (
                  <Link to={`/reportes/${reporte.id}/editar`} className="md:hidden">
                    <Button variant="secondary" className="inline-flex items-center">
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </Link>
                )}
              </div>

              {puedeCambiarEstado && (
                <div className="mt-6 border-t border-line pt-6">
                  <h3 className="mb-3 font-heading uppercase text-text">
                    Cambiar estado
                  </h3>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <select
                      value={selectedEstado}
                      onChange={(e) => setSelectedEstado(e.target.value)}
                      className="auth-select flex-1"
                    >
                      <option value="">Seleccionar nuevo estado</option>
                      {Object.values(ESTADOS_REPORTE).map((estado) => (
                        <option key={estado} value={estado}>
                          {estado.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                    <Button
                      onClick={handleCambiarEstado}
                      disabled={!selectedEstado || isUpdatingEstado}
                      isLoading={isUpdatingEstado}
                    >
                      Actualizar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </article>
        </Effect>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Effect
            fade
            slide={{ direction: 'up', offset: 14 }}
            delay={0.05}
            inView
          >
            <div className="auth-filter-panel h-full">
              <h2 className="auth-section-title mb-4 inline-flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-accent" />
                Comentarios ({reporte.comentarios.length})
              </h2>

              <form onSubmit={handleAddComment} className="mb-6">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escribe un comentario…"
                  className="auth-textarea mb-3"
                  rows={3}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!comment.trim() || isCommenting}
                  isLoading={isCommenting}
                >
                  Agregar comentario
                </Button>
              </form>

              <div className="space-y-3">
                {reporte.comentarios.length === 0 ? (
                  <p className="py-4 text-center text-sm text-text-muted">
                    No hay comentarios aún
                  </p>
                ) : (
                  reporte.comentarios.map((comentario, index) => (
                    <CommentItem
                      key={comentario.id}
                      comentario={comentario}
                      index={index}
                    />
                  ))
                )}
              </div>
            </div>
          </Effect>

          <Effect
            fade
            slide={{ direction: 'up', offset: 14 }}
            delay={0.1}
            inView
          >
            <div className="auth-filter-panel h-full">
              <h2 className="auth-section-title mb-4 inline-flex items-center gap-2">
                <History className="h-5 w-5 text-accent" />
                Historial de estados
              </h2>

              {reporte.historialEstados.length === 0 ? (
                <p className="py-4 text-center text-sm text-text-muted">
                  No hay historial
                </p>
              ) : (
                <div className="space-y-4">
                  {reporte.historialEstados.map((historial, index) => (
                    <Effect
                      key={historial.id}
                      fade
                      slide={{ direction: 'up', offset: 8 }}
                      delay={0.04 * index}
                      inView
                    >
                      <div className="auth-timeline-item">
                        <div className="mb-1">
                          <StatusBadge
                            estado={
                              historial.estado as keyof typeof ESTADOS_REPORTE
                            }
                            showIcon={false}
                          />
                        </div>
                        <p className="mt-1 text-sm text-text-muted">
                          {formatDateTime(historial.fechaCambio)}
                        </p>
                        <p className="text-sm text-text-secondary">
                          Por: {historial.usuario.nombre}
                        </p>
                      </div>
                    </Effect>
                  ))}
                </div>
              )}
            </div>
          </Effect>
        </div>
      </div>
    </AppShell>
  );
};
