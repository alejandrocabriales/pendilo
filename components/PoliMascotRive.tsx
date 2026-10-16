import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { RiveView, useRiveFile, useViewModelInstance, useRiveString, useRiveNumber, Fit } from '@rive-app/react-native';
import type { PoliMascotProps } from './PoliMascot';

/**
 * Reemplazo 1:1 de PoliMascot (misma interfaz de props) sobre Rive en vez de SVG a mano —
 * pensado para el nivel de pulido 3D/shaded que pidió el usuario, tipo mascotas de apps de
 * juego (gradientes, luces, squash & stretch real), algo que un <Svg> a mano no da.
 *
 * NO está enchufado todavía. PoliMascot.tsx (SVG) sigue siendo el mascot activo de la app.
 * No funciona en Expo Go (módulo nativo) — necesita dev client.
 *
 * Para activarlo:
 *   1. Diseñar/riggear a Poli en el editor de Rive (rive.app) con, en el View Model por
 *      defecto del artboard, estas dos propiedades (los nombres deben coincidir exacto):
 *        - string "mood"   → uno de: listening | thinking | organizing | celebrating | resting
 *        - number "filled" → 0 a 5 (franjas de la caracola pintadas)
 *      El state machine adentro del .riv es quien decide cómo se ve y transiciona cada mood;
 *      acá solo le mandamos los valores.
 *   2. Exportar como assets/rive/poli.riv (crear la carpeta; no existe todavía).
 *   3. Compilar con dev client: `npx expo prebuild && npx expo run:ios` (o run:android),
 *      o `eas build --profile development`. Si el build de Android falla por versión de
 *      compileSdk/AGP, o iOS por deployment target, agregar `expo-build-properties` con los
 *      valores que pida el error (Rive pedía compileSdk 36 / AGP 8.9.1+ / iOS 15.1 en SDKs
 *      previos; no confirmado para Expo 57 sin un build real).
 *   4. Reemplazar los imports de `PoliMascot` por `PoliMascotRive` en cada lugar que lo usa
 *      (mismo prop shape, swap directo) y borrar PoliMascot.tsx si no se necesita más.
 */
export function PoliMascotRive({ mood, size = 96, filled = 5, accessibilityLabel }: PoliMascotProps) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Metro solo registra assets vía require() estático.
  const { riveFile, error: fileError } = useRiveFile(require('../assets/rive/poli.riv'));
  const { instance } = useViewModelInstance(riveFile, { async: true });
  const { setValue: setMood } = useRiveString('mood', instance);
  const { setValue: setFilled } = useRiveNumber('filled', instance);

  useEffect(() => {
    setMood(mood);
  }, [mood, setMood]);

  useEffect(() => {
    setFilled(Math.max(0, Math.min(5, Math.round(filled))));
  }, [filled, setFilled]);

  const box = { width: size, height: size };

  if (fileError || !riveFile || !instance) {
    // Carga o falta de asset: deja el espacio reservado en vez de romper el layout.
    return <View style={[styles.box, box]} />;
  }

  return (
    <View style={[styles.box, box]} accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <RiveView file={riveFile} dataBind={instance} autoPlay fit={Fit.Contain} style={styles.fill} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
  fill: { width: '100%', height: '100%' },
});
