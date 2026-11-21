import { FileText } from "lucide-react";
import { focusRing } from "@/components/ui/Links";
import { pdfSize } from "./pdf";

/**
 * Link to an approved course-detail PDF. States the format and size, and
 * names the program for screen readers, so ten "Course Details" links can
 * be told apart. Renders nothing until a PDF exists.
 */
export function DetailsLink({
  pdf,
  title,
  label = "Course Details",
  tone = "light",
  className = "",
}: {
  pdf: string | null;
  /** The program the PDF describes, read out after the label. */
  title: string;
  label?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  if (!pdf) return null;
  const size = pdfSize(pdf);
  const meta = size ? `PDF · ${size}` : "PDF";
  return (
    <a
      href={pdf}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex min-h-11 items-center gap-2 text-[15px] font-medium ${focusRing[tone]} ${className}`}
    >
      <FileText className="size-4 shrink-0" aria-hidden />
      <span className="link-draw pb-0.5">{label}</span>
      <span aria-hidden className={`label ml-1 !text-[10px] !tracking-[0.14em] whitespace-nowrap ${tone === "dark" ? "text-ash" : "text-stone"}`}>
        {meta}
      </span>
      <span className="sr-only">
        {` for ${title} (PDF${size ? `, ${size}` : ""}, opens in a new tab)`}
      </span>
    </a>
  );
}
