import { contact, footer } from '@/content/site';
import { Headline } from '@/components/ui/Headline';

export function Contact() {
  return (
    <section className="section container reveal" id={contact.id}>
      <div className="section-label">{contact.label}</div>
      <Headline value={contact.headline} className="contact-headline" />
      <p className="contact-sub">{contact.sub}</p>
      <div className="contact-list">
        {contact.links.map((l) => (
          <a key={l.href} href={l.href} className="contact-link" {...(l.external ? { target: '_blank', rel: 'noopener' } : {})}>
            <span className="contact-link-text" dir={l.ltr ? 'ltr' : undefined}>
              {l.text}
            </span>
            <span className="contact-link-arrow">{l.arrow}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return <footer>{footer}</footer>;
}
