export type Item = { title?: string; text?: string };

export default function CycleBlocks({
  items,
  borderColor,
  textColor,
  subtextColor,
}: {
  items: Item[];
  borderColor: string;
  textColor: string;
  subtextColor: string;
}) {
  if (!items || items.length === 0) {
    return null;
  }
  return (
    <div className="grid grid-cols-1 gap-3">
      {items.map((c) => (
        <div
          className="rounded-lg border p-3"
          key={`${c.title ?? ""}-${c.text ?? ""}`}
          style={{ borderColor }}
        >
          {c.title && (
            <div className="font-semibold" style={{ color: textColor }}>
              {c.title}
            </div>
          )}
          {c.text && (
            <div className="text-sm" style={{ color: subtextColor }}>
              {c.text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
