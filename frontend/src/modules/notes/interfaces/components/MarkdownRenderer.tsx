import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { wikiLinksToMarkdown } from "../../domain/markdown";

interface MarkdownRendererProps {
  content: string;
  onOpenWikiLink?: (title: string) => void;
}

export function MarkdownRenderer({
  content,
  onOpenWikiLink,
}: MarkdownRendererProps) {
  const prepared = wikiLinksToMarkdown(content);

  return (
    <div className="text-sm md-notes" style={{ color: "var(--color-text-primary)" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-6 mb-3 font-semibold" style={{ fontSize: "1.75rem", color: "var(--color-heading)" }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-5 mb-3 font-semibold" style={{ fontSize: "1.4rem", color: "var(--color-heading)" }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-4 mb-2 font-semibold" style={{ fontSize: "1.15rem", color: "var(--color-heading)" }}>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-4 mb-2 font-semibold" style={{ fontSize: "1rem" }}>
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="mt-3 mb-2 font-semibold" style={{ fontSize: "0.9rem" }}>
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="mt-3 mb-2 font-semibold" style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="my-3" style={{ lineHeight: 1.7 }}>
              {children}
            </p>
          ),
          a: ({ href, children }) => {
            if (href && href.startsWith("wiki:")) {
              const title = decodeURIComponent(href.slice("wiki:".length));
              return (
                <button
                  type="button"
                  onClick={() => onOpenWikiLink?.(title)}
                  className="cursor-pointer underline decoration-dotted"
                  style={{ color: "var(--color-accent-primary)", fontWeight: 500 }}
                >
                  {children}
                </button>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--color-accent-primary)" }}
              >
                {children}
              </a>
            );
          },
          ul: ({ children }) => (
            <ul className="my-3 pl-6 list-disc">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 pl-6 list-decimal">{children}</ol>
          ),
          li: ({ children }) => <li className="my-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote
              className="my-4 pl-4 py-1"
              style={{
                borderLeft: "3px solid var(--color-accent-primary)",
                color: "var(--color-text-muted)",
                fontStyle: "italic",
              }}
            >
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => {
            const isBlock = typeof className === "string" && className.includes("language-");
            if (isBlock) {
              return (
                <code
                  className={className}
                  style={{ fontSize: "0.85rem", lineHeight: 1.6 }}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className="px-1.5 py-0.5 rounded-md"
                style={{
                  backgroundColor: "var(--color-surface-soft)",
                  fontSize: "0.85em",
                }}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre
              className="my-4 p-4 rounded-xl overflow-x-auto"
              style={{
                backgroundColor: "var(--color-surface-soft)",
                boxShadow: "var(--shadow-neo-pressed-sm)",
              }}
            >
              {children}
            </pre>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt ?? ""}
              className="my-4 max-w-full rounded-xl"
              style={{ boxShadow: "var(--shadow-neo-raised-sm)" }}
            />
          ),
          hr: () => (
            <hr className="my-6" style={{ borderColor: "var(--color-border)" }} />
          ),
          table: ({ children }) => (
            <div className="my-4 w-full overflow-x-auto rounded-xl" style={{ boxShadow: "var(--shadow-neo-raised-sm)" }}>
              <table className="w-full border-collapse" style={{ minWidth: "100%" }}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead style={{ backgroundColor: "var(--color-surface-soft)" }}>
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th
              className="px-3 py-2 text-left font-semibold"
              style={{
                border: "1px solid var(--color-border)",
                color: "var(--color-heading)",
              }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              className="px-3 py-2 align-top"
              style={{ border: "1px solid var(--color-border)" }}
            >
              {children}
            </td>
          ),
          input: ({ checked, type }) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-2"
                  style={{ accentColor: "var(--color-accent-primary)" }}
                />
              );
            }
            return null;
          },
        }}
      >
        {prepared}
      </ReactMarkdown>
    </div>
  );
}
