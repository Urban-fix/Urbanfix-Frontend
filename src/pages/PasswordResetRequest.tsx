import React from 'react';
import { useForm } from '../hooks/useForm';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { RippleButton } from '../components/ui/RippleButton';
import { AuthLayout } from '../components/layout/AuthLayout';
import { authApi } from '../api/auth';
import toast from 'react-hot-toast';

export const PasswordResetRequest: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
    defaultValues: {
      email: ''
    },
    mode: 'onBlur' // Validar al perder foco para evitar conflictos con change event
  });
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await authApi.requestPasswordReset(data.email);
      toast.success('Si el email existe, recibirás un código en tu correo');
      navigate('/password-reset/verify', { state: { email: data.email } });
    } catch (error: any) {
      // Por seguridad, no revelamos si el email existe o no
      toast.error('Si el email existe, recibirás un código en tu correo');
      navigate('/password-reset/verify', { state: { email: data.email } });
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
            autoComplete="email"
            onAutoComplete={(value) => setValue('email', value, { shouldValidate: true, shouldDirty: true })}
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

        <RippleButton
          type="submit"
          className="btn-primary w-full"
          rippleColor="rgba(212, 245, 140, 0.5)"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Código'}
        </RippleButton>

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
