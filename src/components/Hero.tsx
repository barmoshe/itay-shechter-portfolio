import { content } from '../data/content';
import { asset } from '../lib/asset';
import { RichText } from './RichText';

export function Hero() {
  const h = content.hero;
  return (
    <section className="hero container">
      <div className="hero-grid">
        <div className="hero-text">
          <div className="hero-eyebrow"><span className="dot" />{h.eyebrow}</div>
          <h1 className="hero-title">
            {h.name}<span className="dot">.</span>
            <span className="role">{h.roleLead}<span className="gold">{h.roleGold}</span></span>
          </h1>
          <p className="hero-bio"><RichText value={h.bio} /></p>
          <div className="hero-cta">
            <a href={h.ctas.primary.href} className="btn btn-primary">{h.ctas.primary.label}</a>
            <a href={h.ctas.ghost.href} className="btn btn-ghost">{h.ctas.ghost.label}</a>
          </div>
          <div className="hero-stats">
            {h.stats.map((s, i) => (
              <div className="stat" key={i}>
                <div className="stat-num" aria-label={s.ariaLabel}>{s.num}</div>
                <div className="stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-photo">
          <img src={asset(h.photo.src)} alt={h.photo.alt} />
        </div>
      </div>
    </section>
  );
}
