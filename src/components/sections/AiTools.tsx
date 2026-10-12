import { aiTools as ai } from '@/content/site';
import { SectionHead } from '@/components/ui/SectionHead';
import { Rich } from '@/components/ui/Rich';

export function AiTools() {
  return (
    <section className="section container reveal" id={ai.id}>
      <SectionHead label={ai.label} headline={ai.headline} />
      <p className="ai-intro">
        <Rich value={ai.intro} />
      </p>

      <div className="tools">
        <article className="tool">
          <div className="tool-viz shot-story">
            <img loading="lazy" decoding="async" src={ai.tool.image.src} alt={ai.tool.imageAlt} />
          </div>
          <div className="tool-body">
            <div className="tool-kicker">{ai.tool.kicker}</div>
            <h3 className="tool-name">{ai.tool.name}</h3>
            <p>{ai.tool.text}</p>
          </div>
        </article>
      </div>

      <div className="tools-more">
        <div className="tools-more-lbl">{ai.moreTitle}</div>
        <div className="chips">
          {ai.more.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
