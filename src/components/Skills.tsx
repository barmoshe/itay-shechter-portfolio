import { content } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import { KineticName } from './KineticName';
import { SkillGlyph } from './icons';

export function Skills() {
  const ref = useReveal<HTMLElement>();
  const s = content.skills;
  return (
    <section className="section container reveal" id={s.id} style={{ scrollMarginTop: 80 }} ref={ref}>
      <div className="section-label">{s.label}</div>
      <h2 className="section-headline"><KineticName text={s.pre} boost={150} idle={45} /><span className="gold"><KineticName text={s.gold} base={400} boost={150} idle={45} /></span></h2>
      {s.sub && <p className="section-sub">{s.sub}</p>}
      <div className="skills-grid">
        {s.cards.map((card, i) => (
          <div className="skill-card" key={i}>
            <div className="skill-icon"><SkillGlyph icon={card.icon} /></div>
            <div className="skill-name">{card.name}</div>
            <div className="skill-desc">{card.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
