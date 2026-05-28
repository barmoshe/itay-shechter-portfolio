import type { Rich } from '../data/content';

// Renders inline rich text: gold-highlighted runs become <span class="hl">,
// bold runs become <strong>. Plain runs render as text.
export function RichText({ value }: { value: Rich }) {
  return (
    <>
      {value.map((seg, i) => {
        if (seg.hl) return <span className="hl" key={i}>{seg.t}</span>;
        if (seg.strong) return <strong key={i}>{seg.t}</strong>;
        return <span key={i}>{seg.t}</span>;
      })}
    </>
  );
}
