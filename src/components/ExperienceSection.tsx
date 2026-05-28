import type { ExperienceSection as Section, WorkSample } from '../data/content';
import { asset } from '../lib/asset';
import { useReveal } from '../hooks/useReveal';
import { RichText } from './RichText';
import {
  ArrowIcon,
  PlatformGlyph,
  PlayIcon,
  TiktokBrandGlyph,
  WorkLinkArrow,
} from './icons';

function WorkCard({ sample }: { sample: WorkSample }) {
  return (
    <a href={sample.href} target="_blank" rel="noopener" className="work-card">
      <div
        className="work-card-thumb"
        style={{ backgroundImage: `url('${asset(sample.image)}')` }}
      >
        <div className="work-card-brand">
          <TiktokBrandGlyph />
          <span>{sample.brandHandle}</span>
        </div>
        <div className="work-card-play" aria-hidden="true">
          <PlayIcon />
        </div>
        {sample.stat && (
          <div className="work-card-stat"><span className="gold-dot" />{sample.stat}</div>
        )}
      </div>
      <div className="work-card-body">
        <div className="work-card-tag">{sample.tag}</div>
        <div className="work-card-title">{sample.title}</div>
        <div className="work-card-desc">{sample.desc}</div>
        <div className="work-card-link">צפה ב-TikTok <WorkLinkArrow /></div>
      </div>
    </a>
  );
}

export function ExperienceSection({ section }: { section: Section }) {
  const ref = useReveal<HTMLElement>();
  const { item } = section;
  return (
    <section className="section container reveal" id={section.id} style={{ scrollMarginTop: 80 }} ref={ref}>
      <div className="section-label">{section.label}</div>
      {section.tag && <div className="section-tag">{section.tag}</div>}
      <h2 className="section-headline">{section.pre}<span className="gold">{section.gold}</span></h2>
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

            {item.workSamples && (
              <div className="work-samples">
                {item.workSamples.map((s, i) => (
                  <WorkCard sample={s} key={i} />
                ))}
              </div>
            )}
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
