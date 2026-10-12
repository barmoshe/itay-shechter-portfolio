import type { Rich as RichText } from '@/content/types';

/** Renders rich text pieces from site.ts: plain text, {b}, {hl}, {gold}, {ltr}. */
export function Rich({ value }: { value: RichText }) {
  return value.map((seg, i) => {
    if (typeof seg === 'string') return seg;
    if ('b' in seg) return <strong key={i}>{seg.b}</strong>;
    if ('hl' in seg) return <span key={i} className="hl">{seg.hl}</span>;
    if ('gold' in seg) return <span key={i} className="gold">{seg.gold}</span>;
    return <span key={i} dir="ltr">{seg.ltr}</span>;
  });
}
