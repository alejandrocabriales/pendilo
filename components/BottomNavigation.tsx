import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow, size, space, type } from '../theme/tokens';
import { SunIcon, CalendarIcon, MicIcon, PencilIcon, GearIcon } from './icons';

export type TabKey = 'hoy' | 'semana';

interface BottomNavigationProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  onMic: () => void;
  onWrite: () => void;
}

/**
 * Barra flotante de 5 posiciones (handoff §Navegación): Hoy, Semana, Micrófono (centro,
 * elevado), Escribir, Ajustes. Ajustes es un marcador de posición sin acción todavía.
 */
export function BottomNavigation({ active, onChange, onMic, onWrite }: BottomNavigationProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.wrap}>
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, space[2]) }]}>
        <Pressable
          onPress={() => onChange('hoy')}
          accessibilityRole="tab"
          accessibilityState={{ selected: active === 'hoy' }}
          accessibilityLabel="Hoy"
          style={styles.tab}
        >
          <SunIcon size={22} color={active === 'hoy' ? colors.action.bg : colors.ink[3]} />
          <Text style={[styles.tabLabel, active === 'hoy' ? styles.tabLabelSelected : null]}>Hoy</Text>
        </Pressable>

        <Pressable
          onPress={() => onChange('semana')}
          accessibilityRole="tab"
          accessibilityState={{ selected: active === 'semana' }}
          accessibilityLabel="Semana"
          style={styles.tab}
        >
          <CalendarIcon size={22} color={active === 'semana' ? colors.action.bg : colors.ink[3]} />
          <Text style={[styles.tabLabel, active === 'semana' ? styles.tabLabelSelected : null]}>Semana</Text>
        </Pressable>

        <View style={styles.micSlot} />

        <Pressable onPress={onWrite} accessibilityRole="button" accessibilityLabel="Escribir una tarea" style={styles.tab}>
          <PencilIcon size={22} color={colors.ink[3]} />
          <Text style={styles.tabLabel}>Escribir</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ajustes, próximamente"
          accessibilityState={{ disabled: true }}
          style={styles.tab}
        >
          <GearIcon size={22} color={colors.ink[4]} />
          <Text style={[styles.tabLabel, styles.tabLabelDisabled]}>Ajustes</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={onMic}
        accessibilityRole="button"
        accessibilityLabel="Hablar con Pendilo"
        style={({ pressed }) => [styles.mic, pressed ? styles.micPressed : null]}
      >
        <MicIcon size={28} color={colors.action.fg} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space[3],
    paddingTop: space[2],
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.panel,
    borderTopRightRadius: radius.panel,
    minHeight: size.nav,
    ...shadow.nav,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, minHeight: size.touch },
  micSlot: { width: 88, alignItems: 'center' },
  tabLabel: { ...type.caption, color: colors.ink[3] },
  tabLabelSelected: { color: colors.action.bg },
  tabLabelDisabled: { color: colors.ink[4] },
  mic: {
    position: 'absolute',
    top: -(size.mic / 2),
    left: '50%',
    marginLeft: -(size.mic / 2),
    width: size.mic,
    height: size.mic,
    borderRadius: radius.pill,
    backgroundColor: colors.action.bg,
    borderWidth: 4,
    borderColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.fab,
  },
  micPressed: { opacity: 0.9 },
});
