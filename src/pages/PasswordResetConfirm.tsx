import React, { useEffect } from 'react';
import { useForm } from '../hooks/useForm';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { RippleButton } from '../components/ui/RippleButton';
import { AuthLayout } from '../components/layout/AuthLayout';
import { PasswordRequirements } from '../components/ui/PasswordRequirements';
import { authApi } from '../api/auth';
import toast from 'react-hot-toast';

export const PasswordResetConfirm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const code = location.state?.code || '';
  
  const passwordValue = watch('newPassword', '');
  const confirmPasswordValue = watch('confirmPassword', '');

  // Validar que se tenga el código verificado antes de mostrar el formulario
  useEffect(() => {
    if (!code) {
      toast.error('Código no verificado. Por favor, verifica tu código primero.');
      navigate('/password-reset/request');
    }
  }, [code, navigate]);

  const onSubmit = async (data: any) => {
    try {
      // Validar autorización en backend antes de cambiar contraseña
      await authApi.validatePasswordReset(code);
      
      // Cambiar contraseña
      await authApi.confirmPasswordReset(code, data.newPassword);
      toast.success('Contraseña actualizada exitosamente');
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al restablecer contraseña';
      
      if (errorMessage.includes('inválido') || errorMessage.includes('incorrecto')) {
        toast.error('El código ha expirado o es inválido. Por favor, solicita uno nuevo.');
        navigate('/password-reset/request');
      } else if (errorMessage.includes('expirado')) {
        toast.error('El código ha expirado. Por favor, solicita uno nuevo.');
        navigate('/password-reset/request');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <AuthLayout 
      title="Nueva Contraseña" 
      subtitle="Ingresa tu nueva contraseña"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <Input
            label="Nueva Contraseña"
            type="password"
            {...register('newPassword', { 
              required: 'Contraseña es requerida',
              minLength: {
                value: 8,
                message: 'Mínimo 8 caracteres'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                message: 'Debe incluir mayúscula, minúscula y número'
              }
            })}
            error={errors.newPassword?.message as string}
          />
          <PasswordRequirements password={passwordValue} />
          
          <Input
            label="Confirmar Contraseña"
            type="password"
            {...register('confirmPassword', { 
              required: 'Confirmar contraseña es requerida',
              validate: (value: string) => 
                value === passwordValue || 'Las contraseñas no coinciden'
            })}
            error={errors.confirmPassword?.message as string}
          />
          {confirmPasswordValue && confirmPasswordValue !== passwordValue && (
            <p className="text-xs text-error mt-1">
              Las contraseñas no coinciden
            </p>
          )}
        </div>

        <RippleButton
          type="submit"
          className="btn-primary w-full"
          rippleColor="rgba(11, 99, 255, 0.5)"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña'}
        </RippleButton>

        <div className="text-center">
          <p className="text-sm text-text-muted">
            ¿Recordaste tu contraseña?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-accent hover:text-[#2B77FD] font-medium transition-colors bg-transparent border-none cursor-pointer"
            >
              Inicia Sesión
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
