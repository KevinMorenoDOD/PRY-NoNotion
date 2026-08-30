-- V01: Enum types
-- Priority and status stored as enums, mapped in JPA via @Enumerated(EnumType.STRING).

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority') THEN
        CREATE TYPE priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
        CREATE TYPE task_status AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');
    END IF;
END $$;


