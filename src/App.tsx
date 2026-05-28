import { useState } from 'react';
import { content } from './data/content';
import { ProgressBar } from './components/ProgressBar';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { TimelineAccordion } from './components/TimelineAccordion';
import { ExperienceSection } from './components/ExperienceSection';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const openContact = () => setContactOpen(true);
  const closeContact = () => setContactOpen(false);

  return (
    <>
      <ProgressBar />
      <Nav onOpenContact={openContact} />
      <main>
        <Hero onOpenContact={openContact} />
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
      <ContactModal open={contactOpen} onClose={closeContact} />
    </>
  );
}
