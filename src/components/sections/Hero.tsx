import { hero } from '@/content/site';
import { Kinetic } from '@/components/ui/Kinetic';
import { Rich } from '@/components/ui/Rich';
import { ContactButton } from '@/components/interactive/ContactDialog';

export function Hero() {
  return (
    <section className="hero container">
      <div className="hero-grid">
        <div className="hero-text">
          <h1 className="hero-title">
            <Kinetic text={hero.name} variant="hero" />
            <span className="dot">.</span>
            <span className="role">
              {hero.roleLead}
              <span className="gold">{hero.roleGold}</span>
            </span>
          </h1>
          <p className="hero-bio">
            <Rich value={hero.bio} />
          </p>
          <div className="hero-cta">
            <ContactButton className="btn btn-primary">{hero.cta}</ContactButton>
            <a href={hero.phone.href} className="btn btn-ghost">
              {hero.phone.label}
            </a>
          </div>
        </div>
        <div className="hero-photo">
          {/* loading="eager": the build-time lazy-loading leaves the hero alone */}
          <img
            loading="eager"
            fetchPriority="high"
            src={hero.photo.src.src}
            alt={hero.photo.alt}
            width={hero.photo.src.width}
            height={hero.photo.src.height}
          />
        </div>
      </div>
    </section>
  );
}
