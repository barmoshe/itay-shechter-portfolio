import { useEffect, useRef } from 'react';

// טקסט נושם (קונספט kidon.dev, מכויל עדין ואלגנטי): משקל האותיות גדל
// בעדינות לעבר הסמן או האצבע, וכשאף אחד לא מצביע — גל איטי עובר באותיות.
// wght בלבד, אות-באות, בלי לשנות פריסה. רץ רק כשהאלמנט נראה על המסך
// (IntersectionObserver) — כך אפשר לפזר אותו בכל כותרות העמוד בלי עלות.
// prefers-reduced-motion → סטטי לחלוטין.
interface Props {
  text: string;
  base?: number;   // משקל מנוחה
  boost?: number;  // כמה המשקל מתווסף תחת הסמן
  idle?: number;   // עוצמת גל הנשימה כשאין סמן
}

export function KineticName({ text, base = 300, boost = 230, idle = 75 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const spans = Array.from(el.querySelectorAll<HTMLElement>('.kn-ch'));
    const state = spans.map(() => ({ w: base, target: base }));
    const touch = matchMedia('(hover: none)').matches;
    let mx = -1e4, lastTouch = -1e9, raf = 0, visible = false;
    const t0 = performance.now();

    const onMouse = (e: MouseEvent) => { mx = e.clientX; };
    const onLeave = () => { if (!touch) mx = -1e4; };
    const onTouch = (e: TouchEvent) => {
      const p = e.touches[0];
      if (p) { mx = p.clientX; lastTouch = performance.now(); }
    };

    const tick = () => {
      if (!visible) { raf = 0; return; }
      const t = (performance.now() - t0) / 1000;
      const active = touch
        ? performance.now() - lastTouch < 2000 && mx !== -1e4
        : mx !== -1e4;
      spans.forEach((s, i) => {
        const st = state[i];
        if (active) {
          const r = s.getBoundingClientRect();
          const d = Math.abs(mx - (r.left + r.width / 2));
          const f = Math.max(0, 1 - d / 260);
          st.target = base + boost * f * f;
        } else {
          st.target = base + idle * Math.max(0, Math.sin(t * 0.6 - i * 0.5));
        }
        st.w += (st.target - st.w) * 0.09;
        s.style.fontVariationSettings = `"wght" ${st.w.toFixed(1)}`;
      });
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    }, { threshold: 0 });
    io.observe(el);

    addEventListener('mousemove', onMouse, { passive: true });
    addEventListener('mouseleave', onLeave);
    addEventListener('touchstart', onTouch, { passive: true });
    addEventListener('touchmove', onTouch, { passive: true });

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      removeEventListener('mousemove', onMouse);
      removeEventListener('mouseleave', onLeave);
      removeEventListener('touchstart', onTouch);
      removeEventListener('touchmove', onTouch);
    };
  }, [text, base, boost, idle]);

  return (
    <span ref={ref} className="kinetic-name" role="text" aria-label={text}>
      {[...text].map((c, i) =>
        c === ' '
          ? <span key={i} aria-hidden="true" className="kn-sp">&nbsp;</span>
          : <span key={i} aria-hidden="true" className="kn-ch">{c}</span>,
      )}
    </span>
  );
}
