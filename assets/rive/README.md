# Rive (pendiente)

Acá va `poli.riv` — el mascot rediseñado en estilo 3D/shaded (gradientes, luces, squash &
stretch), construido en el editor de [rive.app](https://rive.app), no como SVG a mano.

No existe todavía. Hasta que lo haya, `components/PoliMascotRive.tsx` no se usa en ningún
lado — el mascot activo sigue siendo `components/PoliMascot.tsx` (SVG plano, el de
`assets/mojon-*.svg`).

## Qué tiene que tener el archivo

En el View Model por defecto del artboard, dos propiedades (nombres exactos):

| Propiedad | Tipo | Valores |
|---|---|---|
| `mood` | string | `listening` \| `thinking` \| `organizing` \| `celebrating` \| `resting` |
| `filled` | number | 0 a 5 (franjas de la caracola pintadas) |

El state machine adentro del `.riv` decide cómo se ve y transiciona cada mood — la app solo
manda estos dos valores.

## Después de agregarlo

1. `npx expo prebuild && npx expo run:ios` (o `run:android`) — no anda en Expo Go, es módulo
   nativo. Si el build falla por versión de Android compileSdk/AGP o iOS deployment target,
   agregar `expo-build-properties` con lo que pida el error.
2. Reemplazar los imports de `PoliMascot` por `PoliMascotRive` donde se use (misma interfaz
   de props, swap directo).
