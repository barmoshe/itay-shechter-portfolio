// Every inline SVG icon on the site, by name. Icons are decorative (aria-hidden)
// unless the surrounding element says otherwise.
import type { ReactNode, SVGProps } from 'react';

type SvgAttrs = SVGProps<SVGSVGElement>;

const box = { viewBox: '0 0 24 24' } as const;
const filled: SvgAttrs = { ...box, fill: 'currentColor', 'aria-hidden': true };
const stroke = (width: string, extra: SvgAttrs = {}): SvgAttrs => ({
  ...box,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: width,
  ...extra,
});
const round: SvgAttrs = { strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
const skill: SvgAttrs = { width: '28', height: '28', ...stroke('1.6', round) };
const ARROW = 'M7 17L17 7M17 7H7M17 7v10';

const ICONS = {
  // nav badge
  check: [stroke('3.5'), <polyline key="a" points="20 6 9 17 4 12" />],
  // platforms
  instagram: [
    stroke('1.7', { 'aria-hidden': true }),
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>,
  ],
  tiktok: [
    filled,
    <path
      key="a"
      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"
    />,
  ],
  facebook: [
    filled,
    <path
      key="a"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />,
  ],
  youtube: [
    filled,
    <path
      key="a"
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
    />,
  ],
  whatsapp: [
    filled,
    <path
      key="a"
      d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.77-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26C2.16 6.45 6.6 2.01 12.05 2.01c2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.88 9.89M20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.49-8.41"
    />,
  ],
  mail: [
    stroke('1.6', round),
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6 8.5-6" />
    </>,
  ],
  // arrows and controls
  arrow: [stroke('2', { 'aria-hidden': true }), <path key="a" d={ARROW} />], // follower cards
  external: [{ width: '10', height: '10', ...stroke('2.5', { 'aria-hidden': true }) }, <path key="a" d={ARROW} />],
  chevronStart: [stroke('1.8', round), <path key="a" d="M9 6l6 6-6 6" />],
  chevronEnd: [stroke('1.8', round), <path key="a" d="M15 6l-6 6 6 6" />],
  close: [stroke('1.8', { strokeLinecap: 'round', 'aria-hidden': true }), <path key="a" d="M6 6l12 12M18 6L6 18" />],
  play: [{ ...box, fill: 'currentColor' }, <path key="a" d="M8 5v14l11-7z" />],
  // skills
  sparkles: [
    skill,
    <>
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
      <path d="M19 17L19.7 19.3L22 20L19.7 20.7L19 23L18.3 20.7L16 20L18.3 19.3L19 17Z" />
    </>,
  ],
  send: [skill, <path key="a" d="M3 11l18-8-8 18-2-8-8-2z" />],
  video: [
    skill,
    <>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </>,
  ],
  sprout: [
    skill,
    <>
      <path d="M12 22c1-3 4-5 8-5-1 4-4 6-8 5z" />
      <path d="M12 22c-1-3-4-5-8-5 1 4 4 6 8 5z" />
      <path d="M12 22V8" />
      <path d="M12 8c-3-3-3-6 0-6s3 3 0 6z" />
    </>,
  ],
  handshake: [
    skill,
    <>
      <path d="M17 11l1.5 1.5L22 9l-3-3-1.5 1.5" />
      <path d="M9 13l-1.5-1.5L4 15l3 3 1.5-1.5" />
      <path d="M14 7l3 3" />
      <path d="M7 14l3 3" />
      <path d="M13 11l-2 2" />
    </>,
  ],
  pen: [
    skill,
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4z" />
    </>,
  ],
  bulb: [
    skill,
    <>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.74V17h8v-2.26A7 7 0 0 0 12 2z" />
    </>,
  ],
} satisfies Record<string, [SvgAttrs, ReactNode]>;

export type IconName = keyof typeof ICONS;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const [attrs, children] = ICONS[name];
  return (
    <svg className={className} {...attrs}>
      {children}
    </svg>
  );
}
