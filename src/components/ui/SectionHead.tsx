import type { Headline as HeadlineData } from '@/content/types';
import { Headline } from './Headline';

/** The shared top of a section: small gold label, optional tag, the kinetic
 *  headline and an optional subtitle. */
export function SectionHead({
  label,
  tag,
  headline,
  sub,
}: {
  label?: string;
  tag?: string;
  headline: HeadlineData;
  sub?: string;
}) {
  return (
    <>
      {label && <div className="section-label">{label}</div>}
      {tag && <div className="section-tag">{tag}</div>}
      <Headline value={headline} />
      {sub && <p className="section-sub">{sub}</p>}
    </>
  );
}
