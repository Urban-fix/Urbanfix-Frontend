import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import { AuthLayout } from '../../components/AuthLayout';
import { Body, Button, Input, LinkText } from '../../components/ui';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import { errorMessage } from '../../api/client';
import { spacing } from '../../theme/tokens';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Email es requerido';
    else if (!EMAIL_RE.test(email)) e.email = 'Email inválido';
    if (!password) e.password = 'Contraseña es requerida';
    else if (password.length < 8) e.password = 'Mínimo 8 caracteres';
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success('Login exitoso');
      // La redirección la hace Stack.Protected al cambiar isAuthenticated
    } catch (err) {
      toast.error(errorMessage(err, 'Error al iniciar sesión'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Inicia Sesión" subtitle="Ingresa tus credenciales para acceder">
      <View style={{ gap: spacing.md }}>
        <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" error={errors.email} />
        <Input label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" error={errors.password} onSubmitEditing={onSubmit} />
      </View>

      <Link href="/password-reset" style={{ marginTop: spacing.sm, marginBottom: spacing.xxl }}>
        <Body muted size={14}>
          ¿Olvidaste tu contraseña?
        </Body>
      </Link>

      <Button title={loading ? 'Ingresando...' : 'Ingresar'} onPress={onSubmit} isLoading={loading} />

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxl }}>
        <Text>
          <Body muted size={14}>
            ¿No tienes cuenta?{' '}
          </Body>
          <Link href="/register">
            <LinkText>Regístrate</LinkText>
          </Link>
        </Text>
      </View>
    </AuthLayout>
  );
}
