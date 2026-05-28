import { content } from '../data/content';
import { CheckIcon } from './icons';

export function Nav() {
  const { brand, cta } = content.nav;
  return (
    <nav>
      <div className="nav-brand">
        {brand}
        <div className="nav-check" aria-hidden="true">
          <CheckIcon />
        </div>
      </div>
      <a href={cta.href} className="nav-cta">{cta.label}</a>
    </nav>
  );
}
