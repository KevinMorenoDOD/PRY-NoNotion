import { useMemo } from "react";
import type { NoteNode } from "../domain/NoteNode";
import { isFolder, nodeTitle } from "../domain/NoteNode";

export interface SearchResult {
  node: NoteNode;
  matchIn: "title" | "content";
  excerpt: string;
}

function buildExcerpt(content: string, query: string): string {
  const index = content.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return content.slice(0, 120);
  const start = Math.max(0, index - 40);
  const end = Math.min(content.length, index + query.length + 80);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < content.length ? "…" : "";
  return `${prefix}${content.slice(start, end)}${suffix}`;
}

export function useNoteSearch(
  nodes: NoteNode[],
  query: string,
  includeFolders = false
): SearchResult[] {
  return useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const results: SearchResult[] = [];
    for (const node of nodes) {
      if (!includeFolders && isFolder(node)) continue;

      const title = nodeTitle(node);
      if (title.toLowerCase().includes(trimmed)) {
        results.push({ node, matchIn: "title", excerpt: title });
        continue;
      }
      if (node.content && node.content.toLowerCase().includes(trimmed)) {
        results.push({
          node,
          matchIn: "content",
          excerpt: buildExcerpt(node.content, trimmed),
        });
      }
    }
    return results.slice(0, 50);
  }, [nodes, query, includeFolders]);
}
