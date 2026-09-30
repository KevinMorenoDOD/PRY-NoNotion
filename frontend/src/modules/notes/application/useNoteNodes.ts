import { useState, useEffect, useCallback } from "react";
import {
  notesApi,
  type CreateNoteNodeRequest,
  type EditNoteNodeRequest,
} from "../infrastructure/notesApi";
import { parseApiError } from "@shared/infrastructure/errorHandler";
import type { NoteNode } from "../domain/NoteNode";
import type { ApiError } from "@shared/domain/ApiError";

export function useNoteNodes() {
  const [noteNodes, setNoteNodes] = useState<NoteNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchNoteNodes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await notesApi.getAll();
      setNoteNodes(data);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNoteNodes();
  }, [fetchNoteNodes]);

  const createNoteNode = useCallback(async (data: CreateNoteNodeRequest) => {
    const { data: created } = await notesApi.create(data);
    setNoteNodes((prev) => [...prev, created]);
    return created;
  }, []);

  const editNoteNode = useCallback(async (id: number, data: EditNoteNodeRequest) => {
    const { data: updated } = await notesApi.edit(id, data);
    setNoteNodes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return updated;
  }, []);

  const patchLocal = useCallback((id: number, data: Partial<NoteNode>) => {
    setNoteNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...data } : n)));
  }, []);

  const deleteNoteNode = useCallback(async (id: number) => {
    await notesApi.delete(id);
    setNoteNodes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const moveNoteNode = useCallback(
    async (id: number, parentId: number | null) => {
      patchLocal(id, { parentId });
      return editNoteNode(id, { parentId });
    },
    [editNoteNode, patchLocal]
  );

  const renameNoteNode = useCallback(
    async (id: number, title: string) => {
      patchLocal(id, { title });
      return editNoteNode(id, { title });
    },
    [editNoteNode, patchLocal]
  );

  return {
    noteNodes,
    isLoading,
    error,
    createNoteNode,
    editNoteNode,
    deleteNoteNode,
    moveNoteNode,
    renameNoteNode,
    patchLocal,
    refetch: fetchNoteNodes,
  };
}
