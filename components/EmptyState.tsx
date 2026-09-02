import { HandshakeIcon } from "./Icons";

export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <HandshakeIcon className="text-4xl" />
      <p className="font-display text-lg font-semibold">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-muted">{description}</p>}
    </div>
  );
}
