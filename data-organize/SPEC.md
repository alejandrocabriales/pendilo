# Pendilo — Especificación de diseño para implementación

Asistente personal con IA que se maneja hablando. «Habla. Pendilo organiza. Tú haces.»

- Nombre: **Pendilo** (provisional; no se verificó disponibilidad de nombre, dominio ni marca).
- Mascota: **Mojón**, tres piedras apiladas con cara en la del medio.
- Referencia visual: el lienzo de diseño (tableros `Marca`, `Sistema` y el prototipo `Prototipo · Hoy, voz, Semana, Progreso`).
- Stack objetivo: React Native + Expo + TypeScript + Expo Router; backend Python + FastAPI + PostgreSQL.
- El prototipo web **no es reutilizable como código**. Sirve como referencia de estructura, textos, estados y tiempos.

Archivos de este paquete: `tokens.json`, `tokens.ts`, `types.ts`, `mock-data.json`, `assets/` (SVG y README de assets).

---

## 1. Estructura de pantallas y rutas (Expo Router)

```
app/
  _layout.tsx              Stack raíz. Grupo (voz) con presentation: 'fullScreenModal'
  (tabs)/
    _layout.tsx            BottomNavigation propia + botón de micrófono (no usar el tab bar por defecto)
    index.tsx              Hoy
    semana.tsx             Mi semana
    progreso.tsx           Progreso
  (voz)/
    _layout.tsx            Stack sin header, sin gesto de volver durante la grabación
    escuchando.tsx         Grabando + transcripción en vivo
    procesando.tsx         «Déjame organizar eso...»
    revision.tsx           Tareas detectadas (TaskReview)
    listo.tsx              «Listo, ya organicé tu semana»
    error.tsx              Params: kind = silence | perm | offline | transcribe
components/                Ver inventario (sección 4)
state/                     Un store (p. ej. Zustand): tasks, goals, voiceSession, celebration
theme/                     tokens.ts
```

Celebraciones (CompletionCelebration) son un modal sobre cualquier tab, controlado por el store.

## 2. Reglas de navegación

- Tres secciones: **Hoy**, **Semana**, **Progreso**. Sin menús profundos.
- El micrófono está siempre visible a la derecha de la barra, en las tres secciones. Se oculta solo dentro del flujo de voz.
- El flujo de voz es un modal a pantalla completa. «Cancelar» (X) vuelve a Hoy y descarta la sesión.
- Tras «Ver mi día» se vuelve a Hoy con las tareas nuevas marcadas «Nueva» hasta que se toquen o completen.
- Las tareas de otros días no aparecen en Hoy; se ven en Semana.
- Una sola mano: acciones principales en la mitad inferior; objetivos táctiles ≥ 44 pt.

## 3. Captura por voz: máquina de estados

```
idle ──mic──▶ recording ──detener (≥ ~1 s de voz)──▶ processing ──ok──▶ review ──confirmar──▶ done ──▶ Hoy
                │  │                                    │
                │  └─detener sin voz────────────────────┼──▶ error.silence ──reintentar──▶ recording
                └─permiso denegado──▶ error.perm        ├──▶ error.offline ──reintentar──▶ processing (conserva la transcripción)
                                                        └──▶ error.transcribe ──reintentar──▶ processing | grabar de nuevo
```

Reglas:
- Reintentar no debe perder la grabación ni la transcripción (offline, transcribe).
- En `review`, cada campo de cada ítem lleva procedencia: `said` (lo dijo), `suggested` (lo sugiere Pendilo) o `unresolved` (falta).
- No se puede confirmar si hay un ítem con día `unresolved` o una frase `unclear` sin aclarar.
- Editar un campo lo convierte en `said`.
- Quitar un ítem lo elimina de la sesión (no hay deshacer en revisión).
- El texto de la transcripción aparece progresivamente (en el prototipo, 1 palabra cada 200 ms; en producción llega del servicio de transcripción).

## 4. Inventario de componentes

Todos los estados se ven en el tablero `Sistema`.

| Componente | Props principales | Estados |
|---|---|---|
| `PendiloMascot` | `mood: 'listening'\|'thinking'\|'organizing'\|'celebrating'\|'resting'`, `size` | Cinco estados. Siempre tres piedras. Idle: flota 3–4 px (ver animaciones). |
| `TaskCard` | `task`, `expanded`, `onToggle`, `onExpand`, `onPostpone`, `onChangeDay`, `onChangeTime` | pendiente, nueva, hecha (título tachado), vencida (ícono + «Vencida»), expandida (acciones). |
| `GoalCard` | `goal {kind: count\|percent\|hours, value, target}`, `onChange` | en curso, cumplido (chip «Cumplido»). Paso: 1 sesión / 5 % / 30 min. |
| `VoiceRecorder` | `elapsed`, `transcript`, `onStop`, `onCancel` | grabando (punto + «Grabando · mm:ss»), sin voz. |
| `VoiceWaveform` | `level` (0–1 o animación simulada) | activo, reducido (barras estáticas con movimiento reducido). |
| `VoiceProcessing` | — | pensando + esqueletos que laten. |
| `TaskReview` | `items`, `onEdit`, `onRemove`, `onConfirm` | tarea, objetivo semanal, frase poco clara, día sin definir, edición inline, confirmar deshabilitado con razón visible. |
| `WeekNavigator` | `days[7]`, `selected`, `onSelect` | día normal, seleccionado, hoy, con vencidas (ícono de alerta). |
| `ProgressIndicator` | `segments`, `done`, `variant: 'day'\|'goal'` | barra segmentada con texto numérico siempre visible. |
| `BottomNavigation` | `active`, `onChange`, `onMic` | pestaña activa/inactiva, micrófono. |
| `CompletionCelebration` | `title`, `body`, `onClose` | día completo, objetivo cumplido. |
| `Chip` | `kind: 'said'\|'suggested'\|'missing'`, `label` | dicho (sólido + ✓), sugerido (punteado + ✦), falta (rojo + alerta). |
| `Button` | `variant: primary\|secondary\|flat`, `disabled` | normal, presionado, deshabilitado. |
| `SegmentedChoice` | `options`, `value` | seleccionado/no, `aria-pressed`. |
| `Stepper` | `value`, `onMinus`, `onPlus` | con etiquetas accesibles («30 minutos antes»). |
| `Toast` | `text`, `onUndo` | visible 4,5 s; «Deshacer» restaura el estado anterior. |
| `Banner` | `text`, `actions` | reprogramación de vencidas. |
| `EmptyState` / `ErrorState` | `mood`, `title`, `body`, `actions` | vacío, carga (esqueletos), error. |

## 5. Interacciones por pantalla

**Hoy**
- Encabezado: Mojón + «Buen día, Manu» + «Hoy tenemos N cosas por resolver.» (singular: «1 cosa»).
- Estados del mensaje: sin tareas → «Hoy no tienes nada pendiente. Cuéntame qué tienes en mente.»; todo completo → «¡Lo lograste! Terminaste todo lo de hoy.» (Mojón celebra).
- Barra de progreso diaria (un segmento por tarea) + «k de n hechas hoy».
- Grupos: **Ahora** (tareas que empiezan en la próxima hora), **Más tarde**, **Completadas** (plegable, abierto por defecto).
- Casilla: completa/descompleta. Tocar la tarjeta: expande. Expandida: Día (Hoy/Mañana/Vie), Hora (± 30 min), «Posponer a mañana», «Completar».
- Mover de día o posponer: toast con «Deshacer».
- Al completar la última tarea del día: celebración.

**Voz**: ver sección 3. Textos: «Te escucho…», «Déjame organizar eso...», «Encontré 3 tareas y 1 objetivo semanal», «Listo, ya organicé tu semana».

**Semana**
- Siete botones (Lun 12 … Dom 18) con el número de tareas; el día con vencidas lleva ícono de alerta. Etiqueta accesible completa («Lunes 12, 2 tareas, con tareas vencidas»).
- Lista del día seleccionado. En días pasados con pendientes: banner «No terminaste esta tarea. ¿La pasamos para mañana?» con «Pasar a mañana» (confirma) y «Ahora no» (oculta el banner de ese día).
- Reprogramar: Hoy/Mañana/Vie/Sáb/Dom + hora. Posponer un día. Completar.
- Día sin tareas: estado vacío «Día libre».
- La reprogramación siempre requiere un toque de confirmación; nunca ocurre sola.

**Progreso**
- Resumen: «Completaste X de Y tareas esta semana» con barra segmentada.
- Objetivos con `GoalCard`; se actualizan a mano con − / +. Al llegar a la meta: celebración «¡Objetivo cumplido!».
- Sin objetivos: estado vacío con ejemplo de frase.

## 6. Animaciones

Todas se desactivan o se simplifican con «reducir movimiento» del sistema (`AccessibilityInfo.isReduceMotionEnabled`).

| Nombre | Dónde | Especificación |
|---|---|---|
| bob | Mojón en reposo | translateY 0 → −4 → 0, 3,4 s, ease-in-out, infinito |
| waveform | VoiceWaveform | 28 barras de 5 px; scaleY 0,2 ↔ 1; 0,8–1,4 s por barra, desfasadas; infinito. Reducido: barras fijas |
| pulse | punto de grabación, esqueletos | opacity 1 ↔ 0,4; 1,2–1,3 s; infinito |
| hop | Mojón al celebrar | translateY 0 → −14 → 0 → −5 → 0; 1,1 s; ease-out; una vez |
| ring | celebración | 3 anillos de 150 px, borde 3 px brand.500; scale 0,6 → 1,7, opacity 0,5 → 0; 2,4 s; desfasados 0,8 s |
| mood change | Mojón entre estados | Transición de las piedras (translate/rotate) ≈ 220 ms ease-out. Cambia cara y posición; nunca la forma |
| toast | Toast | Aparece 180 ms (fade + 8 px); sale a los 4,5 s |

Poses de Mojón (ver `assets/`): escuchando (piedra superior inclinada −7°), pensando (superior +10° y desplazada), organizando (todo alineado), celebrando (superior arriba −16 px y −12°), descansando (superior caída a la derecha).

Sugerencia: `react-native-reanimated` para bob/hop/ring/waveform, `react-native-svg` para Mojón.

## 7. Tokens

Fuente: `tokens.json` (neutral) y `tokens.ts` (listo para React Native). Resumen:
- Color de acción `#2F6F73`; paneles `#DDEFEB`; fondo `#F4F3F0`; texto `#16161C`.
- Sugerencia: texto `#8A4F05` sobre `#FFF6E5`, borde punteado. Atención: `#B3261E` sobre `#FDECEA`.
- Tipografías: Bricolage Grotesque (500/600/700) para títulos y marca; Instrument Sans (400/500/600) para el resto.
- Espaciado 4, 8, 12, 16, 20, 24, 32, 48. Radios 16 (chip), 20 (tarjeta), 28 (panel/botón).
- Medidas: botón 56, micrófono 72, barra 64, zona táctil mínima 44.
- Modo oscuro: **no está diseñado**; solo existe el color `night` (`#121418`).

## 8. Accesibilidad

- Todo control interactivo ≥ 44 × 44 pt, con `accessibilityRole` y `accessibilityLabel` (los íconos solos siempre llevan etiqueta).
- Contraste mínimo 4,5:1 en texto (3:1 desde 24 px).
- Ningún estado se comunica solo con color: lo dicho = sólido + ✓; lo sugerido = punteado + ✦ + texto accesible «Sugerido»; vencida = ícono + palabra.
- Casillas y botones segmentados exponen su estado (`accessibilityState: { checked / selected }`).
- Mensajes de estado (procesando, errores, listo) como `accessibilityLiveRegion`.
- La celebración es un diálogo con foco en «Seguir».
- Fuentes: respetar el tamaño de texto del sistema; las tarjetas deben crecer en alto.

## 9. Assets

Ver `assets/README.md`. En resumen:
- SVG (reutilizables): cinco estados de Mojón, versiones mono claro/oscuro, logos horizontales, íconos de app.
- A exportar como PNG: ícono iOS 1024 × 1024 (sin esquinas redondeadas), primer plano adaptativo de Android 432 × 432, splash (Mojón organizando sobre `#DDEFEB`).
- El wordmark usa texto SVG: convertirlo a contornos (o usar la fuente Bricolage Grotesque 700) antes de producción.

## 10. Datos simulados

`mock-data.json` contiene las tareas y objetivos semilla, la frase de ejemplo de voz y los ítems de revisión, los textos de error y los mensajes del encabezado. El prototipo asume «hoy = miércoles 14 de octubre» y «ahora = 15:00».

## 11. Contrato de API sugerido (FastAPI) — solo como orientación

- `POST /voice/transcribe` (audio) → `{ transcript }`
- `POST /voice/parse` `{ transcript, now, timezone }` → `{ items: [{ type: 'task'|'goal'|'unclear', title, date, time, durationMin, target, provenance: { date, time, durationMin }, quote? }] }`
- `GET/POST/PATCH /tasks`, `GET/POST/PATCH /goals`
- `provenance` por campo: `said | suggested | unresolved`. El cliente nunca debe tratar como definitivo un campo `suggested`.
- Zona horaria del usuario obligatoria (el prototipo usa America/Montevideo en los ejemplos).

## 12. Lo que el prototipo simula o no incluye

- No hay audio, transcripción, IA ni notificaciones reales.
- Los días del prototipo son etiquetas (Lun…Dom); en producción usar fechas ISO.
- «Ahora» usa un reloj fijo de 15:00; en producción, la hora real.
- Pendiente de diseño: modo oscuro, onboarding, ajustes, edición/borrado de objetivos, repetición de tareas, recordatorios y permisos de notificación, tamaños de tablet, internacionalización (hoy solo español rioplatense).

## 13. Orden sugerido de implementación

1. Tema (`tokens.ts`), fuentes, `PendiloMascot` con los cinco estados.
2. Tarjetas, chips, botones, barra inferior y micrófono; pantalla Hoy con datos simulados.
3. Flujo de voz con máquina de estados y transcripción simulada; revisión de tarjetas.
4. Semana y Progreso; toasts, banners y celebraciones.
5. Estados vacíos y de error; accesibilidad y movimiento reducido.
6. Recién entonces: backend (FastAPI), transcripción y `parse` reales.
