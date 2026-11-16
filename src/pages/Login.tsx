import React from 'react';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AuthLayout } from '../components/layout/AuthLayout';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange' // Validar en cada cambio para detectar autocompletado de Chrome
  });
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    console.log('[LOGIN] handleSubmit ejecutado');
    console.log('[LOGIN] email presente:', !!data.email);
    console.log('[LOGIN] password presente:', !!data.password);
    console.log('[LOGIN] errores de validación:', Object.keys(errors));
    
    try {
      console.log('[LOGIN] iniciando petición de login');
      const loggedUser = await login(data.email, data.password);
      console.log('[LOGIN] login exitoso, redirigiendo a:', loggedUser?.rol === 'ADMIN_MUNICIPAL' ? '/admin' : '/dashboard');
      toast.success('Login exitoso');
      
      // Redirigir según rol
      if (loggedUser?.rol === 'ADMIN_MUNICIPAL') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.log('[LOGIN] error en login:', error.response?.status, error.response?.data?.message);
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      toast.error(errorMessage);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      await googleLogin(credentialResponse.credential);
      toast.success('Login con Google exitoso');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Error al iniciar sesión con Google');
    }
  };

  return (
    <AuthLayout title="Inicia Sesión" subtitle="Ingresa tus credenciales para acceder">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <>
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error('Error al autenticar con Google')}
                theme="filled_black"
                text="signin_with"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-line"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-text-muted">o continúa con</span>
              </div>
            </div>
          </>
        )}
        
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            onAutoComplete={(value) => setValue('email', value)}
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
            autoComplete="current-password"
            onAutoComplete={(value) => setValue('password', value)}
            {...register('password', {
              required: 'Contraseña es requerida',
              minLength: {
                value: 8,
                message: 'Mínimo 8 caracteres'
              }
            })}
            error={errors.password?.message as string}
          />
        </div>

        <div className="flex justify-between items-center">
          <Link
            to="/password-reset/request"
            className="text-sm text-text-muted hover:text-accent transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-text-muted">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="text-accent hover:text-[#E3FFA6] font-medium transition-colors"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
