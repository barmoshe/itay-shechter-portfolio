// Shared plumbing for the ambient effects: device/motion preferences, one
// pointer tracker, one per-frame scroll dispatcher and the page's scroll range.
// Everything is attached with an AbortSignal, so stopping the effects removes
// every listener and observer in one call.

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)');
export const isTouch = () => matchMedia('(hover: none)').matches;
export const hasFinePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- pointer ---------- */

export const pointer = { x: -1e4, y: -1e4, lastTouch: -1e9, lastMove: -1e9 };
let touchDevice = false;

export function trackPointer(signal: AbortSignal) {
  touchDevice = isTouch();
  const opts = { passive: true, signal };
  const onTouch = (e: TouchEvent) => {
    const p = e.touches[0];
    if (!p) return;
    pointer.x = p.clientX;
    pointer.y = p.clientY;
    pointer.lastTouch = pointer.lastMove = performance.now();
  };
  addEventListener(
    'mousemove',
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.lastMove = performance.now();
    },
    opts,
  );
  addEventListener(
    'mouseleave',
    () => {
      if (!touchDevice) pointer.x = pointer.y = -1e4;
    },
    { signal },
  );
  addEventListener('touchstart', onTouch, opts);
  addEventListener('touchmove', onTouch, opts);
}

/** A mouse is over the page, or a finger touched it in the last `ms`. */
export function pointerActive(ms: number) {
  return touchDevice ? performance.now() - pointer.lastTouch < ms && pointer.x !== -1e4 : pointer.x !== -1e4;
}

/* ---------- scroll ---------- */

const scrollFns = new Set<() => void>();
let pageMax = 1; // how far the page can scroll; kept fresh instead of read every frame

/** Run fn once per animation frame while the page scrolls. */
export function onScrollFrame(fn: () => void, signal: AbortSignal) {
  scrollFns.add(fn);
  signal.addEventListener('abort', () => scrollFns.delete(fn));
}

/** Scroll progress through the page, 0..1. */
export const scrollProgress = () => Math.min(1, Math.max(0, scrollY / pageMax));

export function trackScroll(signal: AbortSignal) {
  let ticking = false;
  addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        scrollFns.forEach((fn) => fn());
      });
    },
    { passive: true, signal },
  );

  const measure = () => {
    pageMax = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  };
  measure();
  addEventListener('resize', measure, { signal });
  const ro = new ResizeObserver(measure);
  ro.observe(document.body);
  signal.addEventListener('abort', () => ro.disconnect());
}
