// Starts every ambient effect on the server-rendered page. Returns a stop
// function that removes every listener, observer and animation loop.
import { prefersReducedMotion, trackPointer, trackScroll } from './core';
import { edgeLight, heroParallax, phoneFeed, phoneTilt, progressBar, reveal, scrollMotion } from './page';
import { kinetic } from './kinetic';
import { smoke } from './smoke';

export function startEffects() {
  const ctl = new AbortController();
  const { signal } = ctl;
  if (!prefersReducedMotion().matches) trackPointer(signal);
  trackScroll(signal);
  for (const effect of [progressBar, reveal, kinetic, phoneFeed, phoneTilt, scrollMotion, heroParallax, edgeLight, smoke]) {
    effect(signal);
  }
  return () => ctl.abort();
}
