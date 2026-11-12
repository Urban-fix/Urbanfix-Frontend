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
import { ThumbsUp, MapPin, Calendar, User, ArrowLeft } from 'lucide-react';
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
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState('');

  const puedeCambiarEstado =
    user?.rol === 'ADMIN_MUNICIPAL' ||
    user?.rol === 'TECNICO' ||
    user?.rol === 'SUPERVISOR';

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
      await api.post(`/api/v1/reportes/${id}/confirmaciones`);
      toast.success('Reporte confirmado');
      setHasConfirmed(true);
      fetchReporte();
    } catch {
      toast.error('Error al confirmar reporte');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await api.post(`/api/v1/reportes/${id}/comentarios`, {
        contenido: comment,
      });
      toast.success('Comentario agregado');
      setComment('');
      fetchReporte();
    } catch {
      toast.error('Error al agregar comentario');
    }
  };

  const handleCambiarEstado = async () => {
    if (!selectedEstado || !id) return;

    try {
      await cambiarEstado(Number(id), selectedEstado);
      toast.success('Estado actualizado');
      setSelectedEstado('');
      fetchReporte();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error al cambiar estado';
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <AppShell title="Detalle" subtitle="Cargando reporte…">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
        </div>
      </AppShell>
    );
  }

  if (!reporte) {
    return (
      <AppShell title="Detalle" subtitle="Reporte no encontrado">
        <div className="auth-empty-card text-center py-14">
          <p className="text-text-muted mb-5">Reporte no encontrado</p>
          <Link to="/informes">
            <Button>Volver a Informes</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={reporte.titulo}
      subtitle="Detalle del reporte ciudadano"
      action={
        <Link to="/informes">
          <Button variant="secondary" className="inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
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
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <StatusBadge
                  estado={
                    reporte.estadoActual as keyof typeof ESTADOS_REPORTE
                  }
                />
                <p className="text-sm text-text-muted inline-flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4" />
                  {reporte.confirmacionesCount} confirmaciones
                </p>
              </div>

              <p className="text-text-muted leading-relaxed mb-6">
                {reporte.descripcion}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <div className="auth-info-row">
                  <User className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-sm text-text">
                    {reporte.usuario.nombre}
                  </span>
                </div>
                <div className="auth-info-row">
                  <MapPin className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-sm text-text">{reporte.zona.nombre}</span>
                </div>
                <div className="auth-info-row">
                  <Calendar className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-sm text-text">
                    {formatDateTime(reporte.fechaCreacion)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleConfirm}
                  disabled={hasConfirmed}
                  variant={hasConfirmed ? 'secondary' : 'primary'}
                  className="inline-flex items-center"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  {hasConfirmed ? 'Confirmado' : 'Confirmar'}
                </Button>
              </div>

              {puedeCambiarEstado && (
                <div className="mt-6 pt-6 border-t border-line">
                  <h3 className="font-heading uppercase text-text mb-3">
                    Cambiar estado
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
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
                      disabled={!selectedEstado}
                    >
                      Actualizar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </article>
        </Effect>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Effect fade slide={{ direction: 'up', offset: 14 }} delay={0.05} inView>
            <div className="auth-filter-panel h-full">
              <h2 className="auth-section-title mb-4">
                Comentarios ({reporte.comentarios.length})
              </h2>

              <form onSubmit={handleAddComment} className="mb-6">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escribe un comentario…"
                  className="w-full px-3 py-2.5 border border-line rounded bg-surface-2 text-text focus:outline-none focus:ring-2 focus:ring-accent mb-3"
                  rows={3}
                />
                <Button type="submit" size="sm">
                  Agregar comentario
                </Button>
              </form>

              <div className="space-y-3">
                {reporte.comentarios.length === 0 ? (
                  <p className="text-text-muted text-center py-4 text-sm">
                    No hay comentarios aún
                  </p>
                ) : (
                  reporte.comentarios.map((comentario) => (
                    <CommentItem key={comentario.id} comentario={comentario} />
                  ))
                )}
              </div>
            </div>
          </Effect>

          <Effect fade slide={{ direction: 'up', offset: 14 }} delay={0.1} inView>
            <div className="auth-filter-panel h-full">
              <h2 className="auth-section-title mb-4">Historial de estados</h2>

              {reporte.historialEstados.length === 0 ? (
                <p className="text-text-muted text-center py-4 text-sm">
                  No hay historial
                </p>
              ) : (
                <div className="space-y-4">
                  {reporte.historialEstados.map((historial) => (
                    <div
                      key={historial.id}
                      className="border-l-2 border-accent pl-4"
                    >
                      <p className="font-medium text-text uppercase text-sm tracking-wide">
                        {historial.estado.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-text-muted mt-0.5">
                        {formatDateTime(historial.fechaCambio)}
                      </p>
                      <p className="text-sm text-text-muted">
                        Por: {historial.usuario.nombre}
                      </p>
                    </div>
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
