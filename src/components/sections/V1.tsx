import type { CSSProperties } from 'react';
import { v1 } from '@/content/site';
import { Headline } from '@/components/ui/Headline';
import { Rich } from '@/components/ui/Rich';
import { Icon } from '@/components/ui/Icon';

export function V1() {
  const { feed } = v1.phone;
  // The feed scrolls one image height per loop; the CSS needs the image's
  // height/width ratio for that, read here from the imported file.
  const feedStyle = { backgroundImage: `url(${feed.src})`, '--feed-ratio': feed.height / feed.width } as CSSProperties;

  return (
    <section className="section container reveal" id={v1.id}>
      <Headline value={v1.headline} className="section-headline v1-title" />
      <p className="section-sub">{v1.sub}</p>

      <div className="v1-show">
        <div className="v1-story">
          {v1.steps.map((step) => (
            <div className="v1-step" key={step.label}>
              <div className="v1-step-lbl">{step.label}</div>
              <p>
                <Rich value={step.text} />
              </p>
            </div>
          ))}
          <p className="v1-close">
            <Rich value={v1.close} />
          </p>
        </div>
        <div className="phone-wrap">
          <div className="phone" role="img" aria-label={v1.phone.label}>
            <div className="phone-frame">
              <div className="phone-island" />
              <div className="phone-screen">
                <div className="phone-status">
                  <span>{v1.phone.time}</span>
                  <span className="phone-status-r">●●● ▮</span>
                </div>
                <div className="phone-feed" style={feedStyle} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="assets-head">
        <span>{v1.assets.title}</span>
        <span className="assets-total">
          <b dir="ltr">{v1.assets.total}</b>
          {v1.assets.totalLabel}
        </span>
      </div>
      <div className="assets">
        {v1.assets.items.map((a) => (
          <a className="asset" href={a.href} target="_blank" rel="noopener" key={a.name}>
            <div className="asset-top">
              <span className="asset-icon">
                <Icon name={a.icon} />
              </span>
              <span className="asset-name">{a.name}</span>
              <Icon name="arrow" className="asset-arrow" />
            </div>
            <div className="asset-num" dir="ltr">
              {a.value}
            </div>
            <div className="asset-lbl">
              <Rich value={a.label} />
            </div>
            <div className="asset-handle" dir="ltr">
              {a.handle}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
