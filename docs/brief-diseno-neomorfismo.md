# Brief de Diseño — Sistema de UI Neomórfico (Dark Mode)

## 1. Objetivo

Definir un sistema de diseño neomórfico (soft UI) para interfaz de control/reproductor, con estética oscura, táctil y minimalista, priorizando jerarquía visual mediante relieve y color de acento cian, no mediante bordes o contraste duro.

## 2. Principios de diseño

- **Superficie única:** todos los componentes "emergen" o "se hunden" del mismo fondo (`#343838`), nunca se sobreponen como tarjetas planas con sombra dura.
- **Estado > color:** el estado (activo/inactivo, presionado/normal) se comunica con relieve (extruido vs. hundido) + intensidad de color, no con bordes.
- **Minimalismo funcional:** sin iconografía decorativa, sin texturas, solo forma + luz + color de acento.
- **Accesibilidad primero:** dado que el neomorfismo tiene contraste bajo por diseño, cada componente interactivo necesita un estado "activo" claramente diferenciado en color y elevación.

## 3. Sistema de color y su rol funcional

| Token | Hex | Uso funcional |
|---|---|---|
| `--bg-surface` | `#343838` | Fondo base y superficie de reposo de todos los componentes |
| `--accent-hover` | `#005f6b` | Estado hover/pressed de elementos primarios |
| `--accent-primary` | `#008c9e` | Elementos activos por defecto (botones CH+/CH-, sliders activos) |
| `--accent-light` | `#00b4cc` | Estados activos con mayor énfasis, iconografía activa |
| `--accent-highlight` | `#00dffc` | Texto de acento, valores numéricos, indicadores de foco, glow en elementos "encendidos" |

**Regla de aplicación:** un componente inactivo usa solo `--bg-surface` + sombras (sin color); al activarse, transiciona a `--accent-primary` o `--accent-light`, y el detalle más brillante (texto, punto, borde fino) usa `--accent-highlight`.

## 4. Especificación de relieve (neomorphism)

- **Sombra extruida (reposo):**
  ```css
  box-shadow: 6px 6px 12px rgba(0,0,0,0.4), -6px -6px 12px rgba(255,255,255,0.03);
  ```
- **Sombra hundida (presionado/activo):**
  ```css
  box-shadow: inset 4px 4px 8px rgba(0,0,0,0.5), inset -4px -4px 8px rgba(255,255,255,0.02);
  ```
- **Radios:** 16–24px en tarjetas, 50% (circular) en botones de control, "pill" (`border-radius: 999px`) en sliders verticales
- **Grosor de borde de acento:** 1px, solo en componentes que lo requieran (favorito, lock, cloud, error)

## 5. Inventario de componentes

| Componente | Estados necesarios | Notas |
|---|---|---|
| Media card (imagen + BUY) | inactivo / activo | El botón BUY es el único elemento 100% relleno de color |
| Botón GPS/pin | normal / pressed | Circular, ícono outline |
| Grid de transporte (play/stop/prev/next/FF/RW) | normal / pressed | Íconos pequeños, sin color hasta interacción |
| Dial principal (power) | apagado / encendido / arrastrando | Marcas radiales como guía visual, no interactivas |
| Sliders verticales (música, modo noche, volumen) | valor bajo/medio/alto | El thumb (círculo) siempre en `--accent-primary` o `--accent-highlight` según valor |
| Botones circulares grandes (favorito, lock, cloud, error) | normal / seleccionado | Borde fino de acento + label debajo |
| Botones cuadrados (CH+/CH-/VOL) | inactivo (solo relieve) / activo (relleno color) | Par de estados claramente documentado |

## 6. Tipografía y jerarquía

- Sans-serif geométrica (ej. Inter, Poppins, SF Pro)
- Labels de botones: 10–11px, uppercase, letter-spacing amplio, color gris claro en reposo → `--accent-highlight` en activo
- Sin negritas pesadas; el peso visual lo da el relieve, no el texto

## 7. Entregables sugeridos

- Librería de componentes en Figma con auto-layout y variantes (normal/hover/pressed/active)
- Design tokens en JSON o CSS variables
- Guía de accesibilidad: contraste mínimo AA para texto sobre `#343838`
