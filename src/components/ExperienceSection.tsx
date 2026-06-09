import type { ExperienceSection as Section } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import { RichText } from './RichText';
import { KineticName } from './KineticName';
import { VideoCarousel } from './VideoCarousel';
import { ArrowIcon, PlatformGlyph } from './icons';

export function ExperienceSection({ section }: { section: Section }) {
  const ref = useReveal<HTMLElement>();
  const { item } = section;
  return (
    <section className="section container reveal" id={section.id} style={{ scrollMarginTop: 80 }} ref={ref}>
      <div className="section-label">{section.label}</div>
      {section.tag && <div className="section-tag">{section.tag}</div>}
      <h2 className="section-headline"><KineticName text={section.pre} boost={150} idle={45} /><span className="gold"><KineticName text={section.gold} base={400} boost={150} idle={45} /></span></h2>
      {section.sub && <p className="section-sub">{section.sub}</p>}

      {section.organicBadge && (
        <div className="organic-badge"><span className="dot" />{section.organicBadge}</div>
      )}

      <div className="exp-list">
        <div className="exp-item featured">
          <div>
            <div className="exp-role">{item.role}</div>
            <div className="exp-company">{item.company}</div>

            {item.body && <div className="exp-body"><RichText value={item.body} /></div>}

            {item.bullets && (
              <ul className="bullet-list">
                {item.bullets.map((b, i) => (
                  <li key={i}>
                    {b.heading && <strong>{b.heading}</strong>}
                    <RichText value={b.body} />
                  </li>
                ))}
              </ul>
            )}

            {item.workSamples && <VideoCarousel samples={item.workSamples} />}
          </div>
          <div className="exp-date">
            {item.date.map((line, i) => (
              <span key={i}>
                {line}
                {i < item.date.length - 1 && <br />}
              </span>
            ))}
          </div>
        </div>

        {section.miniCards && (
          <div className="mini-row">
            {section.miniCards.map((c, i) => (
              <div className="mini-card" key={i}>
                <div className="mini-role">{c.role}</div>
                <div className="mini-company">{c.company}</div>
                {c.date && <div className="mini-date">{c.date}</div>}
                <div className="mini-body">{c.body}</div>
              </div>
            ))}
          </div>
        )}

        {section.platformLinks && (
          <div className="platform-list">
            {section.platformLinks.map((p, i) => (
              <a href={p.href} target="_blank" rel="noopener" className="platform-link" key={i}>
                <div className="platform-link-l">
                  <PlatformGlyph icon={p.icon} />
                  <span className="platform-link-name">{p.name}</span>
                  <span className="platform-link-handle">{p.handle}</span>
                </div>
                <ArrowIcon />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
