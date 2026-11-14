import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing } from '../theme/tokens';
import { Body, Heading } from './ui';

interface ScreenProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  back?: boolean;
  children: React.ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

/**
 * Equivalente móvil del `AppShell` web: encabezado con título Anton + subtítulo
 * y acción opcional a la derecha, sobre el fondo carbón.
 */
export const Screen: React.FC<ScreenProps> = ({ title, subtitle, action, back, children, scroll = true, refreshing, onRefresh }) => {
  const router = useRouter();

  const header = title ? (
    <View style={styles.header}>
      {back && (
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back} accessibilityLabel="Volver">
          <Feather name="arrow-left" size={20} color={colors.text} />
        </Pressable>
      )}
      <View style={{ flex: 1 }}>
        <Heading size={28} numberOfLines={2}>
          {title}
        </Heading>
        {subtitle && (
          <Body secondary size={14} style={{ marginTop: 2 }}>
            {subtitle}
          </Body>
        )}
      </View>
      {action}
    </View>
  ) : null;

  return (
    <SafeAreaView edges={['top']} style={styles.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.accent} colors={[colors.accent]} progressBackgroundColor={colors.surface} /> : undefined}
          >
            {header}
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.content, { flex: 1, paddingBottom: 0 }]}>
            {header}
            {children}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.gutter, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.lg,
    marginBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
