-- V05: Soft-delete status
-- Adds the DELETED value to the task_status enum so deleted tasks can be
-- distinguished from tasks that were simply completed.

ALTER TYPE task_status ADD VALUE IF NOT EXISTS 'DELETED';
