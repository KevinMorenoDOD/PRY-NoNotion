-- V03: Indexes
-- Performance and uniqueness indexes. See docs/models.md for the index plan.

-- users.email already unique (defined inline in V02).

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id   ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);

CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id   ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token_hash ON email_verification_tokens(token_hash);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id   ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token_hash ON password_reset_tokens(token_hash);

CREATE INDEX IF NOT EXISTS idx_task_lists_user_id ON task_lists(user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id       ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status   ON tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_list_id       ON tasks(list_id);

CREATE INDEX IF NOT EXISTS idx_note_nodes_user_parent ON note_nodes(user_id, parent_id);
CREATE INDEX IF NOT EXISTS idx_note_nodes_parent       ON note_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_note_nodes_user_type    ON note_nodes(user_id, type);
