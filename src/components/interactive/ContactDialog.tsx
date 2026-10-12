'use client';

// The "talk to me" popup. ContactProvider renders the <dialog> after the page
// content and lets any ContactButton open it.
import { createContext, useCallback, useContext, useRef, type ReactNode } from 'react';
import { contactModal as m } from '@/content/site';
import { Icon } from '@/components/ui/Icon';

const OpenContact = createContext<() => void>(() => {});

export function ContactProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = useCallback(() => {
    const dlg = ref.current;
    if (dlg && !dlg.open) dlg.showModal();
  }, []);
  const close = () => ref.current?.close();

  return (
    <OpenContact.Provider value={open}>
      {children}
      <dialog
        ref={ref}
        className="contact-modal"
        aria-labelledby="contact-modal-title"
        onClick={(e) => e.target === e.currentTarget && close()} // click on the backdrop
      >
        <div className="contact-modal-inner">
          <button type="button" className="contact-modal-close" aria-label={m.closeLabel} onClick={close}>
            <Icon name="close" />
          </button>
          <h2 id="contact-modal-title" className="contact-modal-title">
            {m.title}
          </h2>
          <p className="contact-modal-sub">{m.sub}</p>
          <div className="contact-modal-options">
            {m.options.map((o) => (
              <a
                key={o.href}
                href={o.href}
                className="contact-option"
                onClick={close}
                {...(o.external ? { target: '_blank', rel: 'noopener' } : {})}
              >
                <span className="contact-option-icon" aria-hidden="true">
                  <Icon name={o.icon} />
                </span>
                <span className="contact-option-text">
                  <span className="contact-option-label">{o.label}</span>
                  <span className="contact-option-value">{o.value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </dialog>
    </OpenContact.Provider>
  );
}

export function ContactButton({ className, children }: { className: string; children: ReactNode }) {
  const open = useContext(OpenContact);
  return (
    <button type="button" className={className} onClick={open}>
      {children}
    </button>
  );
}
