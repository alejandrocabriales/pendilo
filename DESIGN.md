# Pendilo · Principios de diseño

Fuente visual y de copy: `pendilo-last/SPEC.md`. Este documento cubre lo que SPEC no fija: cómo se mueve la app, cómo se ordena la atención, y el tono que debe sentirse en cada detalle. Tokens en `theme/tokens.ts`.

## Tono

- **Tranquila, no urgente.** Pendilo vacía la cabeza; no debe meter ansiedad. Nada de rachas, contadores de racha rota, ni lenguaje de castigo. Se premia lo hecho, nunca se señala lo pendiente.
- **Cálida, no infantil.** Poli es la mascota, no un decorado. Su mood acompaña el estado real del usuario (escuchando, pensando, celebrando) — nunca es ruido de fondo.
- **Honesta sobre la IA.** Toda sugerencia de la IA lleva el estilo punteado (`#8A4F05` sobre `#FFF6E5`) y es editable. El usuario manda sobre lo que se guarda; nada se persiste sin pasar por Revisión.
- **Una cosa a la vez.** Una acción principal por pantalla (SPEC). El resto es secundario o no existe en esa pantalla.

## Jerarquía

1. **Poli primero.** En cualquier pantalla con mascota, su mood es lo que se lee antes que el texto.
2. **La acción principal es obvia y única.** Botón primario (`.btn`, pill 56) siempre más prominente que cualquier secundario (`.btn2`, outline). Si dos acciones compiten por atención, una de las dos está de más.
3. **El estado de "siguiente" se marca con color/chip, no con ruido.** La tarjeta `next` usa borde de énfasis fijo (token, no número mágico) + chip "Siguiente" — nunca anchos de borde que cambian entre estados, porque eso mueve el layout alrededor suyo.
4. **Lo completado se repliega.** Completadas colapsa; no compite visualmente con lo pendiente.
5. **El contador no se repite.** Un solo lugar por pantalla dice "N de M".

## Movimiento

Regla general: **todo lo que se mueve tiene una razón nombrable** — feedback, consistencia espacial, indicación de estado, evitar un cambio brusco, explicación, o deleite (raro, reservado a celebración/éxito). Si no se puede nombrar en una palabra, no se anima.

- **Frecuencia decide intensidad.** Algo que pasa decenas de veces al día (abrir/cerrar tarjeta, check de tarea) es casi imperceptible: <150 ms o nada. Algo raro (celebración de día completo, confirmación de semana) se gana el presupuesto de deleite.
- **Transform y opacity, nada más.** Nunca animar `width`/`height`/`margin`/`borderWidth` salvo el caso de una barra de progreso absoluta sin hijos.
- **Gesto → spring. Sin gesto → timing.** Un dedo en pantalla (swipe, drag, reorden) siempre usa spring porque conserva velocidad en una interrupción. Transiciones de mood, fades, entradas/salidas usan timing con las curvas de `theme/tokens.ts` (`easing.easeOut`, `.easeInOut`, `.sheet`) — nunca `Easing.ease` genérico ni `Easing.in`.
- **Tres springs nombrados** (`spring.suave`, `.snappy`, `.bouncy` en tokens): suave para asentar sin overshoot, snappy para reposicionar/encajar, bouncy solo cuando el gesto trae momentum real (swipe, drag) — nunca en algo que solo apareció con fade.
- **Reducir movimiento es "menos y más suave", no "cero".** Se conserva el cambio de opacidad/color que explica el estado; se elimina traslación, escala, parallax y overshoot. Todo componente con loop o movimiento de posición debe consultar `useReducedMotion()` y, igual de importante, limpiar con `cancelAnimation` al desmontar — una animación en loop que sigue corriendo fuera de pantalla es una fuga, no un detalle.
- **Háptica = confirmación, no decoración.** Una vez por acción del usuario (grabar, completar, error), nunca en loops ni por frame, nunca como única señal — siempre acompaña a un cambio visual, en el mismo instante causal. Ver `lib/haptics.ts`.

## Enlaces

- Tokens: `theme/tokens.ts` (color, tipografía, espacio, radio, sombra, movimiento, opacidad, borde, z-index).
- Hook de accesibilidad: `hooks/useReducedMotion.ts`.
- Hápticas: `lib/haptics.ts`.
- Estructura de vistas y copy: `pendilo-last/SPEC.md`.
