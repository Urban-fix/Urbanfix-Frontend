import React from 'react';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Ingresa tus credenciales para acceder
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
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

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full"
          >
            Iniciar Sesión
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-500">
                Regístrate
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
