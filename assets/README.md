# Assets de Pendilo

Todos los gráficos son SVG vectoriales sobre un lienzo de 200 × 200 (Mojón) salvo indicación.

| Archivo | Uso | Notas |
|---|---|---|
| `mojon-escuchando.svg`, `mojon-pensando.svg`, `mojon-organizando.svg`, `mojon-celebrando.svg`, `mojon-descansando.svg` | Los cinco estados de la mascota | Mismas tres piedras; cambian cara y posición. Para animar, separar cada piedra en su propio `<G>` con `react-native-svg`. |
| `mojon-mono-sobre-claro.svg`, `mojon-mono-sobre-oscuro.svg` | Una sola tinta | Los cortes entre piedras usan el color del fondo; solo sobre fondo plano blanco u oscuro. |
| `logo-pendilo-claro.svg`, `logo-pendilo-oscuro.svg` | Logo horizontal | El texto es `<text>` con Bricolage Grotesque 700: **convertir a contornos** antes de producción. |
| `icono-ios-1024.svg` | Ícono de iOS | Exportar a PNG 1024 × 1024, sin transparencia ni esquinas redondeadas. |
| `icono-android-primer-plano-432.svg` | Ícono adaptativo de Android | Primer plano con transparencia; fondo = color sólido `#DDEFEB`. |

## Exportar como imagen (PNG)

- Ícono iOS 1024 × 1024.
- Primer plano adaptativo de Android 432 × 432 (y el mismo para `monochrome` si se quiere ícono temático: usar la versión mono).
- Splash: Mojón organizando centrado (≈ 200 px) sobre `#DDEFEB`.
- Favicon / ícono web 48 × 48 si hace falta.

## No existen todavía

- Versión del logo con el wordmark ya en contornos.
- Ilustraciones adicionales, 3D o fotografía: el sistema no las usa.
- Íconos de interfaz: son trazos simples de 2 px (micrófono, check, alerta, sol, calendario, anillo, más/menos, lápiz, cerrar). En el prototipo están como SVG en línea; en producción usar una librería de íconos equivalente o dibujarlos con `react-native-svg`.
- Nombre «Pendilo»: no se verificó disponibilidad de marca, dominio ni tiendas de aplicaciones.
