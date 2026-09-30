import type { NoteNode } from "./NoteNode";
import { isFolder, nodeTitle } from "./NoteNode";

export function countWords(text: string): number {
  const plain = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~\-+]/g, " ")
    .trim();
  if (!plain) return 0;
  return plain.split(/\s+/).filter(Boolean).length;
}

export function countChars(text: string): number {
  return text.length;
}

const WIKI_LINK_RE = /\[\[([^\]]+)\]\]/g;

export function extractWikiLinks(content: string | null): string[] {
  if (!content) return [];
  const matches = content.matchAll(WIKI_LINK_RE);
  return Array.from(matches, (m) => m[1].trim()).filter(Boolean);
}

export function wikiLinksToMarkdown(content: string | null): string {
  if (!content) return "";
  return content.replace(WIKI_LINK_RE, (_match, title: string) => {
    const clean = title.trim();
    return `[${clean}](wiki:${encodeURIComponent(clean)})`;
  });
}

export function computeBacklinks(
  nodes: NoteNode[],
  target: NoteNode | null
): NoteNode[] {
  if (!target) return [];
  const targetTitle = nodeTitle(target).toLowerCase();
  return nodes.filter((node) => {
    if (node.id === target.id || isFolder(node)) return false;
    return extractWikiLinks(node.content).some(
      (link) => link.toLowerCase() === targetTitle
    );
  });
}

export interface TextSelection {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

export function toggleWrap(
  { value, selectionStart, selectionEnd }: TextSelection,
  marker: string
): { value: string; selectionStart: number; selectionEnd: number } {
  const selected = value.slice(selectionStart, selectionEnd);
  const before = value.slice(0, selectionStart);
  const after = value.slice(selectionEnd);
  const wrapped = `${marker}${selected || "texto"}${marker}`;
  const next = `${before}${wrapped}${after}`;
  return {
    value: next,
    selectionStart: selectionStart + marker.length,
    selectionEnd: selectionStart + marker.length + (selected || "texto").length,
  };
}

export function wrapSelection(
  { value, selectionStart, selectionEnd }: TextSelection,
  open: string,
  close: string
): { value: string; selectionStart: number; selectionEnd: number } {
  const selected = value.slice(selectionStart, selectionEnd);
  const before = value.slice(0, selectionStart);
  const after = value.slice(selectionEnd);
  const inner = selected || "texto";
  const wrapped = `${open}${inner}${close}`;
  const next = `${before}${wrapped}${after}`;
  return {
    value: next,
    selectionStart: selectionStart + open.length,
    selectionEnd: selectionStart + open.length + inner.length,
  };
}

export function toggleLinePrefix(
  { value, selectionStart, selectionEnd }: TextSelection,
  prefix: string
): { value: string; selectionStart: number; selectionEnd: number } {
  const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
  const block = value.slice(lineStart, selectionEnd);
  const lines = block.split("\n");
  const already = lines.every((l) => l.startsWith(prefix));
  const updated = lines
    .map((l) => (already ? l.slice(prefix.length) : `${prefix}${l}`))
    .join("\n");
  const next = value.slice(0, lineStart) + updated + value.slice(selectionEnd);
  return {
    value: next,
    selectionStart: lineStart,
    selectionEnd: lineStart + updated.length,
  };
}

export function insertBlock(
  { value, selectionStart, selectionEnd }: TextSelection,
  block: string
): { value: string; selectionStart: number; selectionEnd: number } {
  const before = value.slice(0, selectionStart);
  const after = value.slice(selectionEnd);
  const needsLeading = before.length > 0 && !before.endsWith("\n");
  const prefix = needsLeading ? "\n" : "";
  const text = `${prefix}${block}\n`;
  const next = `${before}${text}${after}`;
  const pos = before.length + text.length;
  return { value: next, selectionStart: pos, selectionEnd: pos };
}

export function buildTable(rows: number, cols: number): string {
  const safeRows = Math.max(1, rows);
  const safeCols = Math.max(1, cols);
  const header = `| ${Array.from({ length: safeCols }, (_, i) => `Columna ${i + 1}`).join(" | ")} |`;
  const separator = `| ${Array.from({ length: safeCols }, () => "---").join(" | ")} |`;
  const body = Array.from(
    { length: safeRows },
    () => `| ${Array.from({ length: safeCols }, () => " ").join(" | ")} |`
  ).join("\n");
  return [header, separator, body].filter(Boolean).join("\n");
}
