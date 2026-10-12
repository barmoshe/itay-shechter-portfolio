import { skills } from '@/content/site';
import { SectionHead } from '@/components/ui/SectionHead';
import { Icon } from '@/components/ui/Icon';

export function Skills() {
  return (
    <section className="section container reveal" id={skills.id}>
      <SectionHead label={skills.label} headline={skills.headline} sub={skills.sub} />
      <div className="skills-grid">
        {skills.cards.map((card) => (
          <div className="skill-card" key={card.name}>
            <div className="skill-icon">
              <Icon name={card.icon} />
            </div>
            <div className="skill-name">{card.name}</div>
            <div className="skill-desc">{card.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
