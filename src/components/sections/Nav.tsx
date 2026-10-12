import { nav } from '@/content/site';
import { Icon } from '@/components/ui/Icon';
import { ContactButton } from '@/components/interactive/ContactDialog';

export function Nav() {
  return (
    <nav>
      <div className="nav-brand">
        {nav.brand}
        <div className="nav-check" aria-hidden="true">
          <Icon name="check" />
        </div>
      </div>
      <ContactButton className="nav-cta">{nav.cta}</ContactButton>
    </nav>
  );
}
