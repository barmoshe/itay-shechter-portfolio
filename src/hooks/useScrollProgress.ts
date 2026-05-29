import { useEffect, useState } from 'react';

// Tracks vertical scroll as a 0-100 percentage for the top progress bar.
// Scroll events fire many times per second; without throttling, every tick
// triggers a setState and a re-render of ProgressBar. A requestAnimationFrame
// guard coalesces all events between paints into a single update, so the bar
// stays smooth without thrashing React.
export function useScrollProgress(): number {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let ticking = false;
    const compute = () => {
      const d = document.documentElement;
      setPct((d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100 || 0);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return pct;
}
