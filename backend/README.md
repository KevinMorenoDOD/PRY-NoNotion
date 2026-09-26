# Backend — NoNotion

Spring Boot 3 modular monolith (Java 21) implementing a clean/hexagonal architecture per module.

## Quick Start

```bash
cd backend
./mvnw spring-boot:run
```

Server starts at `http://localhost:8080`

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Architecture

```
src/main/java/com/nonotion/nonotion/
├── shared/                 # Cross-cutting concerns
│   ├── security/           # JWT, Spring Security config, user context
│   ├── exception/          # Global error handling, ApiError
│   └── domain/             # BaseEntity (audit fields)
├── auth/                   # Authentication & authorization module
│   ├── domain/model/       # User, RefreshToken, EmailVerificationToken, PasswordResetToken
│   ├── application/
│   │   ├── port/in/        # AuthUseCase (interface)
│   │   ├── port/out/       # UserRepository, *TokenRepository (interfaces)
│   │   ├── service/        # AuthService, TokenService
│   │   └── dto/            # Request/Response DTOs
│   ├── infrastructure/
│   │   ├── persistence/    # JPA adapters for repositories
│   │   └── security/       # UserDetailsService, UserPrincipal
│   └── interfaces/         # AuthController (REST endpoints)
└── tasks/                  # Tasks module (example business module)
    ├── domain/model/       # Task, TaskList, Priority, TaskStatus
    ├── application/
    │   ├── port/in/        # TasksUseCase, TaskListsUseCase
    │   ├── port/out/       # TasksRepository, TaskListsRepository
    │   ├── service/        # TasksService, TaskListsService
    │   └── dto/            # Request/Response DTOs
    ├── infrastructure/
    │   └── persistence/    # JPA adapters
    └── interfaces/         # TasksController, TaskListsController
```

### Modular Monolith Rules

1. **No direct internal imports** between modules — communicate via interfaces (ports)
2. **Hexagonal layers** per module: domain → application (ports + services) → infrastructure (adapters) → interfaces (controllers)
3. **Single deployable JAR** — all modules compile into one Spring Boot application
4. **Shared module** — `auth` and `shared` are base modules; business modules depend on them, not on each other

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | Java 21 (LTS) |
| Framework | Spring Boot 3.4+ |
| Security | Spring Security + JWT (JJWT 0.11.5) |
| Persistence | Spring Data JPA / Hibernate |
| Migrations | Flyway (classpath:db/migration) |
| AI | Spring AI (DeepSeek starter configured) |
| API Docs | SpringDoc OpenAPI 3.1 |
| Build | Maven Wrapper |
| DB | PostgreSQL 16 + pgvector |
| Validation | Bean Validation (Hibernate Validator) |

## Configuration

`src/main/resources/application.properties` (copy from `application.properties.example`):

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5433/nonotion
spring.datasource.username=nonotion
spring.datasource.password=nonotion

# JWT (generate a secure base64 key)
jwt.signing-key=<base64-encoded-256-bit-key>

# AI Provider (Spring AI)
spring.ai.deepseek.api-key=<your-api-key>
```

### Flyway Migrations

Located at `src/main/resources/db/migration/`:
- `V01_create_enums.sql` — Priority, TaskStatus enums
- `V02_create_schema.sql` — Core tables (users, tokens, task_lists, tasks)
- `V03_add_indexes.sql` — Performance & uniqueness indexes
- `V04_add_capacity_trigger.sql` — Max tasks per list guard
- `V05_validate_note_node_trigger.sql` — Note node validation

Run automatically on startup (`flyway.enabled=true`).

## API Endpoints

### Auth (`/api/v1/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login, returns access + refresh tokens |
| POST | `/refresh` | Refresh access token |
| POST | `/logout` | Invalidate refresh token |
| POST | `/forgot-password` | Request password reset email |
| POST | `/reset-password` | Reset password with token |
| POST | `/verify-email` | Verify email with token |
| GET | `/me` | Get current user profile |

### Tasks (`/api/v1/task-lists`, `/api/v1/tasks`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/task-lists` | List user's task lists |
| POST | `/task-lists` | Create task list |
| GET | `/task-lists/{id}` | Get task list with tasks |
| PATCH | `/task-lists/{id}` | Rename task list |
| DELETE | `/task-lists/{id}` | Delete task list |
| GET | `/tasks?listId={id}` | List tasks (filter by list) |
| POST | `/tasks` | Create task |
| PATCH | `/tasks/{id}` | Update task |
| DELETE | `/tasks/{id}` | Delete task |

All endpoints require `Authorization: Bearer <access-token>` header.

## Development

```bash
# Run tests
./mvnw test

# Build JAR
./mvnw package

# Run with custom profile
./mvnw spring-boot:run -Dspring.profiles.active=dev
```

## Adding a New Module

1. Create package `com.nonotion.nonotion.<module>`
2. Follow hexagonal structure: `domain/`, `application/port/{in,out}`, `application/service/`, `application/dto/`, `infrastructure/`, `interfaces/`
3. Define port interfaces in `application/port/`
4. Implement adapters in `infrastructure/`
5. Expose REST controllers in `interfaces/`
6. Wire in Spring config (repository beans, service beans)
7. Add Flyway migrations if schema changes needed

## Security Notes

- Passwords: BCrypt (via Spring Security)
- JWT: HS256, 15min access / 7d refresh token expiry
- All business endpoints filter by authenticated user (`user_id`)
- CORS configured for frontend origin (adjust in `SecurityConfig`)

## Database

See [../database/README.md](../database/README.md) for schema details and manual migration commands.

## Docker

From project root:
```bash
docker-compose -f database/docker-compose.yml up -d
./mvnw spring-boot:run
```

Or build backend image:
```bash
docker build -t nonotion-backend ./backend
```