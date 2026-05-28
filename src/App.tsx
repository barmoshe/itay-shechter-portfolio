import { content } from './data/content';
import { ProgressBar } from './components/ProgressBar';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { TimelineAccordion } from './components/TimelineAccordion';
import { ExperienceSection } from './components/ExperienceSection';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <>
      <ProgressBar />
      <Nav />
      <main>
        <Hero />
        <TimelineAccordion />
        <ExperienceSection section={content.v1} />
        <ExperienceSection section={content.fresh} />
        <ExperienceSection section={content.hot} />
        <ExperienceSection section={content.kan} />
        <Skills />
        <ExperienceSection section={content.education} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
