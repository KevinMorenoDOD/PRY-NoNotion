import type { BaseEntity } from "@shared/domain/BaseEntity";
import { NoteNodeType } from "./NoteNodeType";

export interface NoteNode extends BaseEntity {
  parentId: number | null;
  type: NoteNodeType;
  title: string;
  content: string | null;
  updatedAt: string;
}

export type SortField = "name" | "createdAt" | "updatedAt";
export type SortDirection = "asc" | "desc";

export function isFolder(node: NoteNode): boolean {
  return node.type === NoteNodeType.FOLDER;
}

export function nodeTitle(node: NoteNode): string {
  return node.title?.trim() ? node.title : "Sin título";
}
