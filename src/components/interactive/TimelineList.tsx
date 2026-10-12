'use client';

// The timeline accordion: one row open at a time (the row marked `open` in
// site.ts starts open). Clicking the open row closes it.
import { useState } from 'react';
import type { TimelineItem } from '@/content/types';
import { Rich } from '@/components/ui/Rich';

export function TimelineList({ items }: { items: TimelineItem[] }) {
  const [open, setOpen] = useState(() => items.findIndex((i) => i.open));

  return (
    <div className="timeline">
      {items.map((item, i) => {
        const isOpen = i === open;
        return (
          <div key={i} className={isOpen ? 'tl-item open' : 'tl-item'}>
            <button
              type="button"
              className="tl-row"
              aria-expanded={isOpen}
              aria-controls={`tl-detail-${i}`}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <div className="tl-main">
                <div className="tl-year">{item.year}</div>
                <div className="tl-role">{item.role}</div>
                <div className="tl-co">{item.company}</div>
              </div>
              <div className="tl-plus" aria-hidden="true" />
            </button>
            <div className="tl-detail" id={`tl-detail-${i}`} role="region">
              <div className="tl-detail-in">
                <p>
                  <Rich value={item.detail} />
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
