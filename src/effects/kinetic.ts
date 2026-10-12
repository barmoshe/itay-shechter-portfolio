// Kinetic type: the letters of every .kinetic-name breathe toward the cursor.
// The letter spans are server-rendered by components/ui/Kinetic.tsx; this only
// animates their weight. Tuning per headline: data-base (rest weight, default
// 300), data-boost (extra weight under the cursor, 230), data-idle (idle wave, 75).
// One loop animates every headline that is on screen.
import { pointer, pointerActive, prefersReducedMotion } from './core';

type Line = {
  el: Element;
  letters: HTMLElement[];
  base: number;
  boost: number;
  idle: number;
  weight: number[];
  shown: string[];
  visible: boolean;
};

export function kinetic(signal: AbortSignal) {
  if (prefersReducedMotion().matches) return;
  const lines: Line[] = Array.from(document.querySelectorAll<HTMLElement>('.kinetic-name'), (el) => {
    const base = Number(el.dataset.base ?? 300);
    const letters = Array.from(el.querySelectorAll<HTMLElement>('.kn-ch'));
    return {
      el,
      letters,
      base,
      boost: Number(el.dataset.boost ?? 230),
      idle: Number(el.dataset.idle ?? 75),
      weight: letters.map(() => base),
      shown: [],
      visible: false,
    };
  });
  if (!lines.length) return;

  const t0 = performance.now();
  let raf = 0;
  const tick = () => {
    const on = lines.filter((k) => k.visible);
    if (!on.length) {
      raf = 0;
      return;
    }
    const t = (performance.now() - t0) / 1000;
    const active = pointerActive(2000);
    // Read every letter's position first, then write the weights: no layout per letter.
    const centres = active
      ? on.map((k) =>
          k.letters.map((s) => {
            const r = s.getBoundingClientRect();
            return r.left + r.width / 2;
          }),
        )
      : null;
    on.forEach((k, j) => {
      k.letters.forEach((s, i) => {
        const near = centres ? Math.max(0, 1 - Math.abs(pointer.x - centres[j][i]) / 260) : 0;
        const target = centres
          ? k.base + k.boost * near * near
          : k.base + k.idle * Math.max(0, Math.sin(t * 0.6 - i * 0.5));
        k.weight[i] += (target - k.weight[i]) * 0.09;
        const v = k.weight[i].toFixed(1);
        if (v !== k.shown[i]) {
          k.shown[i] = v;
          s.style.fontVariationSettings = `"wght" ${v}`;
        }
      });
    });
    raf = requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const line = lines.find((k) => k.el === e.target);
        if (line) line.visible = e.isIntersecting;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    },
    { threshold: 0 },
  );
  lines.forEach((k) => io.observe(k.el));
  signal.addEventListener('abort', () => {
    io.disconnect();
    cancelAnimationFrame(raf);
  });
}
