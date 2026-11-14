import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius, shadow, spacing } from '../theme/tokens';
import { Body, Heading } from './ui';

/**
 * Versión móvil del AuthLayout web: panel claro "TU CIUDAD REPORTADA"
 * (`.auth-visual`) arriba y la tarjeta oscura del formulario (`.auth-card`).
 */
export const AuthLayout: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; compactVisual?: boolean }> = ({ title, subtitle, children, compactVisual }) => (
  <View style={{ flex: 1, backgroundColor: colors.bg }}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" bounces={false}>
        <LinearGradient colors={['#ecece8', '#d9d9d9', '#c8c8c2']} start={{ x: 0, y: 0 }} end={{ x: 0.6, y: 1 }} style={[styles.visual, compactVisual && { paddingBottom: 56 }]}>
          {/* brillo lima del radial-gradient web */}
          <LinearGradient colors={['rgba(212,245,140,0.55)', 'rgba(212,245,140,0)']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 0.75 }} style={StyleSheet.absoluteFill} />
          <SafeAreaView edges={['top']} style={{ alignItems: 'center' }}>
            <Text style={styles.kicker}>UrbanFix</Text>
            <Text style={[styles.big, compactVisual && { fontSize: 38, lineHeight: 38 }]}>
              TU CIUDAD{'\n'}REPORTADA
            </Text>
            {!compactVisual && <Text style={styles.lead}>Reporta problemas urbanos y mejora tu comunidad</Text>}
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.cardWrap}>
          <View style={styles.card}>
            <Heading size={30} style={{ textAlign: 'center', marginBottom: 6, textShadowColor: 'rgba(212,245,140,0.3)', textShadowRadius: 20 }}>
              {title}
            </Heading>
            {subtitle && (
              <Body secondary style={{ textAlign: 'center', marginBottom: spacing.xxl }}>
                {subtitle}
              </Body>
            )}
            {children}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </View>
);

const styles = StyleSheet.create({
  visual: { paddingHorizontal: spacing.xxl, paddingTop: spacing.xxl, paddingBottom: 72, alignItems: 'center', overflow: 'hidden' },
  kicker: { fontFamily: fonts.bold, fontSize: 13, letterSpacing: 2.4, textTransform: 'uppercase', color: colors.onPanel, marginBottom: 10, marginTop: 8 },
  big: { fontFamily: fonts.heading, fontSize: 48, lineHeight: 48, color: colors.onPanel, textAlign: 'center', letterSpacing: -0.5 },
  lead: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: colors.onPanelMuted, textAlign: 'center', marginTop: 12, maxWidth: 280 },
  cardWrap: { flex: 1, paddingHorizontal: spacing.gutter, marginTop: -44, paddingBottom: 32 },
  card: {
    padding: 24,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    ...shadow.elevated,
  },
});
