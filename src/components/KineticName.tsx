import { useEffect, useRef } from 'react';

// שם הגיבור נושם: משקל האותיות עולה בעדינות לקראת הסמן (קונספט kidon.dev,
// מכויל עדין ואלגנטי). בלי סמן / במגע — גל נשימה איטי שמתגלגל באותיות.
// prefers-reduced-motion → סטטי לחלוטין.
export function KineticName({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>('.ch'));
    const chars = spans.map((s) => ({ s, w: 300, target: 300 }));
    const touch = matchMedia('(hover: none)').matches;
    let mx = -1e4, raf = 0;
    const t0 = performance.now();
    const onMove = (e: MouseEvent) => { mx = e.clientX; };
    const onLeave = () => { mx = -1e4; };
    addEventListener('mousemove', onMove, { passive: true });
    addEventListener('mouseleave', onLeave);

    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      chars.forEach((c, i) => {
        if (touch || mx === -1e4) {
          // נשימה איטית, אמפליטודה קטנה — עדין מהמקור של kidon
          c.target = 300 + 85 * Math.max(0, Math.sin(t * 0.5 - i * 0.5));
        } else {
          const r = c.s.getBoundingClientRect();
          const d = Math.abs(mx - (r.left + r.width / 2));
          const f = Math.max(0, 1 - d / 260);
          c.target = 300 + 210 * f * f;
        }
        c.w += (c.target - c.w) * 0.1;
        c.s.style.fontVariationSettings = `"wght" ${c.w.toFixed(1)}`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('mousemove', onMove);
      removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <span ref={ref} className="kinetic-name" aria-label={text}>
      {[...text].map((c, i) =>
        c === ' '
          ? <span key={i} className="ch" aria-hidden="true">&nbsp;</span>
          : <span key={i} className="ch" aria-hidden="true">{c}</span>,
      )}
    </span>
  );
}
