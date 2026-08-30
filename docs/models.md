# Data Model

Initial data model for the **`auth`** and **`tasks`** (todo) modules.

- Modular monolith: each module owns its tables.
- Business tables filter by `user_id` (row-level multi-tenant security — nobody sees another user's data).
- Schema is versioned with **Flyway** migrations living in `backend/src/main/resources/db/migration` (`V1__auth.sql`, `V2__todo.sql`).
- Database: **PostgreSQL 16**. Timestamps are `timestamptz` (with timezone).
- No roles table for now (future addition, not required for the first modules).

---

## Auth module (`V1__auth.sql`)

### `users`

| column | type | constraints | notes |
|---|---|---|---|
| `id` | `bigserial` | PK | |
| `email` | `varchar(255)` | not null, **unique** | login identifier |
| `password_hash` | `varchar(255)` | not null | bcrypt hash |
| `display_name` | `varchar(255)` | not null | |
| `email_verified` | `boolean` | not null default false | set after verification |
| `created_at` | `timestamptz` | not null default now() | |
| `updated_at` | `timestamptz` | not null default now() | |

### `refresh_tokens`

Stores the **active** refresh token per user (rotation, single row — overwritten on refresh, previous token invalidated).

| column | type | constraints | notes |
|---|---|---|---|
| `id` | `bigserial` | PK | |
| `user_id` | `bigint` | FK → `users(id)`, not null | |
| `token_hash` | `varchar(255)` | not null | hash of the token, never the raw JWT |
| `expires_at` | `timestamptz` | not null | |
| `created_at` | `timestamptz` | not null default now() | |

### `email_verification_tokens`

| column | type | constraints | notes |
|---|---|---|---|
| `id` | `bigserial` | PK | |
| `user_id` | `bigint` | FK → `users(id)`, not null | |
| `token_hash` | `varchar(255)` | not null | hash of the token |
| `expires_at` | `timestamptz` | not null | |
| `created_at` | `timestamptz` | not null default now() | |

### `password_reset_tokens`

| column | type | constraints | notes |
|---|---|---|---|
| `id` | `bigserial` | PK | |
| `user_id` | `bigint` | FK → `users(id)`, not null | |
| `token_hash` | `varchar(255)` | not null | hash of the token |
| `expires_at` | `timestamptz` | not null | |
| `used_at` | `timestamptz` | nullable | set when consumed |
| `created_at` | `timestamptz` | not null default now() | |

---

## Todo module (`V2__todo.sql`)

### `task_lists`

Grouping for tasks (e.g. Work, Personal). Soft-deletable.

| column | type | constraints | notes |
|---|---|---|---|
| `id` | `bigserial` | PK | |
| `user_id` | `bigint` | FK → `users(id)`, not null | |
| `name` | `varchar(255)` | not null | |
| `color` | `varchar(50)` | nullable | UI accent |
| `sort_order` | `int` | not null default 0 | manual ordering |
| `created_at` | `timestamptz` | not null default now() | |
| `deleted_at` | `timestamptz` | nullable | soft delete |

### `tasks`

| column | type | constraints | notes |
|---|---|---|---|
| `id` | `bigserial` | PK | |
| `user_id` | `bigint` | FK → `users(id)`, not null | |
| `list_id` | `bigint` | FK → `task_lists(id)`, nullable | task may be unassigned |
| `title` | `varchar(255)` | not null | |
| `description` | `text` | nullable | |
| `priority` | `varchar(20)` | not null | enum `LOW` / `MEDIUM` / `HIGH` |
| `due_date` | `timestamptz` | nullable | |
| `status` | `varchar(20)` | not null default `TODO` | enum `TODO` / `IN_PROGRESS` / `DONE` |
| `created_at` | `timestamptz` | not null default now() | |
| `updated_at` | `timestamptz` | not null default now() | |
| `deleted_at` | `timestamptz` | nullable | soft delete |

---

## Indexes

| table | columns | notes |
|---|---|---|
| `users` | `email` | unique |
| `refresh_tokens` | `user_id`, `token_hash` | lookups and rotation checks |
| `email_verification_tokens` | `user_id`, `token_hash` | |
| `password_reset_tokens` | `user_id`, `token_hash` | |
| `task_lists` | `user_id` | |
| `tasks` | `user_id` | plus composite `(user_id, status)` for list/filter queries |
| `tasks` | `list_id` | |

---

## Conventions & decisions

- **Token hashing:** store a hash of the token string, never the raw JWT/token — a DB leak does not expose usable tokens.
- **Enums as varchar:** JPA `@Enumerated(EnumType.STRING)`; readable and extendable.
- **`status` enum over `done` boolean:** `TODO / IN_PROGRESS / DONE` is forward-compatible with the future workflows/Kanban module.
- **Soft delete** on `task_lists` and `tasks` via nullable `deleted_at` — avoids accidental data loss.
- **Refresh-token rotation, single row** per user — invalidated and replaced on each refresh.
- **Not yet modeled** (future modules): projects, notes, workflows, embeddings, AI conversations.
