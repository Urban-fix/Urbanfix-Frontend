import React, { useState, useEffect } from 'react';
import { useForm } from '../hooks/useForm';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AuthLayout } from '../components/layout/AuthLayout';
import { authApi } from '../api/auth';
import toast from 'react-hot-toast';

export const PasswordResetConfirm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutos en segundos
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsExpired(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendCode = async () => {
    try {
      await authApi.requestPasswordReset(email);
      toast.success('Nuevo código enviado');
      setTimeLeft(120);
      setIsExpired(false);
    } catch (error: any) {
      toast.error('Si el email existe, recibirás un código en tu correo');
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await authApi.confirmPasswordReset(data.code, data.newPassword);
      toast.success('Contraseña actualizada exitosamente');
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al restablecer contraseña';
      
      // Manejo específico de errores del backend
      if (errorMessage.includes('inválido') || errorMessage.includes('incorrecto')) {
        toast.error('El código ingresado es incorrecto');
      } else if (errorMessage.includes('expirado')) {
        toast.error('El código ha expirado. Solicita uno nuevo');
        setIsExpired(true);
      } else if (errorMessage.includes('intentos')) {
        toast.error('Demasiados intentos. Por favor, solicita un nuevo código');
        setIsExpired(true);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <AuthLayout 
      title="Nueva Contraseña" 
      subtitle="Ingresa el código recibido y tu nueva contraseña"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              label="Código de 6 dígitos"
              type="text"
              maxLength={6}
              {...register('code', { 
                required: 'Código es requerido',
                pattern: {
                  value: /^\d{6}$/,
                  message: 'Debe ser 6 dígitos'
                }
              })}
              error={errors.code?.message as string}
              placeholder="123456"
            />
            <div className={`text-sm font-medium ${isExpired ? 'text-error' : 'text-accent'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          
          {isExpired && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleResendCode}
              className="w-full"
            >
              Reenviar Código
            </Button>
          )}
          
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
          <p className="text-xs text-text-muted mt-1">
            Mínimo 8 caracteres, una mayúscula, una minúscula y un número
          </p>
          
          <Input
            label="Confirmar Contraseña"
            type="password"
            {...register('confirmPassword', { 
              required: 'Confirmar contraseña es requerida',
              validate: (value: string, formValues: any) => 
                value === formValues.newPassword || 'Las contraseñas no coinciden'
            })}
            error={errors.confirmPassword?.message as string}
          />
        </div>

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          {isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-text-muted">
            ¿No recibiste el código?{' '}
            <button
              type="button"
              onClick={handleResendCode}
              className="text-accent hover:text-[#E3FFA6] font-medium transition-colors bg-transparent border-none cursor-pointer"
            >
              Solicitar nuevo código
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
