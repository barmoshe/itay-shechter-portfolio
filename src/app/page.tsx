// The one page, top to bottom. Every section renders from src/content/site.ts.
import { education, fresh, hot, kan } from '@/content/site';
import { Nav } from '@/components/sections/Nav';
import { Hero } from '@/components/sections/Hero';
import { V1 } from '@/components/sections/V1';
import { AiTools } from '@/components/sections/AiTools';
import { Timeline } from '@/components/sections/Timeline';
import { Experience } from '@/components/sections/Experience';
import { Skills } from '@/components/sections/Skills';
import { Contact, Footer } from '@/components/sections/Contact';

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <V1 />
        <AiTools />
        <Timeline />
        <Experience data={fresh} />
        <Experience data={hot} />
        <Experience data={kan} />
        <Skills />
        <Experience data={education} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
