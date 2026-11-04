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
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
      toast.success('Login exitoso');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      await googleLogin(credentialResponse.credential);
      toast.success('Login con Google exitoso');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión con Google');
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
                <span className="px-2 bg-bg text-text-muted">o continúa con</span>
              </div>
            </div>
          </>
        )}
        
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
          
          <Input
            label="Contraseña"
            type="password"
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
          <Link to="/forgot-password" className="text-sm text-text-muted hover:text-text hover:underline transition-colors">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-text-muted">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-text-muted hover:text-text hover:underline transition-colors">
              Regístrate
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
