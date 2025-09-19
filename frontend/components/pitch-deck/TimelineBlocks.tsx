export type Item = { title?: string; text?: string };

export default function TimelineBlocks({
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
    <div className="relative ml-2 border-l pl-4" style={{ borderColor }}>
      {items.map((t) => (
        <div className="relative mb-4" key={`${t.title ?? ""}-${t.text ?? ""}`}>
          {t.title && (
            <div className="font-semibold" style={{ color: textColor }}>
              {t.title}
            </div>
          )}
          {t.text && (
            <div className="text-sm" style={{ color: subtextColor }}>
              {t.text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
