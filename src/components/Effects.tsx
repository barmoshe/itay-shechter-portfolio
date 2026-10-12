'use client';

// Starts the ambient effects (src/effects) once the page has hydrated.
import { useEffect } from 'react';
import { startEffects } from '@/effects';

export function Effects() {
  useEffect(() => startEffects(), []);
  return null;
}
