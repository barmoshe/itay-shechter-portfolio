import { useCallback, useEffect, useRef, useState } from 'react';
import type { WorkSample } from '../data/content';
import { asset } from '../lib/asset';
import { CloseIcon, PlayIcon, TiktokBrandGlyph, WorkLinkArrow } from './icons';

// Official TikTok iframe player. The lightbox sets this only when opened, so
// nothing from TikTok loads until the visitor asks to watch.
function playerSrc(id: string): string {
  return `https://www.tiktok.com/player/v1/${id}?autoplay=1&loop=1&rel=0&description=1&music_info=1`;
}

// Visual role of a slide relative to the active one. Drives the coverflow
// transform purely from CSS (see .vc-slide[data-pos] rules).
function posFor(offset: number): string {
  switch (offset) {
    case 0:
      return 'active';
    case 1:
      return 'next';
    case -1:
      return 'prev';
    case 2:
      return 'far-next';
    case -2:
      return 'far-prev';
    default:
      return 'hidden';
  }
}

function Chevron({ dir }: { dir: 'start' | 'end' }) {
  // start = points toward the inline-start edge (right in RTL); end = left.
  const d = dir === 'start' ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6';
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function Lightbox({ sample, onClose }: { sample: WorkSample; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (dlg && !dlg.open) dlg.showModal();
  }, []);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const onBackdrop = (e: MouseEvent) => {
      if (e.target === dlg) onClose();
    };
    dlg.addEventListener('click', onBackdrop);
    return () => dlg.removeEventListener('click', onBackdrop);
  }, [onClose]);

  return (
    <dialog ref={ref} className="vc-lightbox" aria-label={sample.title} onClose={onClose}>
      <div className="vc-lightbox-inner">
        <button type="button" className="vc-lightbox-close" aria-label="סגור" onClick={onClose}>
          <CloseIcon />
        </button>
        <div className="vc-lightbox-frame">
          <iframe
            src={playerSrc(sample.videoId)}
            title={sample.title}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
        <a className="vc-lightbox-link" href={sample.href} target="_blank" rel="noopener">
          {sample.brandHandle} · פתח ב-TikTok <WorkLinkArrow />
        </a>
      </div>
    </dialog>
  );
}

export function VideoCarousel({ samples }: { samples: WorkSample[] }) {
  const n = samples.length;
  // Start on the middle card so the coverflow is symmetric on load.
  const [active, setActive] = useState(() => Math.floor(samples.length / 2));
  const [open, setOpen] = useState<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const clamp = useCallback((i: number) => Math.max(0, Math.min(n - 1, i)), [n]);
  const go = useCallback((i: number) => setActive(clamp(i)), [clamp]);
  // Relative step keeps the imperative listeners stable (no `active` closure).
  const step = useCallback((d: number) => setActive((a) => clamp(a + d)), [clamp]);

  // Swipe + keyboard are wired imperatively on the viewport: a static element
  // with JSX handlers/tabIndex trips jsx-a11y, and the keyboard interface is
  // also covered by the native arrow buttons and dots below.
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    vp.setAttribute('tabindex', '0');
    let startX = 0;
    let dragging = false;
    const down = (e: PointerEvent) => {
      startX = e.clientX;
      dragging = true;
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 45) step(dx > 0 ? -1 : 1); // RTL: drag right => previous
    };
    const cancel = () => {
      dragging = false;
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(-1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(1);
      }
    };
    vp.addEventListener('pointerdown', down);
    vp.addEventListener('pointerup', up);
    vp.addEventListener('pointercancel', cancel);
    vp.addEventListener('keydown', key);
    return () => {
      vp.removeEventListener('pointerdown', down);
      vp.removeEventListener('pointerup', up);
      vp.removeEventListener('pointercancel', cancel);
      vp.removeEventListener('keydown', key);
    };
  }, [step]);

  return (
    <div className="video-carousel" role="group" aria-roledescription="קרוסלה" aria-label="סרטוני וידאו נבחרים">
      <div className="vc-stage">
        <button
          type="button"
          className="vc-arrow vc-arrow--prev"
          aria-label="הסרטון הקודם"
          onClick={() => step(-1)}
          disabled={active <= 0}
        >
          <Chevron dir="start" />
        </button>

        <div className="vc-viewport" ref={viewportRef}>
          {samples.map((s, i) => {
            const isActive = i === active;
            return (
              <a
                key={i}
                className="work-card vc-slide"
                data-pos={posFor(i - active)}
                href={s.href}
                target="_blank"
                rel="noopener"
                data-video-id={s.videoId}
                aria-label={`${s.brandHandle} · ${s.tag}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (isActive) setOpen(i);
                  else go(i);
                }}
              >
                <div className="work-card-thumb" style={{ backgroundImage: `url('${asset(s.image)}')` }}>
                  <div className="work-card-brand">
                    <TiktokBrandGlyph />
                    <span>{s.brandHandle}</span>
                  </div>
                  <div className="work-card-play" aria-hidden="true">
                    <PlayIcon />
                  </div>
                  {s.stat && (
                    <div className="work-card-stat"><span className="gold-dot" />{s.stat}</div>
                  )}
                </div>
              </a>
            );
          })}
        </div>

        <button
          type="button"
          className="vc-arrow vc-arrow--next"
          aria-label="הסרטון הבא"
          onClick={() => step(1)}
          disabled={active >= n - 1}
        >
          <Chevron dir="end" />
        </button>
      </div>

      <div className="vc-caption">
        {samples.map((s, i) => (
          <div className={`vc-cap${i === active ? ' is-active' : ''}`} key={i} aria-hidden={i !== active}>
            <div className="work-card-tag">{s.tag}</div>
            <div className="work-card-title">{s.title}</div>
            <div className="work-card-desc">{s.desc}</div>
            <button type="button" className="work-card-link" onClick={() => setOpen(i)}>
              צפה בסרטון <WorkLinkArrow />
            </button>
          </div>
        ))}
      </div>

      <div className="vc-dots" role="tablist" aria-label="ניווט בין הסרטונים">
        {samples.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            className={`vc-dot${i === active ? ' is-active' : ''}`}
            aria-label={`סרטון ${i + 1}`}
            aria-selected={i === active}
            onClick={() => go(i)}
          />
        ))}
      </div>

      {open !== null && <Lightbox sample={samples[open]} onClose={() => setOpen(null)} />}
    </div>
  );
}
