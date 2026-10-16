import React, { useEffect } from 'react';
import Svg, { Rect, Path, G, Circle, Ellipse, Defs, ClipPath } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useIsFocused } from 'expo-router';
import type { Mood } from '../types/domain';
import { poli, motion } from '../theme/tokens';
import { useReducedMotion } from '../hooks/useReducedMotion';

type Face = 'rest' | 'ok' | 'think' | 'party';

// Mapeo de mood a cara: escuchar/organizar comparten la cara "contenta" (ojos redondos, sonrisa).
// Pensar tiene cara propia (mirada desviada + puntitos de pensamiento); dormir y festejar también.
const FACE: Record<Mood, Face> = {
  listening: 'ok',
  thinking: 'think',
  organizing: 'ok',
  celebrating: 'party',
  resting: 'rest',
};

const MOOD_LABEL: Record<Mood, string> = {
  listening: 'Poli escuchando',
  thinking: 'Poli pensando',
  organizing: 'Poli organizando',
  celebrating: 'Poli celebrando',
  resting: 'Poli descansando',
};

// Las 5 franjas, de abajo hacia arriba. Cada franja llena cubre también su "cresta" clara;
// las 4 curvas de borde (BAND_EDGE_D) se repiten siempre encima, llenas o no (ver tablero "Poli · Personaje").
const BAND_FILL_D = [
  'M-10 134 Q92 174 194 134 L194 308 Q92 348 -10 308 Z',
  'M-10 106 Q92 146 194 106 L194 134 Q92 174 -10 134 Z',
  'M-10 78 Q92 118 194 78 L194 106 Q92 146 -10 106 Z',
  'M-10 50 Q92 90 194 50 L194 78 Q92 118 -10 78 Z',
  'M-10 -112 Q92 -72 194 -112 L194 50 Q92 90 -10 50 Z',
] as const;
const BAND_EDGE_D = [
  'M-10 134 Q92 174 194 134',
  'M-10 106 Q92 146 194 106',
  'M-10 78 Q92 118 194 78',
  'M-10 50 Q92 90 194 50',
] as const;

export interface PoliMascotProps {
  mood: Mood;
  size?: number;
  /** Franjas de la caracola pintadas, de 0 a 5 (tareas de hoy hechas); por defecto 5 (caracola completa, para contextos sin progreso). */
  filled?: number;
  /** Etiqueta accesible; por defecto describe el estado. */
  accessibilityLabel?: string;
}

/**
 * Geometría portada 1:1 del handoff de diseño (tablero "Poli · Personaje (SVG)").
 * El orden de las 5 franjas nunca cambia; lo que varía es cuántas están pintadas (`filled`) y la cara/antenas (`mood`).
 */
function PoliMascotInner({ mood, size = 96, filled = 5, accessibilityLabel }: PoliMascotProps) {
  const reducedMotion = useReducedMotion();
  const isFocused = useIsFocused();
  const translateY = useSharedValue(0);
  const face = FACE[mood];
  const filledCount = Math.max(0, Math.min(5, Math.round(filled)));

  // Bob/hop: solo corre con la pantalla enfocada y sin reducir movimiento — si no, se apaga
  // (nada en loop afuera de la vista) y queda limpio al desmontar.
  useEffect(() => {
    cancelAnimation(translateY);
    if (reducedMotion || !isFocused) {
      translateY.value = 0;
      return;
    }
    if (mood === 'celebrating') {
      translateY.value = withSequence(
        withTiming(-14, { duration: motion.hop.duration * 0.35, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: motion.hop.duration * 0.25, easing: Easing.out(Easing.ease) }),
        withTiming(-5, { duration: motion.hop.duration * 0.25, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: motion.hop.duration * 0.15, easing: Easing.out(Easing.ease) })
      );
    } else {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-motion.bob.distance, { duration: motion.bob.duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: motion.bob.duration / 2, easing: Easing.inOut(Easing.ease) })
        ),
        -1
      );
    }
    return () => cancelAnimation(translateY);
  }, [mood, reducedMotion, isFocused]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  // Antenas: geometría fija; se encogen al dormir y se inclinan un poco al pensar (pivote en 172,96).
  const antennaTransform =
    face === 'rest'
      ? 'translate(172 96) scale(1 0.55) translate(-172 -96)'
      : face === 'think'
        ? 'translate(172 96) rotate(-8) translate(-172 -96)'
        : undefined;

  return (
    <Animated.View
      style={[{ width: size, height: size }, style]}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? MOOD_LABEL[mood]}
    >
      <Svg viewBox="8 22 224 190" width={size} height={size}>
        <Defs>
          <ClipPath id="poliShell">
            <Circle cx={92} cy={104} r={70} />
          </ClipPath>
          <ClipPath id="poliFootPatch">
            <Rect x={138} y={100} width={120} height={120} />
          </ClipPath>
        </Defs>

        <G transform={antennaTransform}>
          <Path
            d="M160 92 Q148 70 152 52 M184 90 Q196 68 200 52"
            fill="none"
            stroke={poli.ink}
            strokeWidth={11}
            strokeLinecap="round"
          />
          <Path
            d="M160 92 Q148 70 152 52 M184 90 Q196 68 200 52"
            fill="none"
            stroke={poli.skin}
            strokeWidth={4.5}
            strokeLinecap="round"
          />
          <Circle cx={152} cy={52} r={8} fill={poli.skin} stroke={poli.ink} strokeWidth={4.5} />
          <Circle cx={200} cy={52} r={8} fill={poli.skin} stroke={poli.ink} strokeWidth={4.5} />
          <Circle cx={149.5} cy={49.5} r={2.4} fill="#FFFFFF" />
          <Circle cx={197.5} cy={49.5} r={2.4} fill="#FFFFFF" />
        </G>

        <Ellipse cx={118} cy={204} rx={96} ry={6} fill={poli.ink} opacity={0.12} />

        <G fill={poli.ink} stroke={poli.ink} strokeWidth={10} strokeLinejoin="round">
          <Rect x={20} y={160} width={190} height={38} rx={19} />
          <Circle cx={172} cy={126} r={44} />
        </G>
        <Rect x={20} y={160} width={190} height={38} rx={19} fill={poli.skin} />

        <G clipPath="url(#poliShell)">
          <Rect x={0} y={0} width={240} height={240} fill={poli.shellEmpty} />
          {BAND_FILL_D.map((d, i) =>
            i < filledCount ? (
              <React.Fragment key={i}>
                <Path d={d} fill={poli.stripes[i].fill} />
                {poli.stripes[i].crest ? (
                  <Path
                    d={BAND_EDGE_D[i]}
                    fill="none"
                    stroke={poli.stripes[i].crest}
                    strokeWidth={10}
                    transform="translate(0 6)"
                  />
                ) : null}
              </React.Fragment>
            ) : null
          )}
          {BAND_EDGE_D.map((d, i) => (
            <Path key={`edge-${i}`} d={d} fill="none" stroke={poli.hairline} strokeWidth={5} />
          ))}
        </G>
        <Circle cx={92} cy={104} r={70} fill="none" stroke={poli.ink} strokeWidth={6} />
        <Path
          d="M100.7 92.1 L101.0 92.0 L101.3 91.9 L101.6 91.8 L101.9 91.7 L102.3 91.7 L102.7 91.7 L103.1 91.8 L103.4 92.0 L103.8 92.2 L104.2 92.4 L104.6 92.7 L104.9 93.0 L105.2 93.4 L105.5 93.8 L105.7 94.3 L105.9 94.8 L106.1 95.3 L106.2 95.9 L106.3 96.5 L106.3 97.1 L106.2 97.8 L106.0 98.4 L105.8 99.1 L105.6 99.7 L105.2 100.4 L104.8 101.0 L104.4 101.6 L103.8 102.2 L103.2 102.7 L102.5 103.2 L101.8 103.6 L101.0 103.9 L100.2 104.2 L99.3 104.5 L98.4 104.6 L97.5 104.7 L96.5 104.7 L95.6 104.6 L94.6 104.4 L93.6 104.2 L92.6 103.8 L91.7 103.3 L90.7 102.8 L89.9 102.1 L89.0 101.4 L88.2 100.6 L87.5 99.7 L86.8 98.7 L86.2 97.6 L85.7 96.5 L85.3 95.3 L85.0 94.1 L84.8 92.9 L84.7 91.6 L84.7 90.2 L84.8 88.9 L85.1 87.5 L85.5 86.2 L85.9 84.9 L86.6 83.6 L87.3 82.3 L88.1 81.1 L89.1 80.0 L90.1 78.9 L91.3 77.9 L92.6 77.1 L93.9 76.3 L95.4 75.6 L96.9 75.0 L98.5 74.6 L100.1 74.3 L101.7 74.1 L103.4 74.0 L105.2 74.2 L106.9 74.4 L108.6 74.8 L110.3 75.4 L111.9 76.1 L113.5 77.0 L115.1 78.0 L116.5 79.1 L117.9 80.4 L119.2 81.8 L120.4 83.3 L121.4 84.9 L122.3 86.7 L123.1 88.5 L123.7 90.4 L124.2 92.4 L124.5 94.4 L124.6 96.5 L124.6 98.6 L124.4 100.7 L124.0 102.7 L123.4 104.8 L122.6 106.8 L121.7 108.8 L120.5 110.7 L119.3 112.6 L117.8 114.3 L116.2 115.9 L114.5 117.4 L112.6 118.7 L110.6 119.9 L108.5 121.0 L106.2 121.8 L103.9 122.5 L101.6 123.0 L99.1 123.2 L96.7 123.3 L94.2 123.2 L91.7 122.8 L89.3 122.3 L86.8 121.5 L84.5 120.5 L82.2 119.4 L80.0 118.0 L77.9 116.4 L75.9 114.7 L74.0 112.7"
          fill="none"
          stroke={poli.ink}
          strokeWidth={4.5}
          strokeLinecap="round"
          opacity={0.9}
        />
        <Ellipse cx={56} cy={66} rx={15} ry={8} transform="rotate(-38 56 66)" fill="#FFFFFF" opacity={0.6} />
        <Circle cx={76} cy={50} r={4} fill="#FFFFFF" opacity={0.6} />

        <Circle cx={172} cy={126} r={44} fill={poli.skin} stroke={poli.ink} strokeWidth={6} />
        <Rect x={20} y={160} width={190} height={38} rx={19} fill={poli.skin} clipPath="url(#poliFootPatch)" />
        <Rect x={28} y={184} width={174} height={9} rx={4.5} fill={poli.mouthPlate} />
        <Ellipse cx={150} cy={100} rx={9} ry={5} transform="rotate(-30 150 100)" fill="#FFFFFF" opacity={0.7} />

        <Ellipse cx={146} cy={143} rx={8} ry={5} fill={poli.cheek} opacity={0.8} />
        <Ellipse cx={203} cy={143} rx={8} ry={5} fill={poli.cheek} opacity={0.8} />

        {face === 'rest' && (
          <>
            <Path
              d="M150 128 Q158 134 166 128 M182 128 Q190 134 198 128"
              fill="none"
              stroke={poli.ink}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <Path
              d="M170 142 Q174 144 178 142"
              fill="none"
              stroke={poli.ink}
              strokeWidth={3.5}
              strokeLinecap="round"
            />
            <Path
              d="M204 86 L212 82 L204 78 M212 76 L220 72 L212 68"
              fill="none"
              stroke={poli.ink}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.7}
            />
          </>
        )}

        {face === 'think' && (
          <>
            <Ellipse cx={158} cy={128} rx={8.5} ry={6.5} fill={poli.ink} />
            <Ellipse cx={190} cy={124} rx={8.5} ry={6.5} fill={poli.ink} />
            <Circle cx={161} cy={126} r={2.6} fill="#FFFFFF" />
            <Circle cx={193} cy={122} r={2.6} fill="#FFFFFF" />
            <Path d="M169 144 L179 144" fill="none" stroke={poli.ink} strokeWidth={3.5} strokeLinecap="round" />
            <Circle cx={206} cy={98} r={3} fill={poli.ink} opacity={0.5} />
            <Circle cx={214} cy={88} r={4} fill={poli.ink} opacity={0.65} />
            <Circle cx={223} cy={76} r={5} fill={poli.ink} opacity={0.8} />
          </>
        )}

        {face === 'ok' && (
          <>
            <Ellipse cx={158} cy={126} rx={8.5} ry={10.5} fill={poli.ink} />
            <Ellipse cx={190} cy={126} rx={8.5} ry={10.5} fill={poli.ink} />
            <Circle cx={155} cy={121} r={3.4} fill="#FFFFFF" />
            <Circle cx={187} cy={121} r={3.4} fill="#FFFFFF" />
            <Circle cx={161} cy={131} r={1.6} fill="#FFFFFF" />
            <Circle cx={193} cy={131} r={1.6} fill="#FFFFFF" />
            <Path
              d="M168 140 Q174 146 180 140"
              fill="none"
              stroke={poli.ink}
              strokeWidth={3.5}
              strokeLinecap="round"
            />
          </>
        )}

        {face === 'party' && (
          <>
            <Path
              d="M150 130 Q158 118 166 130 M182 130 Q190 118 198 130"
              fill="none"
              stroke={poli.ink}
              strokeWidth={4.5}
              strokeLinecap="round"
            />
            <Path
              d="M166 138 Q174 152 182 138 Z"
              fill={poli.ink}
              stroke={poli.ink}
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <Path d="M170 145 Q174 141 178 145 Q174 149 170 145 Z" fill={poli.cheek} />
            <Path
              d="M30 35 L32.5 41.5 L39 44 L32.5 46.5 L30 53 L27.5 46.5 L21 44 L27.5 41.5 Z"
              fill={poli.stripes[4].fill}
              stroke={poli.ink}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
            <Path
              d="M130 21 L132.5 27.5 L139 30 L132.5 32.5 L130 39 L127.5 32.5 L121 30 L127.5 27.5 Z"
              fill={poli.stripes[2].fill}
              stroke={poli.ink}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
            <Path
              d="M222 61 L224.5 67.5 L231 70 L224.5 72.5 L222 79 L219.5 72.5 L213 70 L219.5 67.5 Z"
              fill={poli.stripes[1].fill}
              stroke={poli.ink}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
            <Path
              d="M20 111 L22.5 117.5 L29 120 L22.5 122.5 L20 129 L17.5 122.5 L11 120 L17.5 117.5 Z"
              fill={poli.stripes[0].fill}
              stroke={poli.ink}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          </>
        )}
      </Svg>
    </Animated.View>
  );
}

export const PoliMascot = React.memo(PoliMascotInner);
