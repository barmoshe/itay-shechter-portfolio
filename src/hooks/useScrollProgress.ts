import { useEffect, useState } from 'react';

// Tracks vertical scroll as a 0-100 percentage for the top progress bar.
export function useScrollProgress(): number {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement;
      setPct((d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100 || 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return pct;
}
