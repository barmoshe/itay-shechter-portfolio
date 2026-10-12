'use client';

// The in-page TikTok player. VideoProvider renders the lightbox <dialog> after the
// page content; the carousel calls useVideo()(sample) to open it. The TikTok
// iframe only gets a src while the dialog is open, so nothing loads from TikTok
// until a visitor asks to watch.
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { WorkSample } from '@/content/types';
import { videoUi as ui } from '@/content/site';
import { Icon } from '@/components/ui/Icon';

const OpenVideo = createContext<(sample: WorkSample) => void>(() => {});
export const useVideo = () => useContext(OpenVideo);

const playerSrc = (id: string) =>
  `https://www.tiktok.com/player/v1/${id}?autoplay=1&loop=1&rel=0&description=1&music_info=1`;

export function VideoProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [sample, setSample] = useState<WorkSample | null>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (sample && dlg && !dlg.open) dlg.showModal();
  }, [sample]);

  const close = () => ref.current?.close();

  return (
    <OpenVideo.Provider value={setSample}>
      {children}
      <dialog
        ref={ref}
        className="vc-lightbox"
        aria-label={sample?.title ?? ''}
        onClose={() => setSample(null)}
        onClick={(e) => e.target === e.currentTarget && close()} // click on the backdrop
      >
        <div className="vc-lightbox-inner">
          <button type="button" className="vc-lightbox-close" aria-label={ui.closeLabel} onClick={close}>
            <Icon name="close" />
          </button>
          <div className="vc-lightbox-frame">
            {/* A new iframe per video (and none left behind on close), so closing
                never leaves a player entry in the page's back history. */}
            <iframe
              key={sample?.videoId ?? 'idle'}
              title={sample?.title ?? ''}
              src={sample ? playerSrc(sample.videoId) : undefined}
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
          <a className="vc-lightbox-link" href={sample?.href ?? '#'} target="_blank" rel="noopener">
            <span className="vc-lightbox-handle">{sample?.brandHandle}</span>
            {` · ${ui.openIn} `}
            <Icon name="external" />
          </a>
        </div>
      </dialog>
    </OpenVideo.Provider>
  );
}
