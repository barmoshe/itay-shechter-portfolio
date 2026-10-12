'use client';

// Coverflow carousel of TikTok work samples. The centre card is "active"; the
// others get a data-pos that the CSS turns into the 3D fan. Click the centre card
// (or "watch") to open the in-page player; click a side card to bring it to the
// centre. Swipe/drag and the arrow keys move too (RTL: right = back).
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { WorkSample } from '@/content/types';
import { videoUi as ui } from '@/content/site';
import { Icon } from '@/components/ui/Icon';
import { useVideo } from './VideoDialog';

const POS: Record<number, string> = { [-2]: 'far-prev', [-1]: 'prev', 0: 'active', 1: 'next', 2: 'far-next' };
const SWIPE_PX = 45;

export function VideoCarousel({ samples }: { samples: WorkSample[] }) {
  const n = samples.length;
  const [active, setActive] = useState(Math.floor(n / 2));
  const openVideo = useVideo();
  const dragX = useRef<number | null>(null);
  const swiped = useRef(false); // the click that ends a swipe must not also open or move

  const go = (i: number) => setActive(Math.max(0, Math.min(n - 1, i)));

  const onPointerUp = (e: PointerEvent) => {
    if (dragX.current === null) return;
    const dx = e.clientX - dragX.current;
    dragX.current = null;
    swiped.current = Math.abs(dx) > SWIPE_PX;
    if (swiped.current) go(active + (dx > 0 ? -1 : 1));
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(active - 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(active + 1);
    }
  };

  return (
    <div className="video-carousel" role="group" aria-roledescription={ui.carouselRole} aria-label={ui.carouselLabel}>
      <div className="vc-stage">
        <button type="button" className="vc-arrow vc-arrow--prev" aria-label={ui.prevLabel} disabled={active <= 0} onClick={() => go(active - 1)}>
          <Icon name="chevronStart" />
        </button>
        <div
          className="vc-viewport"
          onPointerDown={(e) => {
            dragX.current = e.clientX;
            swiped.current = false;
          }}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (dragX.current = null)}
          onKeyDown={onKeyDown}
        >
          {samples.map((s, i) => (
            <a
              key={s.videoId}
              className="work-card vc-slide"
              data-pos={POS[i - active] ?? 'hidden'}
              href={s.href}
              target="_blank"
              rel="noopener"
              aria-label={`${s.brandHandle} · ${s.tag}`}
              draggable={false} // a native link drag would cancel the swipe
              onClick={(e) => {
                e.preventDefault();
                if (swiped.current) swiped.current = false;
                else if (i === active) openVideo(s);
                else go(i);
              }}
            >
              <div className="work-card-thumb" style={{ backgroundImage: `url('${s.image.src}')` }}>
                <div className="work-card-brand">
                  <Icon name="tiktok" />
                  <span>{s.brandHandle}</span>
                </div>
                <div className="work-card-play" aria-hidden="true">
                  <Icon name="play" />
                </div>
                {s.stat && (
                  <div className="work-card-stat">
                    <span className="gold-dot" />
                    {s.stat}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
        <button type="button" className="vc-arrow vc-arrow--next" aria-label={ui.nextLabel} disabled={active >= n - 1} onClick={() => go(active + 1)}>
          <Icon name="chevronEnd" />
        </button>
      </div>

      <div className="vc-caption">
        {samples.map((s, i) => (
          <div key={s.videoId} className={i === active ? 'vc-cap is-active' : 'vc-cap'} aria-hidden={i !== active} inert={i !== active}>
            <div className="work-card-tag">{s.tag}</div>
            <div className="work-card-title">{s.title}</div>
            <div className="work-card-desc">{s.desc}</div>
            <button type="button" className="work-card-link" onClick={() => openVideo(s)}>
              {ui.watch} <Icon name="external" />
            </button>
          </div>
        ))}
      </div>

      <div className="vc-dots" role="tablist" aria-label={ui.dotsLabel}>
        {samples.map((s, i) => (
          <button
            key={s.videoId}
            type="button"
            role="tab"
            className={i === active ? 'vc-dot is-active' : 'vc-dot'}
            aria-label={ui.dotLabel.replace('{n}', String(i + 1))}
            aria-selected={i === active}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
}
