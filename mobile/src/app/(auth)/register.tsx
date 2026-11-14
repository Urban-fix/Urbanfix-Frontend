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
type Field = 'nombre' | 'apellido' | 'email' | 'password' | 'confirmPassword';

export default function RegisterScreen() {
  const { register } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState<Record<Field, string>>({ nombre: '', apellido: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: Field) => (t: string) => setForm((f) => ({ ...f, [k]: t }));

  const onSubmit = async () => {
    const e: typeof errors = {};
    if (!form.nombre.trim()) e.nombre = 'Nombre es requerido';
    if (!form.apellido.trim()) e.apellido = 'Apellido es requerido';
    if (!form.email) e.email = 'Email es requerido';
    else if (!EMAIL_RE.test(form.email)) e.email = 'Email inválido';
    if (!form.password) e.password = 'Contraseña es requerida';
    else if (form.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      await register({ nombre: form.nombre.trim(), apellido: form.apellido.trim(), email: form.email.trim(), password: form.password, rol: 'CIUDADANO' });
      toast.success('Registro exitoso');
    } catch (err) {
      toast.error(errorMessage(err, 'Error al registrar'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Crea Tu Cuenta" subtitle="Únete a UrbanFix para reportar problemas urbanos" compactVisual>
      <View style={{ gap: spacing.md, marginBottom: spacing.lg }}>
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <Input label="Nombre" value={form.nombre} onChangeText={set('nombre')} error={errors.nombre} autoComplete="given-name" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Apellido" value={form.apellido} onChangeText={set('apellido')} error={errors.apellido} autoComplete="family-name" />
          </View>
        </View>
        <Input label="Email" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" error={errors.email} />
        <Input label="Contraseña" value={form.password} onChangeText={set('password')} secureTextEntry error={errors.password} />
        <Input label="Confirmar contraseña" value={form.confirmPassword} onChangeText={set('confirmPassword')} secureTextEntry error={errors.confirmPassword} />
      </View>

      <Button title={loading ? 'Registrando...' : 'Registrarse'} onPress={onSubmit} isLoading={loading} />

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxl }}>
        <Text>
          <Body muted size={14}>
            ¿Ya tienes cuenta?{' '}
          </Body>
          <Link href="/login">
            <LinkText>Inicia sesión</LinkText>
          </Link>
        </Text>
      </View>
    </AuthLayout>
  );
}
