// Tokens de Pendilo para React Native. Fuente: tokens.json.
// Fuentes: cargar con expo-font (Bricolage Grotesque 500/600/700, Instrument Sans 400/500/600).
import { Easing } from 'react-native-reanimated';

export const colors = {
  brand: { 100: '#DDEFEB', 200: '#9CCFC4', 500: '#4E9A97', 700: '#2F6F73', 800: '#1E4B4E', face: '#0F2E30' },
  ink: { 1: '#16161C', 2: '#4A4A55', 3: '#5A5A66', 4: '#6A6A75' },
  paper: '#F4F3F0',
  surface: '#FFFFFF',
  line: '#E4E2DC',
  night: '#121418',
  action: { bg: '#2F6F73', fg: '#FFFFFF' },
  panel: '#DDEFEB',
  track: '#D5DCDA',
  disabled: { bg: '#CBD7D5', fg: '#46534F' },
  suggest: { fg: '#8A4F05', bg: '#FFF6E5' },
  danger: { fg: '#B3261E', bg: '#FDECEA', ink: '#6B1510', hint: '#8A1C16' },
  toast: { bg: '#16161C', fg: '#F4F3F0', action: '#9CCFC4' },
} as const;

// Variante de modo oscuro. Mismas claves que `colors`; brand y poli no cambian entre temas.
// Aún no hay selector de esquema en la app — estos tokens quedan listos para cuando se active (ver `colorsFor`).
export const colorsDark = {
  brand: colors.brand,
  ink: { 1: '#F4F3F0', 2: '#C7C6C2', 3: '#A8A7A3', 4: '#8B8A87' },
  paper: '#121418',
  surface: '#1C1F26',
  line: '#2A2D33',
  night: '#121418',
  action: { bg: '#4E9A97', fg: '#0F2E30' },
  panel: '#1B3330',
  track: '#2A2F2E',
  disabled: { bg: '#2A2D33', fg: '#6A6A75' },
  suggest: { fg: '#FFC971', bg: '#2E2311' },
  danger: { fg: '#FF6B61', bg: '#3A1613', ink: '#FFD4CF', hint: '#FF8A80' },
  toast: { bg: '#16161C', fg: '#F4F3F0', action: '#9CCFC4' },
} as const;

export type ColorScheme = 'light' | 'dark';
export function colorsFor(scheme: ColorScheme) {
  return scheme === 'dark' ? colorsDark : colors;
}

// Poli (la Polymita), la mascota: colores propios, fuera de la escala `brand`.
// Regla de marca: la caracola y el orden de sus 5 franjas nunca cambian; solo cara y antenas varían por mood.
export const poli = {
  ink: '#3A2C3F',
  skin: '#FFE6B3',
  mouthPlate: '#F5D49B',
  cheek: '#FF8FA8',
  shellEmpty: '#ECE4DA',
  hairline: '#FFFBF4',
  stripes: [
    { fill: '#2FBF71', crest: '#7DDBA4' },
    { fill: '#3D9BE9', crest: '#8CC4F3' },
    { fill: '#F2476A', crest: '#F78FA6' },
    { fill: '#FF7A59', crest: '#FFAE96' },
    { fill: '#FFC531', crest: null },
  ],
} as const;

export const fonts = {
  display: { 500: 'BricolageGrotesque_500Medium', 600: 'BricolageGrotesque_600SemiBold', 700: 'BricolageGrotesque_700Bold' },
  body: { 400: 'InstrumentSans_400Regular', 500: 'InstrumentSans_500Medium', 600: 'InstrumentSans_600SemiBold' },
} as const;

// lineHeight en px (tamaño × factor, redondeado).
export const type = {
  title: { fontFamily: fonts.display[700], fontSize: 28, lineHeight: 31, letterSpacing: -0.56 },
  titleLg: { fontFamily: fonts.display[700], fontSize: 32, lineHeight: 35, letterSpacing: -0.64 },
  voice: { fontFamily: fonts.display[700], fontSize: 26, lineHeight: 30, letterSpacing: -0.52 },
  section: { fontFamily: fonts.display[700], fontSize: 20, lineHeight: 24 },
  card: { fontFamily: fonts.display[600], fontSize: 18, lineHeight: 22 },
  body: { fontFamily: fonts.body[400], fontSize: 16, lineHeight: 22 },
  bodySm: { fontFamily: fonts.body[400], fontSize: 15, lineHeight: 21 },
  meta: { fontFamily: fonts.body[400], fontSize: 14, lineHeight: 19 },
  caption: { fontFamily: fonts.body[600], fontSize: 13, lineHeight: 17 },
  overline: { fontFamily: fonts.body[600], fontSize: 12, lineHeight: 16, letterSpacing: 0.96, textTransform: 'uppercase' as const },
} as const;

export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 12: 48 } as const;
export const radius = { chip: 16, card: 20, day: 18, panel: 28, button: 28, pill: 999 } as const;
export const size = { touch: 44, button: 56, buttonSm: 48, mic: 72, nav: 64, checkbox: 26, progress: 6, progressBig: 10, screenPadding: 20 } as const;

export const shadow = {
  nav: { shadowColor: '#16161C', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  fab: { shadowColor: '#2F6F73', shadowOpacity: 0.4, shadowRadius: 11, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
} as const;

export const motion = {
  bob: { duration: 3400, distance: 4 },
  pulse: { duration: 1200, min: 0.4 },
  hop: { duration: 1100 },
  ring: { duration: 2400, from: 0.6, to: 1.7, stagger: 800 },
  wave: { duration: 1100, min: 0.2 },
  moodChange: { duration: 220 },
  // Entrada del toast: spring.snappy (ver Toast.tsx), no timing — `visible` sigue siendo la ventana de lectura.
  toast: { visible: 4500 },
  // Cuánto tarda una tarea recién completada en salir de "pendientes" hacia "completadas":
  // el tiempo para ver el check antes del colapso, no una salida instantánea (ver TaskCard.tsx).
  completeHold: { duration: 420 },
  reduced: { duration: 120 },
} as const;

// Curvas para withTiming/.easing() sin gesto. No usar Easing.in ni Easing.ease genérico (ver DESIGN.md).
export const easing = {
  easeOut: Easing.bezier(0.23, 1, 0.32, 1),
  easeInOut: Easing.bezier(0.77, 0, 0.175, 1),
  sheet: Easing.bezier(0.32, 0.72, 0, 1),
} as const;

// Springs para withSpring, parámetros Apple (duration + dampingRatio). Agregar `velocity` en la llamada.
export const spring = {
  suave: { duration: 400, dampingRatio: 1 },
  snappy: { duration: 300, dampingRatio: 0.8 },
  bouncy: { duration: 400, dampingRatio: 0.65 },
} as const;

export const opacity = { pressed: 0.85, pressedSubtle: 0.9, pressedStrong: 0.8, overlay: 0.5, scrim: 0.4 } as const;

export const border = { hairline: 1, thin: 1.5, default: 2, emphasis: 3, ring: 4 } as const;

export const zIndex = { base: 0, raised: 1, nav: 10, overlay: 20, sheet: 30, toast: 40, modal: 50 } as const;

export const theme = {
  colors,
  colorsDark,
  poli,
  fonts,
  type,
  space,
  radius,
  size,
  shadow,
  motion,
  easing,
  spring,
  opacity,
  border,
  zIndex,
} as const;
export type Theme = typeof theme;
