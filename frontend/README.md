# Frontend — NoNotion

React 19 + Vite + TypeScript SPA with TanStack Query, Zustand, and TailwindCSS v4.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Dev server at `http://localhost:5173` (proxies API to `http://localhost:8080`).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + Vite 6 |
| Language | TypeScript 5.8 (strict mode) |
| Routing | React Router 7 |
| Server State | TanStack Query (React Query) 5 |
| Client State | Zustand 5 |
| Styling | TailwindCSS 4 (Vite plugin) |
| HTTP Client | Axios 1.11 |
| Linting | ESLint 9 + TypeScript ESLint |
| Build | Vite (esbuild + Rollup) |

## Project Structure

```
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── src/
│   ├── main.tsx                 # App entry point
│   ├── App.tsx                  # Routes + providers
│   ├── index.css                # Tailwind imports + global styles
│   ├── vite-env.d.ts
│   ├── modules/
│   │   ├── shared/              # Cross-cutting: API client, auth, error handling
│   │   │   ├── domain/          # BaseEntity, ApiError, User
│   │   │   ├── infrastructure/  # apiClient, authInterceptor, tokenStorage, errorHandler
│   │   │   ├── interfaces/      # Layout, Sidebar, ProtectedRoute
│   │   │   └── hooks/           # useAuth
│   │   ├── auth/                # Authentication module
│   │   │   ├── domain/          # (uses shared User)
│   │   │   ├── application/     # useLogin, useRegister, useLogout
│   │   │   ├── infrastructure/  # authApi (axios endpoints)
│   │   │   └── interfaces/      # LoginPage, RegisterPage, AuthForm
│   │   └── tasks/               # Tasks module
│   │       ├── domain/          # Task, TaskList, Priority, TaskStatus
│   │       ├── application/     # useTasks, useTaskLists, useCreateTask
│   │       ├── infrastructure/  # tasksApi, taskListsApi
│   │       └── interfaces/      # DashboardPage, TaskCard, TaskForm, TaskDetailModal, TaskListsSidebar
└── dist/                        # Production build output
```

## Architecture Patterns

### Module Structure (Feature-First)
Each business module follows:
```
module/
├── domain/           # Types, enums, pure logic (no deps)
├── application/      # Custom hooks (React Query mutations/queries)
├── infrastructure/   # API calls (axios), external adapters
└── interfaces/       # React components, pages, forms
```

### Data Flow
```
Component (interfaces)
    │
    ▼
Custom Hook (application)  ──►  TanStack Query Cache
    │                              │
    ▼                              ▼
API Client (infrastructure) ──►  Backend REST API
    │
    ▼
Auth Interceptor (adds JWT) / Error Handler
```

### State Management
- **Server state**: TanStack Query (caching, deduping, background refetch, optimistic updates)
- **Client state**: Zustand (auth user, theme, UI modals) — minimal, no boilerplate
- **No Redux/Context** for server data

## Available Scripts

```bash
npm run dev        # Start dev server (HMR)
npm run build      # Type-check + production build
npm run preview    # Preview production build locally
npm run typecheck  # TypeScript compile check (no emit)
npm run lint       # ESLint (flat config)
```

## Environment Variables

Create `.env.local` (not committed):

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Used in `src/modules/shared/infrastructure/apiClient.ts`.

## Key Files

### API Client (`src/modules/shared/infrastructure/apiClient.ts`)
- Axios instance with base URL
- Request interceptor: attaches `Authorization: Bearer <token>`
- Response interceptor: handles 401 → token refresh → retry once
- Centralized error normalization to `ApiError`

### Auth (`src/modules/auth/`)
- `useLogin` / `useRegister` / `useLogout` — TanStack Query mutations
- `useAuth` hook — provides `user`, `login`, `logout`, `isAuthenticated`
- Tokens stored in `localStorage` (access + refresh) via `tokenStorage.ts`
- `ProtectedRoute` wrapper for authenticated pages

### TanStack Query Provider (`src/App.tsx`)
```tsx
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    <BrowserRouter>
      <Routes>...</Routes>
    </BrowserRouter>
  </AuthProvider>
</QueryClientProvider>
```

### TailwindCSS v4 (`src/index.css`)
```css
@import "tailwindcss";
@theme {
  /* custom tokens if needed */
}
```
No `tailwind.config.js` needed (v4 uses CSS-first config).

## Adding a New Module

1. Create `src/modules/<feature>/` with domain/application/infrastructure/interfaces
2. Define domain types in `domain/`
3. Create API functions in `infrastructure/<feature>Api.ts`
4. Write custom hooks in `application/use<Feature>.ts` using `@tanstack/react-query`
5. Build components in `interfaces/`
6. Add routes in `App.tsx`
7. Export from `interfaces/index.ts` for clean imports

Example (tasks module):
```ts
// application/useTasks.ts
export function useTasks(listId: string) {
  return useQuery({
    queryKey: ['tasks', listId],
    queryFn: () => tasksApi.getByList(listId),
    enabled: !!listId,
  });
}

// interfaces/TaskCard.tsx
export function TaskCard({ task }: { task: Task }) { ... }
```

## API Integration

All endpoints defined in `infrastructure/*Api.ts` files:

```ts
// tasksApi.ts
export const tasksApi = {
  getByList: (listId: string) => apiClient.get<Task[]>(`/tasks?listId=${listId}`),
  create: (data: CreateTaskRequest) => apiClient.post<Task>('/tasks', data),
  update: (id: string, data: EditTaskRequest) => apiClient.patch<Task>(`/tasks/${id}`, data),
  delete: (id: string) => apiClient.delete(`/tasks/${id}`),
};
```

Backend API spec: [`../backend/README.md`](../backend/README.md#api-endpoints)

## Styling

- **TailwindCSS 4** utility classes
- Custom components in `interfaces/components/`
- Responsive: mobile-first breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
- Dark mode: `class` strategy (toggle via Zustand store)

## TypeScript Config

- `tsconfig.json` — project references
- `tsconfig.app.json` — app code (strict, DOM lib)
- `tsconfig.node.json` — Vite config / node scripts
- Path aliases: `@/*` → `src/*`

## Building for Production

```bash
npm run build
# Output in dist/
```

Deploy `dist/` to any static host (Nginx, Vercel, Netlify, S3+CloudFront).

### Nginx Example
```nginx
server {
  listen 80;
  server_name app.nonotion.local;
  root /var/www/nonotion/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api {
    proxy_pass http://localhost:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

## Docker

```dockerfile
# Dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

## Development Tips

- **React Query Devtools**: Enabled in dev (`App.tsx`)
- **Hot Module Replacement**: Vite HMR works out of the box
- **Type safety**: Run `npm run typecheck` before commit
- **API changes**: Update TypeScript types in `domain/` to match backend DTOs

## Related

- Backend API: [`../backend/README.md`](../backend/README.md)
- Database schema: [`../database/README.md`](../database/README.md)
- Project architecture: [`../docs/README.md`](../docs/README.md)