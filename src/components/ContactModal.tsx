import { useEffect, useRef } from 'react';
import { content, type ContactOption } from '../data/content';
import { CloseIcon, EnvelopeIcon, WhatsAppIcon } from './icons';

function OptionIcon({ kind }: { kind: ContactOption['kind'] }) {
  return kind === 'email' ? <EnvelopeIcon /> : <WhatsAppIcon />;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ContactModal({ open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const m = content.contactModal;

  // Mirror React state onto the native <dialog>. showModal() gives us focus
  // trapping, ESC-to-close, and the ::backdrop pseudo-element for free.
  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  // Backdrop click: a click whose target is the <dialog> itself (not its inner
  // content) happened on the backdrop area, so close. Listening on the element
  // instead of via onClick keeps jsx-a11y happy (no role inference on dialog).
  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const onBackdrop = (e: MouseEvent) => {
      if (e.target === dlg) onClose();
    };
    dlg.addEventListener('click', onBackdrop);
    return () => dlg.removeEventListener('click', onBackdrop);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className="contact-modal"
      aria-labelledby="contact-modal-title"
      onClose={onClose}
    >
      <div className="contact-modal-inner">
        <button
          type="button"
          className="contact-modal-close"
          aria-label={m.closeLabel}
          onClick={onClose}
        >
          <CloseIcon />
        </button>
        <h2 id="contact-modal-title" className="contact-modal-title">{m.title}</h2>
        {m.sub && <p className="contact-modal-sub">{m.sub}</p>}
        <div className="contact-modal-options">
          {m.options.map((opt) => {
            const external = opt.href.startsWith('http');
            return (
              <a
                key={opt.kind}
                href={opt.href}
                className="contact-option"
                onClick={onClose}
                {...(external ? { target: '_blank', rel: 'noopener' } : {})}
              >
                <span className="contact-option-icon" aria-hidden="true">
                  <OptionIcon kind={opt.kind} />
                </span>
                <span className="contact-option-text">
                  <span className="contact-option-label">{opt.label}</span>
                  <span className="contact-option-value">{opt.value}</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </dialog>
  );
}
