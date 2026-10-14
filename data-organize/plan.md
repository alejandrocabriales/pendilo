# Pendilo — Implementación Mobile + AI Engineering

Actúa como un Staff Software Engineer especializado en React Native, Expo, TypeScript, Python, FastAPI y AI Engineering.

Vamos a desarrollar **Pendilo**, un asistente personal con IA que transforma mensajes de voz en tareas, recordatorios, planificación semanal y seguimiento de objetivos.

El diseño ya está terminado en Claude Design.

Tengo en el proyecto un directorio con la especificación visual, design tokens, componentes, assets, tipos y datos simulados.

Tu trabajo es convertir ese diseño en una aplicación móvil real y posteriormente desarrollar su backend en Python.

## 1. REGLA FUNDAMENTAL

El desarrollo se divide en dos grandes fases:

**FASE 1 — Mobile UI completamente funcional con mock data.**

**FASE 2 — Backend Python + FastAPI, base de datos e integración real con IA.**

No mezcles ambas fases.

No desarrolles el backend mientras trabajamos en la primera.

No implementes servicios reales de IA, transcripción, autenticación ni notificaciones push durante la primera fase.

La Fase 1 debe terminar con una aplicación móvil funcional, navegable y visualmente fiel al diseño, utilizando exclusivamente datos simulados.

Debes esperar mi aprobación explícita antes de comenzar la Fase 2.

---

# 2. PRIMER PASO — AUDITORÍA DEL HANDOFF

Antes de escribir código:

1. Inspecciona la estructura del repositorio.
2. Localiza el directorio con los archivos de Claude Design.
3. Lee completamente la especificación de diseño.
4. Revisa `tokens.json`, `tokens.ts`, `types.ts` y `mock-data.json`.
5. Inspecciona los SVG, logos y estados de la mascota Mojón.
6. Identifica las pantallas y sus interacciones.
7. Detecta contradicciones, dependencias faltantes y elementos incompatibles con React Native.
8. Revisa si ya existe un proyecto Expo antes de crear uno nuevo.

No supongas que el prototipo web es reutilizable como código React Native.

Utiliza su diseño, estructura, assets y comportamiento como referencia.

No inventes una nueva identidad visual.

No cambies colores, tipografías, textos, componentes ni mascota sin justificación y aprobación.

Si faltan assets o especificaciones, repórtalo antes de sustituirlos.

---

# 3. STACK TECNOLÓGICO

## Mobile

- React Native
- Expo
- TypeScript en modo estricto
- Expo Router
- Zustand para estado de interfaz y sesiones
- React Native Reanimated para animaciones
- React Native SVG para ilustraciones vectoriales
- Expo Font para tipografías
- Librerías oficiales de Expo cuando corresponda

Prioriza APIs estables y compatibles con la versión de Expo instalada.

Evita dependencias innecesarias.

## Backend — Exclusivamente Fase 2

- Python 3.12+ compatible con las dependencias elegidas
- FastAPI
- Pydantic v2
- SQLAlchemy 2
- Alembic
- PostgreSQL
- Pytest
- HTTPX para pruebas y solicitudes HTTP cuando corresponda

Para IA utilizaremos APIs de modelos de lenguaje, preferiblemente mediante OpenAI u OpenRouter según las capacidades requeridas.

No uses Anthropic SDK por defecto.

La arquitectura debe permitir cambiar de proveedor de modelos sin reescribir la lógica principal.

---

# 4. ESTRUCTURA DEL REPOSITORIO

Propón una estructura monorepo sencilla:

pendilo/
  mobile/
  backend/
  design/
  docs/

En Fase 1, solo se implementará `mobile/`.

El directorio `design/` debe conservar los assets y las especificaciones originales.

No muevas ni borres archivos existentes sin mi aprobación.

---

# 5. FASE 1 — MOBILE CON MOCK DATA

## Objetivo

Implementar una aplicación Expo ejecutable en un teléfono real.

Todas las pantallas e interacciones del diseño deben funcionar con datos simulados.

No quiero solamente un prototipo estático.

Quiero una aplicación que pueda usar y probar, aunque todavía no tenga inteligencia artificial real.

## Etapa 1.1 — Fundamentos

- Configurar Expo y TypeScript.
- Configurar Expo Router.
- Integrar tipografías.
- Implementar design tokens.
- Integrar la mascota Mojón y sus cinco estados.
- Configurar navegación.
- Implementar componentes básicos reutilizables.

La apariencia debe respetar fielmente el handoff.

## Etapa 1.2 — Pantalla Hoy

Implementar:

- Saludo personalizado.
- Mascota.
- Tarjetas de tareas.
- Grupos Ahora, Más tarde y Completadas.
- Indicador de progreso.
- Completar y descompletar tareas.
- Expandir tarjetas.
- Posponer.
- Cambiar fecha y hora.
- Toast con opción de deshacer.
- Estados vacíos.
- Celebración al completar el día.

Todos los datos provienen del repositorio mock.

## Etapa 1.3 — Flujo de voz simulado

Implementar las pantallas:

- Escuchando.
- Procesando.
- Revisión.
- Confirmación.
- Errores.

Durante esta fase no se graba audio real.

El botón de micrófono inicia una simulación claramente identificada como demostración.

Utiliza la transcripción incluida en `mock-data.json`.

Simula la aparición progresiva de texto y el procesamiento.

Después muestra las tareas y objetivos detectados.

Permite:

- Editar tareas.
- Cambiar fechas.
- Eliminar elementos.
- Confirmar.
- Cancelar.
- Reintentar errores simulados.

Respeta la procedencia de los campos:

- said
- suggested
- unresolved

No permitas confirmar elementos que requieren aclaración obligatoria.

La transcripción y las tareas deben mantenerse durante los reintentos simulados.

## Etapa 1.4 — Semana

Implementar:

- Navegación horizontal entre días.
- Listas por fecha.
- Contadores de tareas.
- Tareas vencidas.
- Reprogramación.
- Completar tareas.
- Estados vacíos.
- Banners de sugerencia.

Utilizar fechas reales en formato ISO, no etiquetas fijas.

La fecha actual debe calcularse dinámicamente utilizando la zona horaria configurada.

Los ejemplos deben funcionar independientemente del día en que se ejecute la aplicación.

## Etapa 1.5 — Progreso

Implementar:

- Objetivos semanales.
- Indicadores de progreso.
- Contadores.
- Actualización manual.
- Resumen semanal.
- Celebraciones.
- Estados vacíos.

Los cambios deben reflejarse inmediatamente en la interfaz.

## Etapa 1.6 — Calidad

Verificar:

- Navegación.
- Interacciones.
- Consistencia visual.
- Accesibilidad.
- Safe areas.
- Tamaños táctiles.
- Estados de carga y error.
- Movimiento reducido.
- Funcionamiento en iOS y Android.
- TypeScript sin errores.
- Pruebas automatizadas de la lógica crítica.

No implementar funcionalidades adicionales no contempladas en el diseño.

---

# 6. ARQUITECTURA DE MOCKS

Este punto es especialmente importante.

No quiero que los componentes importen directamente `mock-data.json`.

Diseña una abstracción que permita cambiar posteriormente los mocks por llamadas reales a FastAPI.

Ejemplo conceptual:

TaskRepository
  list()
  create()
  update()
  complete()
  reschedule()

GoalRepository
  list()
  updateProgress()

VoiceService
  processMockSession()

Implementa versiones mock de estas interfaces.

En la Fase 2, implementaremos adaptadores HTTP que respeten los mismos contratos.

Los componentes de UI no deben conocer si los datos provienen de mocks o del servidor.

Mantén separados:

- Presentación.
- Estado de interfaz.
- Casos de uso.
- Acceso a datos.

No introduzcas una arquitectura empresarial excesivamente compleja.

Prioriza simplicidad, claridad y facilidad de sustitución.

---

# 7. PERSISTENCIA EN FASE 1

Los cambios deben persistir localmente para poder probar la aplicación durante varios días.

Utiliza una solución local apropiada para Expo, como AsyncStorage, detrás de la capa de repositorios.

Los datos iniciales pueden cargarse desde `mock-data.json`.

Evita reiniciar automáticamente todas las tareas cada vez que se abre la aplicación.

Incluye una opción de desarrollo para restaurar los datos simulados.

No confundas esta persistencia local con la base de datos definitiva.

---

# 8. MODELO DE DATOS

Utiliza TypeScript para definir contratos claros.

Entidades principales:

Task
Goal
VoiceSession
ParsedItem

Task debe contemplar:

- id
- title
- scheduledAt
- durationMin
- status
- createdAt
- updatedAt

Goal debe contemplar:

- id
- title
- kind
- value
- target
- period
- status

VoiceSession debe contemplar:

- id
- transcript
- status
- parsedItems
- error

ParsedItem debe incluir:

- type
- title
- date
- time
- durationMin
- provenance
- quote

Estos campos son una propuesta inicial.

Antes de implementarlos, compáralos con `types.ts` del handoff.

Conserva compatibilidad con el diseño y señala los ajustes necesarios.

No uses tipos `any` para evitar resolver problemas de modelado.

---

# 9. CRITERIOS DE ACEPTACIÓN DE FASE 1

La fase se considera terminada cuando:

1. La aplicación arranca correctamente en Expo.
2. Puedo navegar entre Hoy, Semana y Progreso.
3. La identidad visual coincide con Claude Design.
4. Las tarjetas funcionan.
5. Puedo completar y posponer tareas.
6. Los cambios persisten localmente.
7. Puedo simular una sesión de voz.
8. Aparecen las tareas detectadas.
9. Puedo revisar y confirmar las tareas.
10. Las tareas confirmadas aparecen en el día correspondiente.
11. Puedo actualizar objetivos.
12. Las celebraciones funcionan.
13. Los errores simulados tienen recuperación.
14. La interfaz respeta accesibilidad y safe areas.
15. Las pruebas críticas pasan.

No consideres terminada la fase únicamente porque la aplicación compila.

Debes proporcionar instrucciones para ejecutarla y una lista de comprobaciones manuales.

Cuando termine, detente y solicita mi aprobación.

---

# 10. FASE 2 — BACKEND PYTHON + FASTAPI

Esta fase comienza solamente después de mi aprobación.

## Objetivo

Sustituir progresivamente los servicios mock por funcionalidades reales.

El backend será un servicio independiente escrito en Python.

La aplicación Expo se comunicará con FastAPI mediante HTTP.

## Etapa 2.1 — Fundamentos Python

Crear:

- Proyecto Python.
- Entorno virtual y gestión de dependencias.
- FastAPI.
- Configuración por entorno.
- Pydantic.
- Manejo centralizado de errores.
- Logging.
- Pruebas con Pytest.

Comenzar con un endpoint de salud y un endpoint sencillo.

## Etapa 2.2 — Persistencia

Implementar:

- PostgreSQL.
- SQLAlchemy 2.
- Alembic.
- Modelos de tareas y objetivos.
- Repositorios.
- Endpoints CRUD.
- Validación de entradas.
- Pruebas de integración.

Antes de integrar el móvil, verificar los endpoints de manera independiente.

## Etapa 2.3 — Integración Mobile ↔ Backend

Crear adaptadores HTTP en React Native.

Sustituir los repositorios mock por implementaciones reales.

Mantener los componentes visuales existentes.

Implementar:

- Estados de carga.
- Manejo de errores.
- Reintentos controlados.
- Sincronización.
- Persistencia de tareas y objetivos.

No reescribir pantallas que ya funcionan.

## Etapa 2.4 — Audio y transcripción

Implementar captura real de audio en Expo.

Enviar el audio al backend.

FastAPI debe:

1. Recibir el archivo.
2. Validar formato y tamaño.
3. Procesar la transcripción mediante un proveedor compatible.
4. Devolver el texto.
5. Manejar errores.

No guardar audio permanentemente salvo que exista una necesidad explícita.

Nunca incluir claves de proveedores de IA dentro de la aplicación móvil.

## Etapa 2.5 — Interpretación con LLM

Implementar un servicio Python que transforme transcripciones en tareas estructuradas.

Flujo:

Transcripción
→ Extracción de intenciones
→ Validación estructurada
→ Resolución de fechas
→ Propuestas de horarios
→ Revisión del usuario
→ Persistencia.

Utilizar Pydantic para validar la salida estructurada.

Distinguir información explícita, sugerida y no resuelta.

No inventar fechas como si el usuario las hubiera dicho.

El usuario debe confirmar antes de crear tareas definitivas.

## Etapa 2.6 — Planificación

Implementar un servicio de planificación que tenga en cuenta:

- Fecha actual.
- Zona horaria.
- Disponibilidad.
- Duración de tareas.
- Prioridades.
- Tareas existentes.
- Preferencias del usuario.

No usar un LLM para toda la lógica de planificación si las reglas deterministas resuelven mejor el problema.

El LLM interpreta la intención.

El servicio de planificación aplica reglas verificables.

## Etapa 2.7 — Recordatorios

Implementar recordatorios reales mediante notificaciones locales de Expo para tareas con fecha y hora.

Evaluar posteriormente si se necesitan notificaciones push remotas.

Los recordatorios deben poder actualizarse o cancelarse cuando una tarea cambie.

No agregar infraestructura de push si las notificaciones locales resuelven el MVP.

---

# 11. AI ENGINEERING — OBJETIVO DE APRENDIZAJE

Estoy utilizando este proyecto para aprender Python y AI Engineering.

No quiero que solamente generes código sin explicar las decisiones.

Durante la Fase 2, explica brevemente:

- Qué problema resuelve cada componente.
- Por qué usamos esa herramienta.
- Qué alternativas existen.
- Qué trade-offs introduce.
- Cómo fluye la información.
- Cómo verificar que funciona.

Quiero entender especialmente:

- FastAPI.
- Pydantic.
- Async Python.
- Integración con APIs de LLM.
- Structured Outputs.
- Tool calling cuando realmente sea necesario.
- Gestión de contexto.
- Evaluaciones de extracción de tareas.
- Manejo de errores.
- Persistencia.

No introduzcas agentes autónomos, RAG ni bases vectoriales simplemente para utilizar tecnologías de IA.

Inclúyelos solamente si existe un problema real que los justifique.

En los componentes educativos más importantes, proponme pequeños ejercicios o preguntas antes de entregar toda la implementación.

No conviertas cada cambio trivial en una clase teórica.

---

# 12. FORMA DE TRABAJAR

Trabaja de manera incremental.

Antes de cada etapa:

1. Explica qué se implementará.
2. Identifica los archivos que se modificarán.
3. Explica las decisiones arquitectónicas importantes.
4. Propón criterios de aceptación.

Después de implementar:

1. Ejecuta las verificaciones disponibles.
2. Informa los resultados reales.
3. Indica qué funciona.
4. Indica qué falta.
5. Explica cómo puedo probarlo.

No afirmes que algo funciona si no fue probado.

No hagas refactors masivos sin necesidad.

No instales librerías sin justificar su uso.

No cambies la arquitectura acordada sin consultarme.

---

# 13. INSTRUCCIÓN DE INICIO

Comienza ahora exclusivamente con el análisis del handoff de Claude Design.

Quiero que:

1. Inspecciones los archivos existentes.
2. Resumas las pantallas y componentes identificados.
3. Detectes inconsistencias o elementos faltantes.
4. Propongas la estructura del proyecto Expo.
5. Dividas la Fase 1 en tareas pequeñas y verificables.
6. Identifiques dependencias necesarias.
7. Señales los riesgos de implementación.

No escribas código todavía.

Preséntame el plan de Fase 1 y espera mi aprobación.

Recuerda:

**Primero una aplicación móvil funcional con mocks. Después Python + FastAPI + PostgreSQL + IA real.**
