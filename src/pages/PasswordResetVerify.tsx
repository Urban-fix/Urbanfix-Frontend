import React, { useState, useEffect } from 'react';
import { useForm } from '../hooks/useForm';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { RippleButton } from '../components/ui/RippleButton';
import { AuthLayout } from '../components/layout/AuthLayout';
import { authApi } from '../api/auth';
import toast from 'react-hot-toast';

export const PasswordResetVerify: React.FC = () => {
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
      await authApi.validatePasswordReset(data.code);
      toast.success('Código verificado correctamente');
      navigate('/password-reset/confirm', { state: { email, code: data.code } });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al verificar código';
      
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
      title="Verificar Código" 
      subtitle="Ingresa el código de 6 dígitos que recibiste en tu correo"
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
            <RippleButton
              type="button"
              onClick={handleResendCode}
              className="btn-secondary w-full"
              rippleColor="rgba(255, 255, 255, 0.3)"
            >
              Reenviar Código
            </RippleButton>
          )}
        </div>

        <RippleButton
          type="submit"
          className="btn-primary w-full"
          rippleColor="rgba(212, 245, 140, 0.5)"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Verificando...' : 'Verificar Código'}
        </RippleButton>

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

        <div className="text-center">
          <p className="text-sm text-text-muted">
            ¿Recordaste tu contraseña?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-accent hover:text-[#E3FFA6] font-medium transition-colors bg-transparent border-none cursor-pointer"
            >
              Inicia Sesión
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
