import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

const icons = { down: ArrowDown, right: ArrowRight, "up-right": ArrowUpRight };

/**
 * An arrow in a circle. When the enclosing `group` is hovered or focused the
 * circle fills and the arrow travels: it leaves through one edge while its
 * twin enters from the other (styles: .arrow-circle in industry.css).
 * Decorative: the link or button around it carries the words.
 */
export function ArrowCircle({
  direction = "right",
  tone = "light",
  className = "size-10",
  iconClassName = "size-4",
}: {
  direction?: keyof typeof icons;
  tone?: "light" | "dark";
  /** Size of the circle, e.g. "size-10 md:size-14". */
  className?: string;
  iconClassName?: string;
}) {
  const Icon = icons[direction];
  return (
    <span aria-hidden data-dir={direction} className={`arrow-circle ${tone === "dark" ? "arrow-circle-dark" : ""} ${className}`}>
      <Icon className={iconClassName} />
      <Icon className={iconClassName} />
    </span>
  );
}
