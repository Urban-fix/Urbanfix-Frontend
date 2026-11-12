import React from 'react';
import { useForm } from '../hooks/useForm';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AuthLayout } from '../components/layout/AuthLayout';
import { authApi } from '../api/auth';
import toast from 'react-hot-toast';

export const PasswordResetRequest: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await authApi.requestPasswordReset(data.email);
      toast.success('Si el email existe, recibirás un código en tu correo');
      navigate('/password-reset/confirm', { state: { email: data.email } });
    } catch (error: any) {
      // Por seguridad, no revelamos si el email existe o no
      toast.error('Si el email existe, recibirás un código en tu correo');
      navigate('/password-reset/confirm', { state: { email: data.email } });
    }
  };

  return (
    <AuthLayout 
      title="Recuperar Contraseña" 
      subtitle="Ingresa tu correo para recibir un código de recuperación"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            {...register('email', { 
              required: 'Email es requerido',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email inválido'
              }
            })}
            error={errors.email?.message as string}
          />
        </div>

        <p className="text-sm text-text-muted">
          Te enviaremos un código de 6 dígitos válido por 2 minutos.
        </p>

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          {isSubmitting ? 'Enviando...' : 'Enviar Código'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-text-muted">
            ¿Recordaste tu contraseña?{' '}
            <Link
              to="/login"
              className="text-accent hover:text-[#E3FFA6] font-medium transition-colors"
            >
              Inicia Sesión
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
