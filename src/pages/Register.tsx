import React from 'react';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import type { RegisterRequestDTO } from '../types/auth.types';
import toast from 'react-hot-toast';

export const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      const registerData: RegisterRequestDTO = {
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        rol: 'CIUDADANO',
      };
      await registerUser(registerData);
      toast.success('Registro exitoso');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Únete a UrbanFix para reportar problemas urbanos
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              label="Nombre Completo"
              type="text"
              {...register('nombre', { 
                required: 'Nombre es requerido',
                minLength: {
                  value: 3,
                  message: 'Mínimo 3 caracteres'
                }
              })}
              error={errors.nombre?.message as string}
            />
            
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
            
            <Input
              label="Confirmar Contraseña"
              type="password"
              {...register('confirmPassword', { 
                required: 'Confirmar contraseña es requerida',
                validate: (value: string, formValues: any) => 
                  value === formValues.password || 'Las contraseñas no coinciden'
              })}
              error={errors.confirmPassword?.message as string}
            />
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full"
          >
            Registrarse
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-500">
                Inicia Sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
