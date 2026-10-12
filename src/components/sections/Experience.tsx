import type { ExperienceSection } from '@/content/types';
import { SectionHead } from '@/components/ui/SectionHead';
import { Rich } from '@/components/ui/Rich';
import { VideoCarousel } from '@/components/interactive/VideoCarousel';

/** One experience or education section: header, the featured card (body text or
 *  bullets, optional video carousel, dates) and optional small cards below. */
export function Experience({ data }: { data: ExperienceSection }) {
  return (
    <section className="section container reveal" id={data.id}>
      <SectionHead label={data.label} tag={data.tag} headline={data.headline} sub={data.sub} />
      <div className="exp-list">
        <div className="exp-item featured">
          <div>
            <div className="exp-role">{data.role}</div>
            <div className="exp-company">{data.company}</div>
            {data.body && <div className="exp-body">{data.body}</div>}
            {data.bullets && (
              <ul className="bullet-list">
                {data.bullets.map((b) => (
                  <li key={b.heading}>
                    <strong>{b.heading}</strong>
                    <Rich value={b.text} />
                  </li>
                ))}
              </ul>
            )}
            {data.videos && <VideoCarousel samples={data.videos} />}
          </div>
          <div className="exp-date">
            {data.date.map((line, i) => (
              <span key={i}>
                {line}
                {i < data.date.length - 1 && <br />}
              </span>
            ))}
          </div>
        </div>
        {data.miniCards && (
          <div className="mini-row">
            {data.miniCards.map((c) => (
              <div className="mini-card" key={c.role}>
                <div className="mini-role">{c.role}</div>
                <div className="mini-company">{c.company}</div>
                {c.date && <div className="mini-date">{c.date}</div>}
                <div className="mini-body">{c.body}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
