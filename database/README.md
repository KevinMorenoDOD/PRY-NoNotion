# Database

PostgreSQL 16 schema for NoNotion. Scripts are Flyway-compatible (numbered `V*`).

## Structure

```
database/
├── README.md
├── migrations/
│   ├── V01_create_enums.sql          # Enums: priority, task status
│   ├── V02_create_schema.sql         # Tables: users, tokens, task_lists, tasks
│   ├── V03_add_indexes.sql           # Performance + uniqueness indexes
│   └── V04_add_capacity_trigger.sql  # Guard: max tasks per list
├── seeds/
│   └── V05_seed_data.sql             # Demo data
└── diagrams/
    └── mer_diagram.html              # Interactive ER diagram
```

## Modules modeled

- **auth** — `users`, `refresh_tokens`, `email_verification_tokens`, `password_reset_tokens`
- **todo (tasks)** — `task_lists`, `tasks`

See [`docs/models.md`](../docs/models.md) for the field-level data model and design decisions.

## Applying the migrations

Run in order against an empty `nonotion` database:

```bash
psql -U <user> -d nonotion -f database/migrations/V01_create_enums.sql
psql -U <user> -d nonotion -f database/migrations/V02_create_schema.sql
psql -U <user> -d nonotion -f database/migrations/V03_add_indexes.sql
psql -U <user> -d nonotion -f database/migrations/V04_add_capacity_trigger.sql
psql -U <user> -d nonotion -f database/seeds/V05_seed_data.sql
```

> These scripts are kept alongside the backend so they can be wired into Flyway
> (`backend/src/main/resources/db/migration`) or applied manually. See `docs/README.md`.
