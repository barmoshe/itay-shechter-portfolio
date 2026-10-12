import type { Headline as HeadlineData } from '@/content/types';
import { Kinetic } from './Kinetic';

/** A section title: the plain part, then the gold part, both kinetic. */
export function Headline({ value, className = 'section-headline' }: { value: HeadlineData; className?: string }) {
  return (
    <h2 className={className}>
      {value.pre && <Kinetic text={value.pre} variant="headline" />}
      <span className="gold">
        {value.gold.map((part, i) =>
          typeof part === 'string' ? (
            <Kinetic key={i} text={part} variant="gold" />
          ) : (
            <Kinetic key={i} text={part.ltr} variant="gold" ltr />
          ),
        )}
      </span>
    </h2>
  );
}
