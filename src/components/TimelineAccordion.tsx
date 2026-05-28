import { useState } from 'react';
import { content } from '../data/content';
import { RichText } from './RichText';

export function TimelineAccordion() {
  const { id, pre, gold, items } = content.timeline;
  // Single-open accordion: track the index of the open item (or null).
  const initial = items.findIndex((i) => i.open);
  const [open, setOpen] = useState<number | null>(initial === -1 ? null : initial);

  return (
    <section className="timeline-section container" id={id}>
      <h2 className="section-headline">{pre}<span className="gold">{gold}</span></h2>
      <div className="timeline">
        {items.map((item, i) => {
          const isOpen = open === i;
          const panelId = `tl-detail-${i}`;
          return (
            <div className={`tl-item${isOpen ? ' open' : ''}`} key={i}>
              <button
                type="button"
                className="tl-row"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <div className="tl-main">
                  <div className="tl-year">{item.year}</div>
                  <div className="tl-role">{item.role}</div>
                  <div className="tl-co">{item.company}</div>
                </div>
                <div className="tl-plus" aria-hidden="true" />
              </button>
              <div className="tl-detail" id={panelId} role="region">
                <div className="tl-detail-in">
                  <p><RichText value={item.detail} /></p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
