import type { FocusEvent } from "react";
export type Bullet = { title?: string; text?: string };

// Note: Bullet dots removed per request
export default function BulletsList({
  items,
  textColor,
  editable,
  onEdit,
}: {
  items: Bullet[];
  textColor?: string;
  editable?: boolean;
  onEdit?: (index: number, patch: Bullet) => void;
}) {
  if (!items || items.length === 0) {
    return null;
  }
  return (
    <ul className="space-y-2 pl-0">
      {items.map((b, i) => (
        <li
          className="flex items-start gap-2"
          key={`${b.title ?? ""}-${b.text ?? ""}-${i}`}
        >
          <div>
            <span
              className="mr-1 font-semibold"
              style={{ color: textColor }}
              {...(editable
                ? {
                    contentEditable: true,
                    suppressContentEditableWarning: true,
                    onBlur: (e: FocusEvent<HTMLSpanElement>) =>
                      onEdit?.(i, { title: e.currentTarget.innerText }),
                  }
                : {})}
            >
              {b.title || "Title"}
            </span>
            <span
              className="text-sm"
              {...(editable
                ? {
                    contentEditable: true,
                    suppressContentEditableWarning: true,
                    onBlur: (e: FocusEvent<HTMLSpanElement>) =>
                      onEdit?.(i, { text: e.currentTarget.innerText }),
                  }
                : {})}
            >
              {b.text || "Text"}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
