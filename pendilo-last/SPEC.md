# Pendilo · Vistas actualizadas (entrega para Claude Code)

Fuente de verdad visual y de textos: los archivos `views/*.dc.html` (cada uno es una vista; `prototipos/Flujo*.dc.html` tiene la lógica completa). Este documento explica qué es cada vista. `legacy/` está obsoleto: no implementar (rachas, Progreso, Seguimiento).

Stack: React Native + Expo + TypeScript (cliente); FastAPI + PostgreSQL (servidor). Los .dc.html son HTML de referencia, no código reutilizable: imitar estructura, textos, estados y tiempos.

## Producto
- Solo dos horizontes: **Hoy** y un ciclo cerrado de **7 días** (Esta semana). Sin meses, rachas, récords, niveles, cofres ni escudos.
- Adictivo sin distraer: alivio al vaciar la cabeza, progreso visible al instante, micro-celebraciones breves, cierre semanal.
- Una acción principal por pantalla. Premiar lo hecho, no castigar lo pendiente.
- Voz primero, texto como alternativa. Todo lo de la voz pasa por Revisión antes de guardarse.
- Sugerencias de la IA siempre marcadas (borde punteado, `#8A4F05` sobre `#FFF6E5`) y editables.

Dos diseños con la misma estructura: **Mojón** (archivos `FlujoX`, teal) y **Eco** (archivos `FlujoDX`, magenta). Elegir uno para producción.

## Qué cambió
Nuevas: 01 Hoy (independiente), 04 Esta semana, 08 Revisión, 09 Confirmación (independiente). Modificadas: 02 Hoy sin tareas, 03 Todo hecho, 05 Escribir, 06 Grabando, 07 Procesando, 10 Error, barra de navegación, board Sistema. Eliminadas: Progreso y agenda Semana antigua. Archivada: Seguimiento con rachas.

| # | Vista | Mojón | Eco |
|---|---|---|---|
| 01 | Hoy | FlujoHoy | FlujoDHoy |
| 02 | Hoy sin tareas | FlujoVacio | FlujoDVacio |
| 03 | Todo hecho | FlujoHecho | FlujoDHecho |
| 04 | Esta semana | FlujoCiclo | FlujoDCiclo |
| 05 | Escribir tarea | FlujoEscribir | FlujoDEscribir |
| 06 | Grabando | FlujoGrabar | FlujoDGrabar |
| 07 | Procesando | FlujoCarga | FlujoDCarga |
| 08 | Revisión | FlujoRevision | FlujoDRevision |
| 09 | Confirmación | FlujoConfirmacion | FlujoDConfirmacion |
| 10 | Error | FlujoError | FlujoDError |

## Navegación
Barra flotante en píldora, visible solo en Hoy y Esta semana. Grid `1fr 1fr 88px 1fr 1fr`: Hoy | Semana | Micrófono (72 px, elevado -27 px, anillo 4 px color papel; inicia Grabando) | Escribir | Ajustes (engranaje, **sin acción por ahora**). Etiquetas siempre visibles, toque ≥44 px, relleno inferior para que no tape contenido.

## 01 · Hoy (`pantalla hoy`)
Objetivo: ver qué hay hoy y avanzar con la siguiente tarea. De arriba abajo: cabecera con mascota y mensaje corto; franja de progreso del día (segmentos por tarea; texto: "Empieza por la primera y avanzas el día" / "Vas bien: sigue con la siguiente" / "Solo falta 1 para cerrar tu día"); secciones **Ahora** (hasta 16:00), **Más tarde**, **Completadas** (colapsable); navegación.
Tarea: tarjeta blanca, borde 1 px `#E4E2DC`, radio 20. La primera pendiente lleva borde de énfasis y chip **Siguiente**; las nuevas, chip **Nueva**. Tocar el círculo completa (check elástico + micro-celebración). Tocar la fila expande: segmento de Día, hora −/+, **Posponer a mañana**, **Completar**. Estados por `datos`: con tareas, vacío (02), todo hecho (03). El contador no se repite en dos sitios.

## 02 · Hoy sin tareas
Hoy con `datos=vacío`. Distinto de Todo hecho: aún no se agregó nada. Cabecera con mascota, tarjeta vacía con una frase, botón principal de micrófono, alternativa Escribir, chips de atajo (Llamar a…, Comprar…, Enviar…, Pagar…) que abren Escribir con prefijo. Sin franja de progreso.

## 03 · Todo hecho
Hoy con `datos=todo hecho`. Tarjeta héroe con mascota celebrando (halo y destellos) y "Hiciste N de M tareas"; tarjeta de semana "N de M hechas" con acceso a Esta semana (sin cofre); tarjeta de ideas para anotar algo de mañana; Completadas plegada. Celebrar sin empujar a hacer más.

## 04 · Esta semana (`ciclo`)
Reemplaza Progreso y Semana. Leyenda "Semana 42 · Cierra en 4 días". Barra de 7 días (estados ok/parcial/futuro/hoy con pulso); tocar un día filtra la lista, tocar de nuevo quita el filtro. Segmentos de ciclo (primero "Plan listo" siempre encendido). **Ritmos**: objetivos por conteo como círculos de 44 px (Correr 2/3, Lectura profunda 1/3, Entrenamiento 1/4); tocar rellena el siguiente, volver a tocar quita el último. Chips de atajo. Lista: pendientes primero (hasta 4) y hechas (hasta 2); "N de M listas · Carga ligera/media/alta"; estado vacío y "Ver toda la semana". Sin rachas, récords ni cofres. **No diseñado aún:** cierre de semana del domingo.

## 05 · Escribir (`write`)
Campo de texto grande con cursor, chips de atajo con prefijo, botón "Agregar tarea" (56 px, deshabilitado si vacío), Cancelar. Al enviar: Procesando → Revisión.

## 06 · Grabando (`rec`)
Mascota con halo pulsante, onda de audio, punto de grabación con temporizador, "Te escucho…", transcripción en vivo con cursor, botón principal **Detener**, cancelar arriba. Nota de demo "no se graba audio real": quitar.

## 07 · Procesando (`proc`)
Mascota pensando y "Déjame organizar eso…". Nota de demo "no se usa IA real": quitar. Si falla → vista 10.

## 08 · Revisión (`review`)
Leyenda "Sólido: lo dijiste / Punteado: sugerencia". Una tarjeta por elemento (tarea u objetivo semanal) con título y chips, editable y removible. Sin día: "No dijiste cuándo. ¿Para cuándo la dejamos?" con selector. No entendido: "No entendí esta parte. Cuéntame qué era." + **Convertir en tarea**. Acción principal **Confirmar todo (N)** (deshabilitada con motivo visible si hay pendientes), secundaria Cancelar. Nada se guarda sin pasar por aquí.

## 09 · Confirmación (`done`)
Mascota celebrando, "Listo, ya organicé tu semana", tarjeta con resumen en filas con check (ej. 2 tareas para hoy, 1 para mañana, 1 objetivo semanal) y botón único **Ver mi día**.

## 10 · Error (`err`, prop `errTipo`)
| errTipo | Titular | Principal | Secundario |
|---|---|---|---|
| silence | No te escuché bien | Reintentar | Cancelar |
| perm | Necesito tu micrófono | Abrir ajustes | Cancelar |
| offline | Sin conexión | Reintentar | Descartar grabación |
| transcribe | No pude transcribir el audio | Reintentar | Grabar de nuevo |
offline y transcribe conservan la grabación (bloque "Lo que dijiste · guardado"). Rojo `#B3261E` solo en texto/icono de aviso.

## Sistema de diseño
| Token | Mojón | Eco |
|---|---|---|
| Acción | #2F6F73 | #B0245F |
| Oscuro | #1E4B4E | #8A1C4B |
| Medio | #4E9A97 | #D6347F |
| Claro | #9CCFC4 | #EE6FA8 |
| Fondo suave | #DDEFEB | #FBE3EE |
| Pista | #D5DCDA | #E6D5DD |

Compartidos: tinta `#16161C`, papel `#F4F3F0`, línea `#E4E2DC`, sugerencia `#8A4F05`/`#FFF6E5`, peligro `#B3261E`. Fuentes Bricolage Grotesque (títulos) e Instrument Sans (cuerpo, ≥16 px). Grid 8 px, márgenes 16–24, toque ≥44. Componentes: `.btn` (pill 56), `.btn2` (outline), `.task`, `.chip`, `.chk`, `.pg`. Nota: `tokens.json/ts` son de la fase anterior (Mojón); usar la tabla de arriba para Eco.

## Animaciones (todas se desactivan con prefers-reduced-motion)
bob (mascota reposo), hop (celebración), halo (anillos en Grabando/Todo hecho), spk (destellos), wbu/wave (barras de audio), nudge (micrófono), rpulse (hoy en Esta semana), pop (check elástico), recdot, caret.

## Datos de ejemplo a reemplazar
`seedTasks` (título, día, hora, hecha, origen), `seedGoals` (nombre, meta, avance), "Semana 42"/"Cierra en 4 días" (calcular de la fecha), carga (según pendientes), `seedReview` y `summary` (salen de la IA). Código muerto del prototipo: weekDays, dayList, overdue, dismissed. Sin diseñar: Cierre del día, Cierre de semana, Ajustes. No verificado visualmente en un renderizador; el board Sistema aún muestra la nav anterior; `types.ts`/`mock-data.json` son de la fase anterior y pueden requerir ajustes (objetivos por conteo, sin rachas).

## Orden sugerido
Sistema de diseño y navegación → Hoy (01–03) → captura (05–09) → Esta semana (04) → errores (10).
