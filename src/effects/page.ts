// Small page effects that read the server-rendered DOM: the scroll progress bar,
// section reveal, scroll motion, hero parallax, the card edge light and pausing
// the phone feed off screen. None of them touch anything React re-renders:
// they write classes React never sets (.in, html.sm-on, .feed-off), the data-sm
// attribute, and inline styles on nodes React renders without a style prop.
import { hasFinePointer, onScrollFrame, prefersReducedMotion, scrollProgress } from './core';

/** The thin gold bar at the top that fills as you scroll. */
export function progressBar(signal: AbortSignal) {
  const bar = document.getElementById('prog-bar');
  if (!bar) return;
  const draw = () => {
    bar.style.transform = `scaleX(${scrollProgress().toFixed(4)})`;
  };
  onScrollFrame(draw, signal);
  draw();
}

/** Sections fade in the first time they come into view. */
export function reveal(signal: AbortSignal) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    },
    { threshold: 0.08 },
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  signal.addEventListener('abort', () => io.disconnect());
}

const SCROLL_MOTION =
  '.section-headline,.tl-item,.v1-step,.v1-close,.asset,.tool,.tools-more,.exp-item,.mini-card,.skill-card,.contact-link';

/** Cards, timeline rows and headlines that start below the fold rise gently into
 *  place as they reach the screen, staggered a little. data-sm is "" while
 *  waiting and "in" while landing (src/styles/motion.css). */
export function scrollMotion(signal: AbortSignal) {
  if (prefersReducedMotion().matches) return;
  let pending = Array.from(document.querySelectorAll<HTMLElement>(SCROLL_MOTION)).filter(
    (el) => el.getBoundingClientRect().top > innerHeight,
  );
  pending.forEach((el) => el.setAttribute('data-sm', ''));
  document.documentElement.classList.add('sm-on');
  signal.addEventListener('abort', () => document.documentElement.classList.remove('sm-on'));

  // Land every pending item that reached the screen (or was skipped past by a
  // jump), staggering the ones that land together. Reads first, then writes.
  onScrollFrame(() => {
    if (!pending.length) return;
    const edge = innerHeight * 0.94;
    const rects = pending.map((el) => el.getBoundingClientRect());
    const keep: HTMLElement[] = [];
    let landed = 0;
    pending.forEach((el, i) => {
      if (rects[i].top > edge) {
        keep.push(el);
        return;
      }
      const delay = rects[i].bottom < 0 ? 0 : Math.min(landed++, 5) * 0.07; // skipped past: no wait
      el.style.setProperty('--sm-d', `${delay}s`);
      el.setAttribute('data-sm', 'in');
      setTimeout(
        () => {
          el.removeAttribute('data-sm');
          el.style.removeProperty('--sm-d');
        },
        1300 + delay * 1000,
      );
    });
    pending = keep;
  }, signal);
}

/** The hero photo and text ease away as you scroll past them. */
export function heroParallax(signal: AbortSignal) {
  if (prefersReducedMotion().matches) return;
  const photo = document.querySelector<HTMLElement>('.hero-photo');
  const text = document.querySelector<HTMLElement>('.hero-text');
  let last = -1;
  onScrollFrame(() => {
    const y = Math.min(scrollY, innerHeight);
    if (y === last) return; // past the hero: nothing left to move
    last = y;
    if (photo) {
      photo.style.transform = `translateY(${(y * 0.1).toFixed(1)}px)`;
      photo.style.opacity = (1 - (y / innerHeight) * 0.5).toFixed(3);
    }
    if (text) text.style.transform = `translateY(${(y * 0.04).toFixed(1)}px)`;
  }, signal);
}

/** Same card list as the edge-light rule in src/styles/components/cards.css. */
const CARDS = '.exp-item,.mini-card,.asset,.skill-card,.tool';

/** Feeds the cursor position inside the hovered card to the CSS edge light. */
export function edgeLight(signal: AbortSignal) {
  if (!hasFinePointer()) return;
  let card: HTMLElement | null = null;
  let x = 0;
  let y = 0;
  let raf = 0;
  document.addEventListener(
    'pointermove',
    (e) => {
      card = e.target instanceof Element ? e.target.closest<HTMLElement>(CARDS) : null;
      x = e.clientX;
      y = e.clientY;
      if (!card || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${x - r.left}px`);
        card.style.setProperty('--my', `${y - r.top}px`);
      });
    },
    { passive: true, signal },
  );
  signal.addEventListener('abort', () => cancelAnimationFrame(raf));
}

/** The phone's scrolling feed is a CSS animation; pause it while off screen. */
export function phoneFeed(signal: AbortSignal) {
  const feed = document.querySelector('.phone-feed');
  if (!feed) return;
  const io = new IntersectionObserver((entries) => feed.classList.toggle('feed-off', !entries[0].isIntersecting));
  io.observe(feed);
  signal.addEventListener('abort', () => io.disconnect());
}
