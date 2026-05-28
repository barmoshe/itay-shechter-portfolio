import type { PlatformIcon, SkillIcon } from '../data/content';

// All SVG markup is ported verbatim from the standalone HTML (camelCased for
// JSX). Icons are decorative unless they label an interactive element.

export function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

export function WorkLinkArrow() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

const TIKTOK_PATH =
  'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z';

const FACEBOOK_PATH =
  'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z';

export function PlatformGlyph({ icon }: { icon: PlatformIcon }) {
  if (icon === 'instagram') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (icon === 'tiktok') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={TIKTOK_PATH} />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={FACEBOOK_PATH} />
    </svg>
  );
}

export function TiktokBrandGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={TIKTOK_PATH} />
    </svg>
  );
}

export function SkillGlyph({ icon }: { icon: SkillIcon }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (icon) {
    case 'ai':
      return (
        <svg {...common}>
          <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
          <path d="M19 17L19.7 19.3L22 20L19.7 20.7L19 23L18.3 20.7L16 20L18.3 19.3L19 17Z" />
        </svg>
      );
    case 'strategy':
      return (
        <svg {...common}>
          <path d="M3 11l18-8-8 18-2-8-8-2z" />
        </svg>
      );
    case 'video':
      return (
        <svg {...common}>
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      );
    case 'growth':
      return (
        <svg {...common}>
          <path d="M12 22c1-3 4-5 8-5-1 4-4 6-8 5z" />
          <path d="M12 22c-1-3-4-5-8-5 1 4 4 6 8 5z" />
          <path d="M12 22V8" />
          <path d="M12 8c-3-3-3-6 0-6s3 3 0 6z" />
        </svg>
      );
    case 'collab':
      return (
        <svg {...common}>
          <path d="M17 11l1.5 1.5L22 9l-3-3-1.5 1.5" />
          <path d="M9 13l-1.5-1.5L4 15l3 3 1.5-1.5" />
          <path d="M14 7l3 3" />
          <path d="M7 14l3 3" />
          <path d="M13 11l-2 2" />
        </svg>
      );
    case 'writing':
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4z" />
        </svg>
      );
    case 'format':
      return (
        <svg {...common}>
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.74V17h8v-2.26A7 7 0 0 0 12 2z" />
        </svg>
      );
  }
}
