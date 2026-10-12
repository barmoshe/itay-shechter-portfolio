import { timeline } from '@/content/site';
import { Headline } from '@/components/ui/Headline';
import { TimelineList } from '@/components/interactive/TimelineList';

export function Timeline() {
  return (
    <section className="timeline-section container" id={timeline.id}>
      <Headline value={timeline.headline} />
      <TimelineList items={timeline.items} />
    </section>
  );
}
