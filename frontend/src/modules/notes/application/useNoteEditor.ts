import { useCallback, useEffect, useRef, useState } from "react";
import type { NoteNode } from "../domain/NoteNode";
import type { EditNoteNodeRequest } from "../infrastructure/notesApi";

export type SaveStatus = "idle" | "dirty" | "saving" | "saved" | "error";

interface UseNoteEditorOptions {
  note: NoteNode | null;
  save: (id: number, data: EditNoteNodeRequest) => Promise<unknown>;
  delay?: number;
}

export function useNoteEditor({
  note,
  save,
  delay = 700,
}: UseNoteEditorOptions) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noteIdRef = useRef<number | null>(note?.id ?? null);
  const savedRef = useRef({ title: note?.title ?? "", content: note?.content ?? "" });
  const latestRef = useRef({ title: note?.title ?? "", content: note?.content ?? "" });

  useEffect(() => {
    latestRef.current = { title, content };
  }, [title, content]);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    noteIdRef.current = note?.id ?? null;
    setTitle(note?.title ?? "");
    setContent(note?.content ?? "");
    setStatus("idle");
    savedRef.current = {
      title: note?.title ?? "",
      content: note?.content ?? "",
    };
    setHistory([]);
    setHistoryIndex(-1);
  }, [note?.id]);

  const persist = useCallback(
    async (nextTitle: string, nextContent: string) => {
      const id = noteIdRef.current;
      if (id === null) return;
      setStatus("saving");
      try {
        await save(id, { title: nextTitle, content: nextContent });
        savedRef.current = { title: nextTitle, content: nextContent };
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    },
    [save]
  );

  const schedule = useCallback(
    (nextTitle: string, nextContent: string) => {
      if (timer.current) clearTimeout(timer.current);
      setStatus("dirty");
      timer.current = setTimeout(() => {
        persist(nextTitle, nextContent);
      }, delay);
    },
    [delay, persist]
  );

  const changeTitle = useCallback(
    (value: string) => {
      setTitle(value);
      schedule(value, content);
    },
    [content, schedule]
  );

  const changeContent = useCallback(
    (value: string, pushHistory = true) => {
      setContent(value);
      if (pushHistory) {
        setHistory((prev) => {
          const sliced = prev.slice(0, historyIndex + 1);
          return [...sliced, value].slice(-100);
        });
        setHistoryIndex((prev) => Math.min(prev + 1, 99));
      }
      schedule(title, value);
    },
    [title, schedule]
  );

  const saveNow = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    await persist(title, content);
  }, [persist, title, content]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    const value = history[nextIndex];
    setHistoryIndex(nextIndex);
    setContent(value);
    schedule(title, value);
  }, [history, historyIndex, schedule, title]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    const value = history[nextIndex];
    setHistoryIndex(nextIndex);
    setContent(value);
    schedule(title, value);
  }, [history, historyIndex, schedule, title]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
      const { title: t, content: c } = latestRef.current;
      if (t !== savedRef.current.title || c !== savedRef.current.content) {
        const id = noteIdRef.current;
        if (id !== null) {
          void save(id, { title: t, content: c });
        }
      }
    };
  }, [save]);

  return {
    title,
    content,
    status,
    isDirty: status === "dirty",
    changeTitle,
    changeContent,
    saveNow,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
}
