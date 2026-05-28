import { content } from '../data/content';
import { CheckIcon } from './icons';

interface Props {
  onOpenContact: () => void;
}

export function Nav({ onOpenContact }: Props) {
  const { brand, cta } = content.nav;
  return (
    <nav>
      <div className="nav-brand">
        {brand}
        <div className="nav-check" aria-hidden="true">
          <CheckIcon />
        </div>
      </div>
      <button type="button" className="nav-cta" onClick={onOpenContact}>
        {cta.label}
      </button>
    </nav>
  );
}
