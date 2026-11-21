import "server-only";
import { statSync } from "node:fs";
import path from "node:path";

/**
 * File size of a PDF in /public, read when the page is prerendered, as a
 * label such as "233 KB". Returns null for external URLs or missing files,
 * so a link never shows a wrong size.
 */
export function pdfSize(href: string): string | null {
  if (!href.startsWith("/pdfs/")) return null;
  try {
    const bytes = statSync(path.join(process.cwd(), "public", "pdfs", path.basename(href))).size;
    return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
  } catch {
    return null;
  }
}
