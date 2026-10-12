// A kinetic headline part: the text is split into one span per letter so each
// letter's weight can "breathe" (src/effects/kinetic.ts animates them). Screen
// readers read the sr-only copy; the letters are aria-hidden.
//
// Variants set the animation's weights:
//   hero      rest 300, +230 under the cursor, idle wave 75 (the big name)
//   headline  rest 300, +150, wave 45 (section titles)
//   gold      rest 400, +150, wave 45 (the gold part of section titles)
const VARIANTS = {
  hero: {},
  headline: { 'data-boost': '150', 'data-idle': '45' },
  gold: { 'data-base': '400', 'data-boost': '150', 'data-idle': '45' },
} as const;

export type KineticVariant = keyof typeof VARIANTS;

export function Kinetic({ text, variant, ltr }: { text: string; variant: KineticVariant; ltr?: boolean }) {
  return (
    <span className="kinetic-name" {...VARIANTS[variant]} dir={ltr ? 'ltr' : undefined}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((c, i) =>
        c === ' ' ? (
          <span key={i} aria-hidden="true" className="kn-sp">
            {' '}
          </span>
        ) : (
          <span key={i} aria-hidden="true" className="kn-ch">
            {c}
          </span>
        ),
      )}
    </span>
  );
}
