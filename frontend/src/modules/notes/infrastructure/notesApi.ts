import { apiClient } from "@shared/infrastructure/apiClient";
import type { NoteNode } from "../domain/NoteNode";
import type { NoteNodeType } from "../domain/NoteNodeType";

export interface CreateNoteNodeRequest {
  parentId: number | null;
  type: NoteNodeType;
  title: string;
  content?: string;
}

export interface EditNoteNodeRequest {
  parentId?: number | null;
  title?: string;
  content?: string;
}

const USE_MOCK = false;

const STORAGE_KEY = "nonotion_mock_notes";

function getMockNotes(): NoteNode[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setMockNotes(notes: NoteNode[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function createMockResponse<T>(data: T) {
  return Promise.resolve({ data, status: 200, statusText: "OK", headers: {}, config: {} });
}

export const notesApi = {
  async getAll(parentId?: number) {
    if (USE_MOCK) {
      const notes = getMockNotes();
      const filtered =
        parentId !== undefined
          ? notes.filter((n) => n.parentId === parentId)
          : notes;
      return createMockResponse(filtered);
    }
    const params = parentId !== undefined ? `?parentId=${parentId}` : "";
    return apiClient.get<NoteNode[]>(`/note-nodes${params}`);
  },

  async getById(id: number) {
    if (USE_MOCK) {
      const notes = getMockNotes();
      const note = notes.find((n) => n.id === id);
      if (!note) throw new Error("Note not found");
      return createMockResponse(note);
    }
    return apiClient.get<NoteNode>(`/note-nodes/${id}`);
  },

  async create(data: CreateNoteNodeRequest) {
    if (USE_MOCK) {
      const notes = getMockNotes();
      const now = new Date().toISOString();
      const newNote: NoteNode = {
        id: generateId(),
        createdAt: now,
        updatedAt: now,
        parentId: data.parentId,
        type: data.type,
        title: data.title,
        content: data.content ?? null,
      };
      setMockNotes([...notes, newNote]);
      return createMockResponse(newNote);
    }
    return apiClient.post<NoteNode>("/note-nodes", data);
  },

  async edit(id: number, data: EditNoteNodeRequest) {
    if (USE_MOCK) {
      const notes = getMockNotes();
      const index = notes.findIndex((n) => n.id === id);
      if (index === -1) throw new Error("Note not found");
      const updated = {
        ...notes[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      notes[index] = updated;
      setMockNotes(notes);
      return createMockResponse(updated);
    }
    return apiClient.patch<NoteNode>(`/note-nodes/${id}`, data);
  },

  async delete(id: number) {
    if (USE_MOCK) {
      const notes = getMockNotes();
      setMockNotes(notes.filter((n) => n.id !== id));
      return createMockResponse(undefined);
    }
    return apiClient.delete(`/note-nodes/${id}`);
  },
};
