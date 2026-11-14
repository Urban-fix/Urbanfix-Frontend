import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { alpha, colors, fonts, radius, shadow, spacing, toneColor, type Tone } from '../theme/tokens';
import { ESTADO_COLOR, ESTADO_ICON, estadoLabel } from '../utils/constants';
import type { EstadoReporte } from '../types/reporte.types';

export type IconName = React.ComponentProps<typeof Feather>['name'];

/* ───────────── Tipografía ───────────── */

/** Títulos en Anton mayúsculas (equivale a `font-heading uppercase`). */
export const Heading: React.FC<TextProps & { size?: number }> = ({ style, size = 22, ...p }) => (
  <Text {...p} style={[{ fontFamily: fonts.heading, fontSize: size, color: colors.text, textTransform: 'uppercase', letterSpacing: -0.3, lineHeight: size * 1.15 }, style]} />
);

/** Kicker lima pequeño (equivale a `.auth-kicker` / `.hero-kicker`). */
export const Kicker: React.FC<TextProps> = ({ style, ...p }) => (
  <Text {...p} style={[{ fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.8, color: colors.accent, textTransform: 'uppercase', marginBottom: 6 }, style]} />
);

export const Body: React.FC<TextProps & { muted?: boolean; secondary?: boolean; size?: number }> = ({ style, muted, secondary, size = 15, ...p }) => (
  <Text
    {...p}
    style={[{ fontFamily: fonts.body, fontSize: size, lineHeight: size * 1.5, color: muted ? colors.textMuted : secondary ? colors.textSecondary : colors.text }, style]}
  />
);

/* ───────────── Botón ───────────── */

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  title: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  icon?: IconName;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({ title, variant = 'primary', size = 'md', icon, isLoading, disabled, style, ...p }) => {
  const v = buttonVariants[variant];
  const isDisabled = disabled || isLoading;
  return (
    <Pressable
      {...p}
      disabled={isDisabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.btn,
        size === 'sm' && styles.btnSm,
        { backgroundColor: pressed ? v.pressed : v.bg, borderColor: v.border },
        variant === 'primary' && !isDisabled && styles.btnGlow,
        isDisabled && { opacity: 0.5 },
        pressed && { transform: [{ translateY: 1 }] },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <>
          {icon && <Feather name={icon} size={size === 'sm' ? 16 : 18} color={v.fg} style={{ marginRight: 8 }} />}
          <Text style={[styles.btnText, size === 'sm' && { fontSize: 13 }, { color: v.fg, textTransform: v.upper ? 'uppercase' : 'none' }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
};

const buttonVariants: Record<ButtonVariant, { bg: string; pressed: string; fg: string; border: string; upper: boolean }> = {
  primary: { bg: colors.accent, pressed: colors.accentHover, fg: colors.onAccent, border: colors.accent, upper: true },
  secondary: { bg: colors.surface, pressed: colors.surface2, fg: colors.text, border: colors.line, upper: false },
  danger: { bg: colors.error, pressed: alpha(colors.error, 0.85), fg: colors.text, border: colors.error, upper: true },
  ghost: { bg: 'transparent', pressed: colors.surface, fg: colors.text, border: 'transparent', upper: false },
};

/* ───────────── Inputs ───────────── */

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: IconName;
  counter?: number; // muestra "n/max" si se pasa maxLength
}

export const Input: React.FC<InputProps> = ({ label, error, icon, secureTextEntry, multiline, counter, maxLength, style, ...p }) => {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);
  return (
    <View style={{ width: '100%' }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrap,
          multiline && { height: 128, alignItems: 'flex-start', paddingVertical: 12 },
          focused && styles.inputFocus,
          !!error && { borderColor: colors.error },
        ]}
      >
        {icon && <Feather name={icon} size={16} color={colors.textMuted} style={{ marginRight: 10, marginTop: multiline ? 2 : 0 }} />}
        <TextInput
          {...p}
          maxLength={maxLength}
          multiline={multiline}
          secureTextEntry={hidden}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.accent}
          onFocus={(e) => {
            setFocused(true);
            p.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            p.onBlur?.(e);
          }}
          style={[styles.input, multiline && { height: '100%', textAlignVertical: 'top' }, style]}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10} accessibilityLabel={hidden ? 'Ver contraseña' : 'Ocultar contraseña'}>
            <Feather name={hidden ? 'eye' : 'eye-off'} size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
      <View style={styles.inputFooter}>
        {error ? <Text style={styles.error}>⚠ {error}</Text> : <View />}
        {typeof counter === 'number' && maxLength ? (
          <Text style={styles.counter}>
            {counter}/{maxLength}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

/* ───────────── Select (reemplaza <select> del web) ───────────── */

interface SelectProps<T extends string | number> {
  label?: string;
  placeholder: string;
  value: T | '' | undefined;
  options: { value: T; label: string }[];
  onChange: (v: T | '') => void;
  error?: string;
  allowEmpty?: boolean;
}

export function Select<T extends string | number>({ label, placeholder, value, options, onChange, error, allowEmpty }: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const items = allowEmpty ? [{ value: '' as T | '', label: placeholder }, ...options] : options;
  return (
    <View style={{ width: '100%' }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable onPress={() => setOpen(true)} style={[styles.inputWrap, { backgroundColor: colors.surface2 }, !!error && { borderColor: colors.error }]}>
        <Text style={[styles.input, { color: selected ? colors.text : colors.textMuted }]} numberOfLines={1}>
          {selected?.label ?? placeholder}
        </Text>
        <Feather name="chevron-down" size={18} color={colors.textMuted} />
      </Pressable>
      {error ? <Text style={[styles.error, { marginTop: 6 }]}>⚠ {error}</Text> : null}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Heading size={18} style={{ marginBottom: spacing.md }}>
            {label ?? placeholder}
          </Heading>
          <FlatList
            data={items}
            keyExtractor={(i) => String(i.value)}
            style={{ maxHeight: 380 }}
            renderItem={({ item }) => {
              const active = item.value === (value ?? '');
              return (
                <Pressable
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [styles.option, active && styles.optionActive, pressed && { backgroundColor: colors.surface2 }]}
                >
                  <Text style={[styles.optionText, active && { color: colors.onAccent }]}>{item.label}</Text>
                  {active && <Feather name="check" size={18} color={colors.onAccent} />}
                </Pressable>
              );
            }}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

/* ───────────── Card / Panel ───────────── */

export const Card: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle>; padded?: boolean }> = ({ children, style, padded = true }) => (
  <View style={[styles.card, padded && { padding: spacing.xl }, style]}>{children}</View>
);

/* ───────────── Chip de filtro (`.auth-filter-chip`) ───────────── */

export const Chip: React.FC<{ label: string; active?: boolean; onPress?: () => void; onClear?: () => void }> = ({ label, active, onPress, onClear }) => (
  <Pressable onPress={onPress ?? onClear} style={[styles.chip, active && styles.chipActive]}>
    <Text style={[styles.chipText, active && { color: colors.onAccent }]}>{label}</Text>
    {onClear && <Feather name="x" size={13} color={active ? colors.onAccent : colors.textMuted} style={{ marginLeft: 6 }} />}
  </Pressable>
);

/* ───────────── Badge de estado ───────────── */

export const StatusBadge: React.FC<{ estado: EstadoReporte; showIcon?: boolean }> = ({ estado, showIcon = true }) => {
  const c = ESTADO_COLOR[estado] ?? colors.textMuted;
  return (
    <View style={[styles.badge, { backgroundColor: alpha(c, 0.15), borderColor: alpha(c, 0.3) }]}>
      {showIcon && <Feather name={ESTADO_ICON[estado] ?? 'circle'} size={12} color={c} style={{ marginRight: 5 }} />}
      <Text style={[styles.badgeText, { color: c }]}>{estadoLabel(estado)}</Text>
    </View>
  );
};

/* ───────────── Stat card (`.auth-stat-card.tone-*`) ───────────── */

export const StatCard: React.FC<{ label: string; value: number | string; icon: IconName; tone?: Tone; style?: StyleProp<ViewStyle> }> = ({ label, value, icon, tone = 'accent', style }) => {
  const c = toneColor[tone];
  return (
    <View style={[styles.card, styles.stat, { backgroundColor: mix(c), borderColor: alpha(c, 0.35) }, style]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, { color: c }]}>{value}</Text>
      </View>
      <Feather name={icon} size={24} color={c} style={{ opacity: 0.9 }} />
    </View>
  );
};

// color-mix(accent 10%, surface) aproximado
const mix = (hex: string) => {
  const p = (h: string, i: number) => parseInt(h.slice(i, i + 2), 16);
  const s = colors.surface;
  const r = Math.round(p(hex, 1) * 0.1 + p(s, 1) * 0.9);
  const g = Math.round(p(hex, 3) * 0.1 + p(s, 3) * 0.9);
  const b = Math.round(p(hex, 5) * 0.1 + p(s, 5) * 0.9);
  return `rgb(${r},${g},${b})`;
};

/* ───────────── Icono en recuadro (`.auth-icon-well`) ───────────── */

export const IconWell: React.FC<{ icon: IconName; size?: number }> = ({ icon, size = 48 }) => (
  <View style={[styles.iconWell, { width: size, height: size }]}>
    <Feather name={icon} size={size * 0.46} color={colors.accent} />
  </View>
);

/* ───────────── Estados vacíos / error / carga ───────────── */

export const EmptyState: React.FC<{ title: string; text?: string; action?: React.ReactNode }> = ({ title, text, action }) => (
  <Card style={{ alignItems: 'center', paddingVertical: 48 }}>
    <Heading size={20} style={{ marginBottom: 6, textAlign: 'center' }}>
      {title}
    </Heading>
    {text && (
      <Body secondary style={{ textAlign: 'center', marginBottom: action ? 18 : 0 }}>
        {text}
      </Body>
    )}
    {action}
  </Card>
);

export const ErrorBanner: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <View style={styles.errorBanner}>
    <Text style={[styles.error, { flex: 1 }]}>{message}</Text>
    {onRetry && <Button title="Reintentar" variant="secondary" size="sm" onPress={onRetry} />}
  </View>
);

export const Loader: React.FC = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 64 }}>
    <ActivityIndicator size="large" color={colors.accent} />
  </View>
);

export const Skeleton: React.FC<{ height: number; style?: StyleProp<ViewStyle> }> = ({ height, style }) => (
  <View style={[{ height, borderRadius: radius, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line }, style]} />
);

export const SectionTitle: React.FC<{ title: string; right?: React.ReactNode }> = ({ title, right }) => (
  <View style={styles.sectionHead}>
    <Heading size={20}>{title}</Heading>
    {right}
  </View>
);

export const Divider: React.FC<{ label?: string; style?: StyleProp<ViewStyle> }> = ({ label, style }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg }, style]}>
    <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
    {label && <Text style={{ color: colors.textMuted, fontFamily: fonts.body, fontSize: 13, marginHorizontal: 8 }}>{label}</Text>}
    {label && <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />}
  </View>
);

export const InfoRow: React.FC<{ icon: IconName; text: string }> = ({ icon, text }) => (
  <View style={styles.infoRow}>
    <Feather name={icon} size={15} color={colors.accent} />
    <Text style={styles.infoText} numberOfLines={2}>
      {text}
    </Text>
  </View>
);

export const LinkText: React.FC<TextProps> = ({ style, ...p }) => (
  <Text {...p} style={[{ color: colors.accent, fontFamily: fonts.semibold, fontSize: 14 } as TextStyle, style]} />
);

const styles = StyleSheet.create({
  btn: {
    height: 48,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSm: { height: 40, paddingHorizontal: spacing.lg },
  btnGlow: {
    shadowColor: colors.accent,
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  btnText: { fontFamily: fonts.semibold, fontSize: 15, letterSpacing: 0.4 },

  label: { fontFamily: fonts.medium, fontSize: 14, color: colors.text, marginBottom: spacing.sm },
  inputWrap: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius,
    backgroundColor: colors.surface,
  },
  inputFocus: { borderColor: colors.accent, borderWidth: 2, paddingHorizontal: spacing.lg - 1 },
  input: { flex: 1, color: colors.text, fontFamily: fonts.body, fontSize: 15, paddingVertical: 0 },
  inputFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, minHeight: 4 },
  error: { color: colors.error, fontFamily: fonts.body, fontSize: 13 },
  counter: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 12 },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.xl,
  },
  sheetHandle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.line, marginBottom: spacing.lg },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderRadius: radius,
    marginBottom: 2,
  },
  optionActive: { backgroundColor: colors.accent },
  optionText: { color: colors.text, fontFamily: fonts.medium, fontSize: 15 },

  card: {
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    ...shadow.card,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: colors.surface2,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.textMuted, fontFamily: fonts.semibold, fontSize: 13, textTransform: 'capitalize' },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: { fontFamily: fonts.medium, fontSize: 10.5, letterSpacing: 0.8, textTransform: 'uppercase' },

  stat: { flexDirection: 'row', alignItems: 'flex-start', padding: spacing.xl },
  statLabel: { fontFamily: fonts.body, fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase', color: colors.textMuted, marginBottom: 8 },
  statValue: { fontFamily: fonts.heading, fontSize: 32, lineHeight: 36 },

  iconWell: {
    borderRadius: radius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha(colors.accent, 0.12),
    borderWidth: 1,
    borderColor: alpha(colors.accent, 0.25),
  },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: alpha(colors.error, 0.3),
    backgroundColor: alpha(colors.error, 0.1),
  },

  sectionHead: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: spacing.lg },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface2,
  },
  infoText: { flex: 1, color: colors.text, fontFamily: fonts.body, fontSize: 14 },
});
