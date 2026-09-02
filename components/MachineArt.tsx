import { CategoryIcon } from "./Icons";
import { catLabel } from "@/lib/constants";

export default function MachineArt({
  category,
  className = "",
}: {
  category: string;
  className?: string;
}) {
  return (
    <div
      className={`machine-art relative flex h-full w-full items-center justify-center overflow-hidden bg-surface2 ${className}`}
      aria-hidden="true"
    >
      <svg className="absolute inset-0 h-full w-full opacity-[0.35]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`grid-${category}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M 18 0 L 0 0 0 18" fill="none" stroke="var(--border)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${category})`} />
      </svg>
      <CategoryIcon category={category} className="relative h-16 w-16 text-blueprint opacity-70 md:h-20 md:w-20" strokeWidth={1.2} />
      <span className="sr-only">{catLabel(category)} görseli</span>
    </div>
  );
}
