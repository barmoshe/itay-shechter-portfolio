import { content } from '../data/content';
import { KineticName } from './KineticName';
import { useReveal } from '../hooks/useReveal';

export function Contact() {
  const ref = useReveal<HTMLElement>();
  const c = content.contact;
  return (
    <section className="section container reveal" id={c.id} style={{ scrollMarginTop: 80 }} ref={ref}>
      <div className="section-label">{c.label}</div>
      <h2 className="contact-headline" lang="en"><KineticName text={c.pre} boost={150} idle={45} /><span className="gold"><KineticName text={c.gold} base={400} boost={150} idle={45} /></span></h2>
      {c.sub && <p className="contact-sub">{c.sub}</p>}
      <div className="contact-list">
        {c.links.map((link, i) => {
          const external = link.href.startsWith('http');
          return (
            <a
              href={link.href}
              className="contact-link"
              key={i}
              {...(external ? { target: '_blank', rel: 'noopener' } : {})}
            >
              <span className="contact-link-text">{link.text}</span>
              <span className="contact-link-arrow">{link.arrow}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
