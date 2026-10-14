import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, GestureResponderEvent } from 'react-native';
import { colors, radius, size, type, space } from '../theme/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'flat' | 'outline';

interface ButtonProps {
  label: string;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  /** Razón visible por la que está deshabilitado (p. ej. "Falta definir el día"). */
  disabledHint?: string;
  small?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  disabledHint,
  small,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      accessibilityLabel={disabledHint && isDisabled ? `${label}. ${disabledHint}` : label}
      style={({ pressed }) => [
        styles.base,
        small ? styles.small : null,
        variantStyle(variant, isDisabled),
        pressed && !isDisabled ? styles.pressed : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.action.fg : colors.action.bg} />
      ) : (
        <Text style={[styles.label, textColor(variant, isDisabled)]} numberOfLines={1}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

function variantStyle(variant: ButtonVariant, isDisabled?: boolean) {
  if (isDisabled) return { backgroundColor: colors.disabled.bg };
  if (variant === 'primary') return { backgroundColor: colors.action.bg };
  if (variant === 'secondary') return { backgroundColor: colors.panel };
  if (variant === 'outline') return { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.brand[700] };
  return { backgroundColor: 'transparent' };
}

function textColor(variant: ButtonVariant, isDisabled?: boolean) {
  if (isDisabled) return { color: colors.disabled.fg };
  if (variant === 'primary') return { color: colors.action.fg };
  if (variant === 'secondary') return { color: colors.brand[800] };
  if (variant === 'outline') return { color: colors.brand[700] };
  return { color: colors.brand[700] };
}

const styles = StyleSheet.create({
  base: {
    minHeight: size.button,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[6],
  },
  small: { minHeight: size.buttonSm },
  pressed: { opacity: 0.85 },
  label: { ...type.card },
});
