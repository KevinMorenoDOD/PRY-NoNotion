-- V04: Capacity column + trigger
-- Guard: a task list cannot exceed its `capacity` of active (non-deleted) tasks.

ALTER TABLE task_lists
    ADD COLUMN IF NOT EXISTS capacity INT NOT NULL DEFAULT 50;

CREATE OR REPLACE FUNCTION enforce_task_list_capacity()
RETURNS TRIGGER AS $$
DECLARE
    list_capacity INT;
    active_count  BIGINT;
BEGIN
    SELECT capacity INTO list_capacity
    FROM task_lists
    WHERE id = NEW.list_id;

    IF list_capacity IS NULL THEN
        RETURN NEW;
    END IF;

    SELECT count(*) INTO active_count
    FROM tasks
    WHERE list_id = NEW.list_id
      AND deleted_at IS NULL;

    IF active_count >= list_capacity THEN
        RAISE EXCEPTION 'task list % has reached its capacity of % tasks', NEW.list_id, list_capacity;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_task_list_capacity ON tasks;

CREATE TRIGGER trg_enforce_task_list_capacity
    BEFORE INSERT ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION enforce_task_list_capacity();
