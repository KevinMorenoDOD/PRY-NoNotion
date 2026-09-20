# Frontend Order — Arquitectura, UI Neomorphism y Orden de Implementación

> Guía de referencia para la construcción del frontend de **NoNotion**.

---

## 1. Arquitectura hexagonal del frontend

El frontend replica la misma arquitectura hexagonal del backend, adaptada a React + TypeScript:

```
┌─────────────────────────────────────────────────────┐
│                   INTERFACES (UI)                    │
│   Componentes React, páginas, hooks de presentación  │
├─────────────────────────────────────────────────────┤
│                  APPLICATION (casos de uso)          │
│   Custom hooks que orquestan la lógica de negocio    │
├─────────────────────────────────────────────────────┤
│                INFRAESTRUCTURA (adaptadores)         │
│   API clients, interceptores, almacenamiento         │
├─────────────────────────────────────────────────────┤
│                    DOMAIN (núcleo)                    │
│   Tipos TypeScript, interfaces, enums puros          │
└─────────────────────────────────────────────────────┘
```

**Regla de dependencia:** las flechas van de afuera hacia adentro. Nunca al revés.

| Capa | Contenido | Depende de |
|---|---|---|
| `domain/` | Tipos, interfaces, enums | Nada |
| `application/` | Custom hooks (casos de uso) | `domain/`, `infrastructure/` |
| `infrastructure/` | API clients, interceptores | `domain/` |
| `interfaces/` | Componentes, páginas | `application/`, `domain/` |

---

## 2. Estructura de módulos

Cada módulo del frontend espeja un bounded context del backend:

```
frontend/src/modules/
├── shared/          ← Espejo de shared/ (base compartida)
│   ├── domain/
│   ├── infrastructure/
│   └── interfaces/
├── auth/            ← Espejo de auth/ (autenticación)
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── interfaces/
└── tasks/           ← Espejo de tasks/ (tareas)
    ├── domain/
    ├── application/
    ├── infrastructure/
    └── interfaces/
```

**Mapeo backend → frontend:**

| Backend | Frontend | Responsabilidad |
|---|---|---|
| `shared/domain/BaseEntity` | `shared/domain/BaseEntity.ts` | Tipos base (id, createdAt) |
| `shared/exception/ApiError` | `shared/domain/ApiError.ts` | Tipo de error HTTP |
| `shared/security/JwtService` | `shared/infrastructure/tokenStorage.ts` | Gestión de tokens |
| `shared/security/JwtAuthFilter` | `shared/infrastructure/authInterceptor.ts` | Adjunta JWT a requests |
| `shared/exception/GlobalExceptionHandler` | `shared/infrastructure/errorHandler.ts` | Parsea errores del backend |
| `shared/security/SecurityConfig` | `shared/infrastructure/apiClient.ts` | Instancia HTTP centralizada |
| `shared/security/CurrentUser` | `shared/interfaces/hooks/useAuth.ts` | Estado de autenticación |
| `interfaces/*Controller` | `infrastructure/*Api.ts` | Llamadas HTTP a la API |

---

## 3. Estilo UI: Neomorphism

### 3.1 ¿Qué es Neomorphism?

Neomorphism (neumorfismo) es un estilo de diseño visual que simula superficies tridimensionales suaves, como si los elementos estuvieran "sobresaliendo" o "hundidos" del fondo. Es una evolución del flat design que agrega profundidad sin ser realista.

### 3.2 Reglas de diseño

1. **Fondo plano y uniforme:** todos los elementos comparten el mismo color de fondo (no hay contraste fuerte entre superficies).
2. **Sombras dobles:** cada elemento tiene dos sombras — una oscura (arriba-izquierda) y una clara (abajo-derecha) — que crean la ilusión de volumen.
3. **Bordes redondeados:** todos los elementos tienen `border-radius` generoso (12px-20px).
4. **Colores apagados:** la paleta es monocromática o con acentos sutiles. No hay colores saturados dominando.
5. **Espaciado generoso:** mucho espacio entre elementos para que las sombras se lean bien.
6. **Estado hundido/sobresalido:**
   - **Sobresalido (elevado):** sombra oscura arriba-izquierda + sombra clara abajo-derecha.
   - **Hundido (pressed):** sombra oscura abajo-derecha + sombra clara arriba-izquierda (inverso).

### 3.3 Paleta de colores

```
.color1 { #343838 }   ← Fondo principal / superficies
.color2 { #005f6b }   ← Hover activo / acento secundario
.color3 { #008c9e }   ← Primario normal
.color4 { #00b4cc }   ← Primario claro
.color5 { #00dffc }   ← Texto acento / highlights
```

**Uso en la UI:**

| Elemento | Color | Ejemplo |
|---|---|---|
| Fondo de página | `#343838` | Body, sidebar |
| Superficies (cards) | `#3a3e3e` | Tarjetas, paneles |
| Botones primarios | `#008c9e` | Acciones principales |
| Hover de botones | `#005f6b` | Estado hover |
| Texto de acento | `#00dffc` | Títulos, links activos |
| Texto normal | `#cdd6f4` | Contenido general |
| Texto muted | `#6c7086` | Placeholders, secundario |
| Bordes | `#45475a` | Separadores |
| Error | `#f38ba8` | Mensajes de error |
| Éxito | `#a6e3a1` | Confirmaciones |

### 3.4 Variables CSS para Neomorphism

```css
@theme {
  /* Paleta de colores */
  --color-color1: #343838;
  --color-color2: #005f6b;
  --color-color3: #008c9e;
  --color-color4: #00b4cc;
  --color-color5: #00dffc;

  /* Neomorphism tokens */
  --color-neo-bg: #343838;
  --color-neo-surface: #3a3e3e;
  --color-neo-shadow-dark: #2a2e2e;
  --color-neo-shadow-light: #3e4242;
  --color-neo-accent: #008c9e;
  --color-neo-text: #00dffc;
  --color-neo-text-muted: #6c7086;
}
```

### 3.5 Mixins de sombras neomorphism

```css
/* Elemento sobresalido (elevado) */
.neo-elevated {
  box-shadow:
    6px 6px 12px var(--color-neo-shadow-dark),
    -6px -6px 12px var(--color-neo-shadow-light);
}

/* Elemento hundido (pressed) */
.neo-pressed {
  box-shadow:
    inset 6px 6px 12px var(--color-neo-shadow-dark),
    inset -6px -6px 12px var(--color-neo-shadow-light);
}

/* Botón neomorphism */
.neo-button {
  background: var(--color-neo-bg);
  border-radius: 12px;
  box-shadow:
    4px 4px 8px var(--color-neo-shadow-dark),
    -4px -4px 8px var(--color-neo-shadow-light);
  transition: all 0.2s ease;
}

.neo-button:hover {
  box-shadow:
    2px 2px 4px var(--color-neo-shadow-dark),
    -2px -2px 4px var(--color-neo-shadow-light);
}

.neo-button:active {
  box-shadow:
    inset 2px 2px 4px var(--color-neo-shadow-dark),
    inset -2px -2px 4px var(--color-neo-shadow-light);
}

/* Input neomorphism */
.neo-input {
  background: var(--color-neo-bg);
  border: none;
  border-radius: 12px;
  box-shadow:
    inset 4px 4px 8px var(--color-neo-shadow-dark),
    inset -4px -4px 8px var(--color-neo-shadow-light);
  padding: 12px 16px;
  color: var(--color-text);
  outline: none;
}

.neo-input:focus {
  box-shadow:
    inset 4px 4px 8px var(--color-neo-shadow-dark),
    inset -4px -4px 8px var(--color-neo-shadow-light),
    0 0 0 2px var(--color-neo-accent);
}
```

---

## 4. Orden de implementación

El orden es de adentro hacia afuera (misma regla que el backend): primero lo que no depende de nada, después lo que depende de lo anterior.

### Paso 1: Módulo `shared` (base compartida)

```
1. domain/
   ├── BaseEntity.ts        (interfaz pura, sin dependencias)
   ├── ApiError.ts          (tipo de error, sin dependencias)
   └── User.ts              (tipo de usuario, sin dependencias)

2. infrastructure/
   ├── tokenStorage.ts      (depende de: nada)
   ├── apiClient.ts         (depende de: tokenStorage)
   ├── authInterceptor.ts   (depende de: apiClient, tokenStorage)
   └── errorHandler.ts      (depende de: ApiError)

3. interfaces/hooks/
   └── useAuth.ts           (depende de: apiClient, tokenStorage, User)

4. interfaces/components/
   ├── ProtectedRoute.tsx   (depende de: useAuth)
   ├── Sidebar.tsx          (depende de: nada visual)
   └── Layout.tsx           (depende de: Sidebar)
```

### Paso 2: Módulo `auth` (autenticación)

```
5. domain/
   (no necesita archivos adicionales, usa User de shared)

6. application/
   ├── useLogin.ts          (depende de: authApi, tokenStorage, useAuth)
   ├── useRegister.ts       (depende de: authApi, tokenStorage, useAuth)
   └── useLogout.ts         (depende de: authApi, tokenStorage, useAuth)

7. infrastructure/
   └── authApi.ts           (depende de: apiClient)

8. interfaces/
   ├── LoginPage.tsx        (depende de: useLogin)
   ├── RegisterPage.tsx     (depende de: useRegister)
   └── components/
       └── AuthForm.tsx     (componente de formulario reutilizable)
```

### Paso 3: Módulo `tasks` (tareas)

```
9. domain/
   ├── Priority.ts          (enum, sin dependencias)
   ├── TaskStatus.ts        (enum, sin dependencias)
   ├── Task.ts              (depende de: BaseEntity, Priority, TaskStatus)
   └── TaskList.ts          (depende de: BaseEntity)

10. application/
    ├── useTaskLists.ts     (depende de: taskListsApi, TaskList)
    ├── useTasks.ts         (depende de: tasksApi, Task)
    └── useCreateTask.ts    (depende de: tasksApi, Task)

11. infrastructure/
    ├── taskListsApi.ts     (depende de: apiClient)
    └── tasksApi.ts         (depende de: apiClient)

12. interfaces/
    ├── DashboardPage.tsx   (depende de: useTaskLists, useTasks)
    ├── TaskListPage.tsx    (depende de: useTasks)
    └── components/
        ├── TaskCard.tsx    (depende de: Task)
        ├── TaskForm.tsx    (depende de: useCreateTask, Priority, TaskStatus)
        └── TaskListsSidebar.tsx (depende de: useTaskLists)
```

---

## 5. Convenciones del proyecto frontend

| Convención | Descripción |
|---|---|
| **Idioma** | Todo en inglés (código, tipos, nombres de archivos) |
| **Nomenclatura archivos** | PascalCase para componentes (`TaskCard.tsx`), camelCase para hooks/utilidades (`useAuth.ts`, `tokenStorage.ts`) |
| **Export default** | Solo para componentes React. Hooks y utilidades usan named exports |
| **Tipos** | Interfaces para DTOs de respuesta, type para DTOs de request |
| **Rutas** | `/api/v1/...` para auth, `/api/...` para otros módulos |
| **Aliases** | `@shared/*`, `@auth/*`, `@tasks/*` (configurados en vite.config.ts y tsconfig) |
| **Neomorphism** | Usar las variables CSS (`neo-*`) para mantener consistencia visual |
| **Sin comentarios** | El código debe explicarse solo |
| **Un componente por archivo** | Cada componente React en su propio archivo |

---

## 6. Dependencias de datos (API)

```
authApi.ts ──────────────────────────────────────────────┐
  POST /api/v1/auth/register   → { accessToken, refreshToken, user }
  POST /api/v1/auth/login      → { accessToken, refreshToken, user }
  POST /api/v1/auth/refresh    → { accessToken, refreshToken, user }
  POST /api/v1/auth/logout     → 204
  GET  /api/v1/auth/me         → { id, email, displayName, emailVerified }

taskListsApi.ts ────────────────────────────────────────┐
  POST   /api/task-lists       → { id, name, color, sortOrder }
  GET    /api/task-lists       → [{ id, name, color, sortOrder }]
  PUT    /api/task-lists/:id   → { id, name, color, sortOrder }
  DELETE /api/task-lists/:id   → 204

tasksApi.ts ───────────────────────────────────────────┐
  POST   /api/tasks            → { id, taskListId, title, ... }
  GET    /api/tasks            → [{ id, taskListId, title, ... }]
  GET    /api/tasks/:id        → { id, taskListId, title, ... }
  PUT    /api/tasks/:id        → { id, taskListId, title, ... }
  DELETE /api/tasks/:id        → { id, taskListId, title, ... }
```

---

## 7. Resumen visual

```
┌──────────────────────────────────────────────────────────────┐
│                    NO NOTION - FRONTEND                       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │   auth   │  │  tasks   │  │   (++)   │                   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                   │
│       │              │              │                         │
│  ┌────┴──────────────┴──────────────┴──────┐                 │
│  │              shared (base)              │                 │
│  └─────────────────────────────────────────┘                 │
│                                                              │
│  UI: Neomorphism │ Colores: #343838 → #00dffc                │
│  React + TypeScript + Vite + Tailwind v4                     │
└──────────────────────────────────────────────────────────────┘
```
