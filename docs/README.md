# NoNotion — Project Plan

> **Nota de aprendizaje (en español, a propósito).** Este proyecto es mi espacio para aprender el proceso completo de desarrollo de software: arquitectura, backend, frontend, base de datos, IA e integración. Aquí dejo registrado **cómo** se construye y **por qué** se toman cada una de las decisiones que aparecen en el plan, para poder revisarlas después y entender la evolución de mis criterios. El resto del proyecto intenta usar inglés (código, convenciones y documentación técnica); esta declaración queda en español porque es una nota personal.

> Personal workspace for notes, activities, projects and workflows with an internal AI that answers questions about your own content.

---

## 1. Vision

A single application (backend + frontend) that brings together:

- **Notes** (free form Markdown), organized by categories and tags.
- **Projects** with status, dates and description.
- **Activities / Tasks** you want or need to do, with priority and deadline.
- **Workflows** that assign states and transitions to tasks.
- **Internal AI** that you can ask about what lives inside your profile.

Everything designed to **grow easily**: it is built small and simple, but with an architecture that lets you add features without redoing anything.

---

## 2. The design pattern: Modular Monolith

This is the name of the design you had in mind.

> **Modular Monolith** = a single deployable application (a single JAR), but organized internally into **modules with clear boundaries**. Each module is independent, with its own domain, its own rules and its own internal API.

### Why this and not microservices?

| Criterion | Modular Monolith | Microservices |
|---|---|---|
| Initial complexity | Low | High |
| Deployment | 1 artifact | N services |
| Adding features | Easy (create a module) | Easy but costly |
| Performance | No network overhead between modules | Latency between services |
| Clear boundaries | Yes (modules) | Yes (services) |

### And how does it scale?

If a module grows too much, it can be **extracted** into a microservice without touching the rest. The modules are already separated, so extraction is like "copy the folder and expose it over HTTP".

### Modular monolith rules

1. A module does **not import** the internal classes of another module directly.
2. Modules communicate through **interfaces** (for example: `NotesService`, `TasksRepository`).
3. Each module follows **Hexagonal / Clean Architecture** internally (domain, application, infrastructure).
4. A single final artifact (a Spring Boot JAR), no matter how many modules there are.
5. `auth` and `shared` are base modules that everything depends on (but business modules do not depend on each other).

```
┌──────────────────────────────────────────────────────────────┐
│                        SPRING BOOT (JAR)                     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌────────┐ ┌───────┐            │
│  │ auth │ │notes │ │tasks │ │projects│ │workfl.│  ...        │
│  └──┬───┘ └──┬───┘ └──┬───┘ └───┬────┘ └──┬────┘            │
│     │        │        │         │         │                  │
│  ┌──┴────────┴────────┴─────────┴─────────┴──────┐            │
│  │              shared (common base)              │            │
│  └───────────────────────────────────────────────┘            │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Technology stack

### Backend (Java, as much as possible)

| Layer | Technology | Why |
|---|---|---|
| Language | **Java 21 (LTS)** | Project base |
| Framework | **Spring Boot 3** | Standard, mature, dependency injection |
| Security | **Spring Security + JWT** | Multi-user login |
| Persistence | **Spring Data JPA** | ORM, repositories per module |
| DB migrations | **Flyway** | Schema versioning in `bd/` |
| AI | **Spring AI** | Provider abstraction (local or cloud) |
| Build | **Maven** | Multi-module management |
| Tests | JUnit 5 + Mockito | Unit tests per module |

### Frontend (React)

| Layer | Technology | Why |
|---|---|---|
| Framework | **React 18 + Vite + TypeScript** | Development speed and type safety |
| Routing | **React Router** | Navigation (notes, tasks, projects, chat) |
| Server state | **TanStack Query** | Cache + sync with the REST API |
| Global state | **Zustand** | Lightweight, for UI (theme, session) |
| Styles | **TailwindCSS** | Fast, consistent prototyping |
| Notes editor | **TipTap** | WYSIWYG Markdown |

### Database

| Technology | Why |
|---|---|
| **PostgreSQL 16** | Relational, robust |
| **pgvector** | Extension to store the AI *embeddings* (semantic search) |

### AI (abstraction)

Spring AI lets you set a **provider by configuration**, without touching code:

- **Local / free**: Ollama (Llama 3, Mistral, etc.)
- **Cloud / paid**: OpenAI, Anthropic, Google Gemini

> Config in `application.yml`: `spring.ai.provider=ollama` → switch the model and you're done.

### Deployment

| Technology | Why |
|---|---|
| **Docker + Docker Compose** | Bring up DB, backend and frontend with a single command |

---

## 4. General architecture

```
 Browser (React SPA)
      │  HTTPS / JSON
      ▼
 ┌───────────────────────────┐
 │ REST API (Spring Boot)    │   Modular Monolith
 │  · auth (JWT)             │
 │  · /api/v1/notes          │
 │  · /api/v1/tasks          │
 │  · /api/v1/projects       │
 │  · /api/v1/workflows      │
 │  · /api/v1/ai/chat        │
 └─────────────┬─────────────┘
               │
       ┌───────┴────────┐
       │   PostgreSQL    │
       │  + pgvector     │   (embeddings and data)
       └────────────────┘
```

**Data flow with the internal AI:**

```
[User notes/tasks/projects]
        │  ingestion (on save)
        ▼
[Generate embedding → pgvector]
        │
        ▼
[User question → Spring AI]
        │  semantic search (only YOUR content)
        ▼
[Retrieved context + question → LLM]
        │
        ▼
[Contextualized answer]
```

---

## 5. Functional modules

| Module | Responsibility |
|---|---|
| **`auth`** | Registration, login, JWT, user profile |
| **`notes`** | Markdown notes, categories, tags, search, favorites |
| **`projects`** | Projects: name, description, status, dates, linked notes |
| **`tasks`** | Activities: title, priority, deadline, status, assignment to project/user |
| **`workflows`** | Definition of states and transitions (e.g. `Backlog → In progress → Done`), assignment rules |
| **`ai`** | Internal chat + semantic search (RAG) over the user's content |
| **`shared`** | Common base: security, audit, utilities, error handling |

**Key rule:** all business modules **filter by user** (nobody sees another user's data). The AI too: it only queries the authenticated user's content.

---

## 6. Repository structure

```
PRY-NoNotion/
├── backend/                 # Java modules (modular monolith)
│   ├── pom.xml
│   └── src/main/java/com/nonotion/
│       ├── shared/          # security, errors, utilities
│       ├── auth/
│       ├── notes/
│       ├── tasks/
│       ├── projects/
│       ├── workflows/
│       └── ai/
├── frontend/                # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/           # Notes, Tasks, Projects, Workflows, Chat
│   │   ├── components/
│   │   ├── services/        # API client
│   │   └── store/           # Zustand
│   └── package.json
├── bd/
│   ├── init.sql             # DB creation and extensions (pgvector)
│   └── migrations/          # Flyway SQL (or they live in backend/resources/db/migration)
└── docs/
    └── README.md            # This document
```

**Note on migrations:** it is recommended to keep them with Flyway inside `backend/src/main/resources/db/migration` (they travel with the backend), and leave only the `init.sql` in `bd/` (create the DB and enable pgvector).

---

## 7. Initial data model

```
users (id, email, password_hash, display_name, created_at)

notes (id, user_id, title, content_md, category, tags, favorite, created_at, updated_at)
       · content_md → an embedding is generated on save

projects (id, user_id, name, description, status, start_date, due_date)

tasks (id, user_id, project_id, title, description, priority, due_date, status, assigned_to)

workflow_states (id, user_id, name, color, sort_order)        # e.g. Backlog, In progress, Done
workflow_transitions (id, user_id, from_state, to_state, label) # movement rules

embeddings (id, user_id, source_type, source_id, content_text, embedding vector)

ai_conversations (id, user_id, question, answer, created_at)
```

---

## 8. Phased roadmap

Each phase leaves the app **usable** and builds on top of the previous one.

### Phase 0 — Skeleton
- [ ] Folder structure backend/frontend/bd
- [ ] Base Spring Boot + empty modules + `shared`
- [ ] React + Vite + Tailwind base
- [ ] `docker-compose.yml` (PostgreSQL + pgvector)
- [ ] Flyway + `init.sql`
- [ ] **`auth` module**: registration, login, JWT (Spring Security)

### Phase 1 — Notes
- [ ] Notes CRUD (Markdown)
- [ ] Categories and tags
- [ ] Basic search
- [ ] Notes screen in React

### Phase 2 — Projects and tasks
- [ ] Projects CRUD
- [ ] Tasks CRUD (priority, due date, assignment)
- [ ] Link tasks to projects and notes
- [ ] Activities panel (simple board)

### Phase 3 — Workflows
- [ ] Define states and transitions per user
- [ ] Move tasks between states with rules
- [ ] Kanban board per workflow

### Phase 4 — Internal AI (RAG)
- [ ] Generate embeddings when saving content
- [ ] Semantic search (pgvector) per user
- [ ] Chat with Spring AI (configurable engine: Ollama/cloud)
- [ ] Conversation history

### Phase 5 — Polish
- [ ] Unit and integration tests per module
- [ ] Pagination and performance
- [ ] API documentation (OpenAPI/Swagger)

---

## 9. Key decisions (and why)

| Decision | Why |
|---|---|
| **Modular Monolith** | Simple today, extensible tomorrow. Modules are added, not services. |
| **Java + Spring Boot** | Whole backend in Java, mature and with a big ecosystem. |
| **React + TypeScript** | Modern and maintainable frontend. |
| **pgvector** | Semantic search without setting up extra infra (Elasticsearch/separate vector DB). |
| **Spring AI** | Abstracts the AI: you start free with local Ollama and migrate to cloud without changing code. |
| **Docker Compose** | Reproducible environment in a single command. |

---

## 10. Project conventions

- **Project language:** everything in English (code, convention names, docs and UI). The only Spanish is the personal learning note at the top.
- **Versioned API:** `/api/v1/...`.
- **Data isolated per user:** every query filters by `user_id` (row-level multi-tenant security).
- **No unnecessary comments:** the code must explain itself.
- **A module doesn't know how the others are implemented** (only their interfaces).
- **Migrations always with Flyway**, never `ddl-auto: update` in production.