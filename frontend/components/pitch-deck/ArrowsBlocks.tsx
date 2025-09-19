export type Item = { title?: string; text?: string };

export default function ArrowsBlocks({
  items,
  mainColor,
  textColor,
  subtextColor,
}: {
  items: Item[];
  mainColor: string;
  textColor: string;
  subtextColor: string;
}) {
  if (!items || items.length === 0) {
    return null;
  }
  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((a) => (
        <div
          className="flex items-start gap-3"
          key={`${a.title ?? ""}-${a.text ?? ""}`}
        >
          <div
            className="mt-1 h-2 w-2 flex-shrink-0 rounded-full"
            style={{ backgroundColor: mainColor }}
          />
          <div>
            {a.title && (
              <div className="font-semibold" style={{ color: textColor }}>
                {a.title}
              </div>
            )}
            {a.text && (
              <div className="text-sm" style={{ color: subtextColor }}>
                {a.text}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
