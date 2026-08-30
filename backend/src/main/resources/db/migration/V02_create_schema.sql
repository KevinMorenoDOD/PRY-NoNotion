-- V02: Schema
-- Tables for the auth and todo (tasks) modules.
-- Timestamps are timestamptz. Business tables filter by user_id (row-level multi-tenancy).

-- ---------------------------------------------------------------------------
-- auth module
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name  VARCHAR(255) NOT NULL,
    email_verified BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Active refresh token per user (rotation, single row — overwritten on refresh).
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ  NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ  NOT NULL,
    used_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- todo (tasks) module
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS task_lists (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name       VARCHAR(255) NOT NULL,
    color      VARCHAR(50),
    sort_order INT         NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS tasks (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    list_id     BIGINT       REFERENCES task_lists(id) ON DELETE SET NULL,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    priority    priority     NOT NULL DEFAULT 'MEDIUM',
    due_date    TIMESTAMPTZ,
    status      task_status  NOT NULL DEFAULT 'TODO',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted_at  TIMESTAMPTZ
);
