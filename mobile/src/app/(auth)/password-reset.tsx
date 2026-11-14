import React, { useState } from 'react';
import { View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { AuthLayout } from '../../components/AuthLayout';
import { Body, Button, Input, LinkText } from '../../components/ui';
import { useToast } from '../../components/Toast';
import { authApi } from '../../api/endpoints';
import { errorMessage } from '../../api/client';
import { spacing } from '../../theme/tokens';

/** Une PasswordResetRequest + PasswordResetConfirm del web en dos pasos. */
export default function PasswordResetScreen() {
  const toast = useToast();
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const request = async () => {
    if (!email) return setError('Email es requerido');
    setError(undefined);
    setLoading(true);
    try {
      await authApi.requestPasswordReset(email.trim());
      toast.success('Te enviamos un código a tu correo');
      setStep('confirm');
    } catch (err) {
      toast.error(errorMessage(err, 'Error al solicitar el código'));
    } finally {
      setLoading(false);
    }
  };

  const confirm = async () => {
    if (!code) return setError('Ingresa el código');
    if (password.length < 8) return setError('La contraseña debe tener mínimo 8 caracteres');
    setError(undefined);
    setLoading(true);
    try {
      await authApi.confirmPasswordReset(code.trim(), password);
      toast.success('Contraseña actualizada');
      router.replace('/login');
    } catch (err) {
      toast.error(errorMessage(err, 'Código inválido o expirado'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={step === 'request' ? 'Recuperar acceso' : 'Nueva contraseña'}
      subtitle={step === 'request' ? 'Te enviaremos un código a tu correo' : `Ingresa el código enviado a ${email}`}
      compactVisual
    >
      <View style={{ gap: spacing.md, marginBottom: spacing.lg }}>
        {step === 'request' ? (
          <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" error={error} />
        ) : (
          <>
            <Input label="Código" value={code} onChangeText={setCode} autoCapitalize="none" />
            <Input label="Nueva contraseña" value={password} onChangeText={setPassword} secureTextEntry error={error} />
          </>
        )}
      </View>
      <Button title={step === 'request' ? 'Enviar código' : 'Cambiar contraseña'} onPress={step === 'request' ? request : confirm} isLoading={loading} />
      <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
        <Link href="/login">
          <Body muted size={14}>
            ← Volver a <LinkText>Iniciar sesión</LinkText>
          </Body>
        </Link>
      </View>
    </AuthLayout>
  );
}
