const BRANDS = /(GitHub|Discord|Instagram)/;

/** A UI string with its service names kept out of auto-translate (`translate="no"` spans). */
export function BrandText({ text }: { text: string }) {
  return text.split(BRANDS).map((part, i) =>
    i % 2 ? (
      <span key={i} translate="no">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
