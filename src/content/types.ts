// Shapes of the site content in site.ts. Every section component reads one of
// these, so a missing or misspelled field is a build error, not a broken page.
import type { StaticImageData } from 'next/image';
import type { IconName } from '@/components/ui/Icon';

/** Inline rich text: plain strings, <span class="hl"> highlights, <strong> bold,
 *  gold words and left-to-right runs (Latin text or numbers inside Hebrew). */
export type Seg = string | { hl: string } | { b: string } | { gold: string } | { ltr: string };
export type Rich = Seg[];

/** A kinetic headline: optional plain part, then the gold part. Gold parts can
 *  be split so a Latin word gets dir="ltr" (e.g. ['עם ', { ltr: 'AI' }]). */
export type Headline = {
  pre?: string;
  gold: (string | { ltr: string })[];
};

export type Link = { label: string; href: string };

export type Seo = {
  url: string;
  title: string;
  description: string;
  author: string;
  siteName: string;
  locale: string;
  themeColor: string;
  ogImage: { path: string; width: number; height: number; alt: string };
  person: { name: string; alternateName: string; jobTitle: string; description: string; sameAs: string[] };
};

export type Nav = { brand: string; cta: string };

export type Hero = {
  name: string;
  roleLead: string;
  roleGold: string;
  bio: Rich;
  cta: string;
  phone: Link;
  photo: { src: StaticImageData; alt: string };
};

export type V1Step = { label: string; text: Rich };
export type Asset = {
  name: string;
  icon: IconName;
  href: string;
  value: string;
  label: Rich;
  handle: string;
};
export type V1Section = {
  id: string;
  headline: Headline;
  sub: string;
  steps: V1Step[];
  close: Rich;
  phone: { label: string; time: string; feed: StaticImageData };
  assets: { title: string; total: string; totalLabel: string; items: Asset[] };
};

export type AiTool = {
  image: StaticImageData;
  imageAlt: string;
  kicker: string;
  name: string;
  text: string;
};
export type AiToolsSection = {
  id: string;
  label: string;
  headline: Headline;
  intro: Rich;
  tool: AiTool;
  moreTitle: string;
  more: string[];
};

export type TimelineItem = {
  year: string;
  role: string;
  company: string;
  detail: Rich;
  open?: boolean;
};
export type TimelineSection = { id: string; headline: Headline; items: TimelineItem[] };

export type Bullet = { heading: string; text: Rich };
export type WorkSample = {
  href: string;
  videoId: string; // numeric TikTok id, used by the in-page player
  image: StaticImageData;
  brandHandle: string;
  stat?: string;
  tag: string;
  title: string;
  desc: string;
};
export type MiniCard = { role: string; company: string; date?: string; body: string };
export type ExperienceSection = {
  id: string;
  label: string;
  tag?: string;
  headline: Headline;
  sub?: string;
  role: string;
  company: string;
  body?: string;
  bullets?: Bullet[];
  videos?: WorkSample[];
  date: string[]; // one entry per line
  miniCards?: MiniCard[];
};

export type Skill = { icon: IconName; name: string; desc: string };
export type SkillsSection = { id: string; label: string; headline: Headline; sub: string; cards: Skill[] };

export type ContactLink = { text: string; arrow: string; href: string; ltr?: boolean; external?: boolean };
export type ContactSection = { id: string; label: string; headline: Headline; sub: string; links: ContactLink[] };

export type ContactOption = { icon: IconName; label: string; value: string; href: string; external?: boolean };
export type ContactModal = { title: string; sub: string; closeLabel: string; options: ContactOption[] };

export type VideoUi = {
  carouselLabel: string;
  carouselRole: string;
  prevLabel: string;
  nextLabel: string;
  dotsLabel: string;
  dotLabel: string; // "{n}" is replaced by the video number
  watch: string;
  openIn: string;
  closeLabel: string;
};
