-- V05: Seed data
-- Demo data for local development only. NOT for production.
-- Passwords below are placeholders — replace with real bcrypt hashes in dev.

INSERT INTO users (email, password_hash, display_name, email_verified)
VALUES
    ('alice@example.com',  '$2a$10$replace_me_with_a_real_bcrypt_hash', 'Alice',  TRUE),
    ('bob@example.com',    '$2a$10$replace_me_with_a_real_bcrypt_hash', 'Bob',    FALSE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO task_lists (user_id, name, color, capacity, sort_order)
SELECT id, 'Personal', '#f43f5e', 50, 0 FROM users WHERE email = 'alice@example.com'
UNION ALL
SELECT id, 'Work', '#3b82f6', 20, 1 FROM users WHERE email = 'alice@example.com'
UNION ALL
SELECT id, 'Work', '#10b981', 20, 0 FROM users WHERE email = 'bob@example.com';

INSERT INTO tasks (user_id, list_id, title, description, priority, status, due_date)
SELECT
    u.id,
    l.id,
    t.title,
    t.description,
    t.priority::priority,
    t.status::task_status,
    t.due_date
FROM (VALUES
    ('alice@example.com', 'Personal', 'Buy groceries',      'Milk, eggs, bread',                 'MEDIUM', 'TODO',         now() + interval '2 days'),
    ('alice@example.com', 'Personal', 'Call mom',           NULL,                                'LOW',    'DONE',         now() - interval '1 day'),
    ('alice@example.com', 'Work',     'Write sprint report', 'Summarize progress for the team',  'HIGH',   'IN_PROGRESS',  now() + interval '1 day'),
    ('bob@example.com',   'Work',     'Refactor auth module', 'Extract JWT service',             'HIGH',   'TODO',         NULL)
) AS t(email, list_name, title, description, priority, status, due_date)
JOIN users u ON u.email = t.email
JOIN task_lists l ON l.user_id = u.id AND l.name = t.list_name;
