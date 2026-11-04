import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/axios';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CommentItem } from '../components/common/CommentItem';
import { ESTADO_COLORS } from '../utils/constants';
import { formatDateTime } from '../utils/formatters';
import { ThumbsUp, MapPin, Calendar, User, ArrowLeft } from 'lucide-react';
import type { ReporteDetailDTO } from '../types/reporte.types';
import toast from 'react-hot-toast';

export const ReporteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reporte, setReporte] = useState<ReporteDetailDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [hasConfirmed, setHasConfirmed] = useState(false);

  useEffect(() => {
    fetchReporte();
  }, [id]);

  const fetchReporte = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ReporteDetailDTO>(`/reportes/${id}/detalle`);
      setReporte(response.data);
    } catch (error) {
      toast.error('Error al cargar el reporte');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      await api.post(`/reportes/${id}/confirmaciones`);
      toast.success('Reporte confirmado');
      setHasConfirmed(true);
      fetchReporte();
    } catch (error) {
      toast.error('Error al confirmar reporte');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await api.post(`/reportes/${id}/comentarios`, { contenido: comment });
      toast.success('Comentario agregado');
      setComment('');
      fetchReporte();
    } catch (error) {
      toast.error('Error al agregar comentario');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reporte) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Reporte no encontrado</p>
        <Link to="/reportes">
          <Button className="mt-4">Volver a Reportes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link to="/reportes" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Link>

      <Card className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{reporte.titulo}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${ESTADO_COLORS[reporte.estadoActual]}`}>
            {reporte.estadoActual.replace('_', ' ')}
          </span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6">{reporte.descripcion}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <User className="w-5 h-5" />
            <span>{reporte.usuario.nombre}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <MapPin className="w-5 h-5" />
            <span>{reporte.zona.nombre}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Calendar className="w-5 h-5" />
            <span>{formatDateTime(reporte.fechaCreacion)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            onClick={handleConfirm}
            disabled={hasConfirmed}
            variant={hasConfirmed ? 'secondary' : 'primary'}
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            {hasConfirmed ? 'Confirmado' : 'Confirmar'}
          </Button>
          <span className="text-gray-600 dark:text-gray-400">
            {reporte.confirmacionesCount} confirmaciones
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Comentarios ({reporte.comentarios.length})
          </h2>
          
          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-2"
              rows={3}
            />
            <Button type="submit" size="sm">Agregar Comentario</Button>
          </form>

          <div className="space-y-3">
            {reporte.comentarios.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay comentarios aún</p>
            ) : (
              reporte.comentarios.map(comentario => (
                <CommentItem key={comentario.id} comentario={comentario} />
              ))
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Historial de Estados
          </h2>
          
          {reporte.historialEstados.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay historial</p>
          ) : (
            <div className="space-y-3">
              {reporte.historialEstados.map(historial => (
                <div key={historial.id} className="border-l-2 border-blue-500 pl-4">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {historial.estado.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDateTime(historial.fechaCambio)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Por: {historial.usuario.nombre}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
