import React from 'react';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { RippleButton } from '../components/ui/RippleButton';
import { AuthLayout } from '../components/layout/AuthLayout';
import { PasswordRequirements } from '../components/ui/PasswordRequirements';
import { GoogleLogin } from '@react-oauth/google';
import type { RegisterRequestDTO } from '../types/auth.types';
import toast from 'react-hot-toast';

export const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm({
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    mode: 'onBlur' // Validar al perder foco para evitar conflictos con change event
  });
  const { register: registerUser, googleLogin } = useAuth();
  const navigate = useNavigate();
  const passwordValue = watch('password', '');
  const confirmPasswordValue = watch('confirmPassword', '');

  const onSubmit = async (data: any) => {
    try {
      const registerData: RegisterRequestDTO = {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        password: data.password,
        rol: 'CIUDADANO',
      };
      await registerUser(registerData);
      toast.success('Registro exitoso. Por favor inicia sesión.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Error al registrar');
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      await googleLogin(credentialResponse.credential);
      toast.success('Registro con Google exitoso');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Error al registrarse con Google');
    }
  };

  return (
    <AuthLayout title="Crea Tu Cuenta" subtitle="Únete a UrbanFix para reportar problemas urbanos">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <>
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error('Error al autenticar con Google')}
                theme="filled_black"
                text="signup_with"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-line"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-text-muted">o regístrate con</span>
              </div>
            </div>
          </>
        )}
        
        <div className="space-y-4">
          <Input
            label="Nombre"
            type="text"
            {...register('nombre', { 
              required: 'Nombre es requerido',
              minLength: {
                value: 2,
                message: 'Mínimo 2 caracteres'
              }
            })}
            error={errors.nombre?.message as string}
          />
          
          <Input
            label="Apellido"
            type="text"
            {...register('apellido', { 
              required: 'Apellido es requerido',
              minLength: {
                value: 2,
                message: 'Mínimo 2 caracteres'
              }
            })}
            error={errors.apellido?.message as string}
          />
          
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
          
          <Input
            label="Contraseña"
            type="password"
            autoComplete="new-password"
            onAutoComplete={(value) => setValue('password', value, { shouldValidate: true, shouldDirty: true })}
            {...register('password', { 
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
            error={errors.password?.message as string}
          />
          <PasswordRequirements password={passwordValue} />
          
          <Input
            label="Confirmar Contraseña"
            type="password"
            autoComplete="new-password"
            onAutoComplete={(value) => setValue('confirmPassword', value, { shouldValidate: true, shouldDirty: true })}
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
          rippleColor="rgba(212, 245, 140, 0.5)"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </RippleButton>

        <div className="text-center">
          <p className="text-sm text-text-muted">
            ¿Ya tienes cuenta?{' '}
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
