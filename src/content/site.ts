// ALL the site's text, numbers, links, images and videos live here.
// To change what the site says, edit this file; the components only lay it out.
//
// Rich text (bio, steps, timeline details, bullets) is a list of pieces:
//   'plain text'   { b: 'bold' }   { hl: 'highlight' }   { gold: 'gold' }   { ltr: 'Latin/number' }
// Put spaces inside the strings where the sentence needs them.
// House rules: no em-dashes, no emoji.
import type {
  AiToolsSection,
  ContactModal,
  ContactSection,
  ExperienceSection,
  Hero,
  Nav,
  Seo,
  SkillsSection,
  TimelineSection,
  V1Section,
  VideoUi,
} from './types';

import heroPhoto from '@/assets/hero.jpg';
import v1Feed from '@/assets/v1-feed.webp';
import storyTracker from '@/assets/story-tracker.webp';
import work1 from '@/assets/work-1.jpg';
import work2 from '@/assets/work-2.jpg';
import work3 from '@/assets/work-3.jpg';

const tagline = 'עובד בנקודת המפגש שבין חדשות, יצירה וקהל, מרעיון לתוכן שאנשים באמת רוצים לראות.';
const email = 'itay1578@gmail.com';
const phone = { label: '050-408-2579', href: 'tel:0504082579' };

export const seo: Seo = {
  url: 'https://itayshechter.com/',
  title: 'איתי שכטר · Social Media Lead',
  description: `איתי שכטר, Social Media Lead. ${tagline}`,
  author: 'Itay Shechter',
  siteName: 'איתי שכטר',
  locale: 'he_IL',
  themeColor: '#0B0B0B',
  ogImage: { path: '/img/og.jpg', width: 1200, height: 630, alt: 'איתי שכטר, Social Media Lead' },
  person: {
    name: 'איתי שכטר',
    alternateName: 'Itay Shechter',
    jobTitle: 'Social Media Lead',
    description: `Social Media Lead. ${tagline}`,
    sameAs: ['https://www.instagram.com/itay_shechter_/'],
  },
};

export const nav: Nav = { brand: 'איתי שכטר', cta: 'דברו איתי' };

export const hero: Hero = {
  name: 'איתי שכטר',
  roleLead: 'Social Media ',
  roleGold: 'Lead',
  bio: [
    'אני איש תוכן, וידאו וקריאייטיב, שעובד בנקודת המפגש שבין ',
    { b: 'חדשות, יצירה וקהל' },
    '. מהקמת שפה מותגית ועד להפקת וידאו שעובד, אני לוקח רעיון ומתרגם אותו לתוכן שאנשים באמת רוצים לראות, לשתף ולהגיב אליו. היום אני מוביל את הסושיאל של ',
    { b: 'V1' },
    ', אפליקציה שהייתי חלק מצוות המייסדים שלה ובניתי לה את כל הנכסים הדיגיטליים מאפס.',
  ],
  cta: 'דברו איתי',
  phone,
  photo: { src: heroPhoto, alt: 'איתי שכטר' },
};

export const v1: V1Section = {
  id: 'v1',
  headline: { gold: [{ ltr: 'V1' }] },
  sub: 'צוות ההקמה · ראש דסק חדשות · מקים ומנהל הסושיאל · 12.2023 עד היום',
  steps: [
    {
      label: 'צוות ההקמה',
      text: [
        'הצטרפתי ל־V1 כחלק מצוות ההקמה הראשוני, ',
        { b: 'עוד לפני שהיה לאפליקציה שם' },
        '. לקחתי חלק בגיבוש הזהות שלה, מאפיון קהל היעד והשפה הוויזואלית ועד לחשיבה על האופן שבו התוכן ייראה ויוגש לצופים.',
      ],
    },
    {
      label: 'הדסק החדשותי',
      text: [
        'בהמשך עברתי לניהול הדסק החדשותי, שם הובלתי משמרות בסביבת עבודה אינטנסיבית ודינמית, עם דגש על ',
        { b: 'מהירות, דיוק והשאיפה להיות ראשונים' },
        ' בדיווחים ובפושים. ניהלתי את פעילות הדסק גם בתקופות חדשותיות מורכבות, בהן המלחמה וחזרת החטופים.',
      ],
    },
    {
      label: 'סושיאל מאפס',
      text: [
        'משם המשכתי לאתגר הבא: ',
        { b: 'הקמה מאפס של מערך הסושיאל של V1, באופן עצמאי' },
        '. מהגדרת האסטרטגיה, בניית ערוצי התוכן וגיבוש השפה הקריאייטיבית ועד לפיתוח פורמטים מקוריים וניהול הפעילות השוטפת.',
      ],
    },
    {
      label: 'צמיחה ופורמטים',
      text: [
        'מה שהתחיל כעמוד אינסטגרם חדש צמח ל',
        { b: 'יותר מ־100 אלף עוקבים בתוך פחות משנה' },
        ', בצמיחה אורגנית לחלוטין. לצד זאת, פיתחתי והובלתי פורמטים ותכנים מגוונים, בהם ',
        { hl: '"60 שניות"' },
        ', פודקאסט בהשתתפות ',
        { hl: 'רומי גונן' },
        ', וניהול סדרת המיקרו־דרמה ',
        { hl: '"כשהגלים מתחזקים"' },
        ', מהחלוצות בתחום בישראל.',
      ],
    },
  ],
  close: [
    'לאורך הדרך שילבתי בין חשיבה מערכתית, ניהול צוותים, קריאייטיב והבנה של קהל, במטרה אחת: ליצור תוכן שלא רק מגיע לאנשים, אלא גורם להם ',
    { gold: 'לעצור, לצפות ולהתחבר.' },
  ],
  phone: { label: 'גלילה בעמוד האינסטגרם של V1', time: '12:28', feed: v1Feed },
  assets: {
    title: 'הנכסים שהקמתי',
    total: '300K+',
    totalLabel: ' עוקבים בכל הפלטפורמות',
    items: [
      { name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/v1.israel', value: '157K', label: ['עוקבים'], handle: '@v1.israel' },
      {
        name: 'TikTok',
        icon: 'tiktok',
        href: 'https://www.tiktok.com/@v1.israel',
        value: '87.5K',
        label: ['עוקבים · ', { ltr: '13.1M' }, ' לייקים'],
        handle: '@v1.israel',
      },
      { name: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/share/1B2CCTqipD/', value: '41K', label: ['עוקבים'], handle: 'V1' },
      { name: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/@v1israel', value: '17.5K', label: ['מנויים'], handle: '@v1israel' },
    ],
  },
};

export const aiTools: AiToolsSection = {
  id: 'ai',
  label: 'AI · Claude',
  headline: { pre: 'בונה כלים ', gold: ['עם ', { ltr: 'AI' }] },
  intro: [
    'AI הוא חלק מארגז הכלים היומיומי שלי. כשאני מזהה צורך בצוות, אני לא מחכה למחלקת פיתוח: אני בונה את הפתרון בעצמי עם ',
    { b: 'Claude' },
    ', מהאפיון והעיצוב ועד כלי שעובד בשטח ומשרת את הצוות כל יום.',
  ],
  tool: {
    image: storyTracker,
    imageAlt: 'V1 Story Tracker: דשבורד הסטוריז, בדסקטופ ובמובייל',
    kicker: 'Meta API · Google Sheets · Apps Script',
    name: 'מעקב הסטוריז של V1',
    text: 'מערכת שאוספת אוטומטית את הסטוריז של עמוד האינסטגרם, ודשבורד שבו צוות המשמרות מתייג כל סטורי. המטרה: להבין מה באמת מייצר אינטראקציה, ולהגדיל את החשיפה בסטורי על בסיס נתונים.',
  },
  moreTitle: 'עוד דברים שבניתי',
  more: [
    'דשבורד מעקב לינקים לטלגרם (Bitly)',
    'מחולל "פס כתבה" לרילס מהנייד',
    'בוט שמעביר פוסטים מטלגרם לפייסבוק',
    'דוחות ביצועים שבועיים לצוות',
    'דף Link in Bio',
    'מצגת הסבר אלגוריתם לצוות',
  ],
};

export const timeline: TimelineSection = {
  id: 'path',
  headline: { pre: 'ה', gold: ['מסלול'] },
  items: [
    {
      year: '2023 ←',
      role: 'ראש תחום סושיאל & ממייסדי V1',
      company: 'V1 · אפליקציית חדשות',
      open: true,
      detail: [
        'הקמת מערך הסושיאל מאפס. אסטרטגיה, שפה ותוכן בחמש פלטפורמות. ',
        { hl: 'צמיחה אורגנית ל־100K עוקבים בשנה הראשונה' },
        ', וחברות בצוות שפיתח את פורמט הווידאו "60 שניות" ובצוות שתפעל את סדרת המיקרו-דרמה ',
        { hl: '"כשהגלים מתחזקים"' },
        '.',
      ],
    },
    {
      year: '2022–23',
      role: 'מנהל תוכן · TikTok',
      company: 'Fresh Agency',
      detail: [
        'ניהול עמודי הטיקטוק הגדולים בישראל: ',
        { hl: "סמסונג, KFC, פאפא ג'ונס, סלקום" },
        ' ועוד. פיצוח קריאייטיב, הפקה וניהול יוצרים, מהקונספט ועד מיליון צפיות אורגניות.',
      ],
    },
    {
      year: '2022',
      role: 'מנהל סושיאל',
      company: 'HOT · HOT Mobile · NEXTtv',
      detail: [
        'ניהול נכסי הסושיאל של שלושת המותגים. כתיבה, עריכה והפקה, לצד שיתופי פעולה עם טאלנטים ועמודים עם ',
        { hl: 'מאות אלפי עוקבים' },
        '.',
      ],
    },
    {
      year: '2022',
      role: 'תחקירן · מחלקת הדיגיטל',
      company: 'כאן 11 · פודקאסט "עוד יום"',
      detail: [
        'תחקירים מעמיקים לפודקאסט האקטואליה המוביל בהגשת ',
        { hl: 'עקיבא נוביק ודניאל אופיר' },
        '. הבסיס שממנו צמחה ההתמחות בחדשות.',
      ],
    },
  ],
};

export const fresh: ExperienceSection = {
  id: 'ed-fresh',
  label: 'ניסיון',
  tag: 'Fresh Agency · TikTok',
  headline: { pre: 'מנהל תוכן ', gold: [{ ltr: 'TikTok' }] },
  sub: 'מנהל תוכן · מחלקת TikTok · Fresh Agency · 2022–2023',
  role: 'מנהל תוכן · מחלקת TikTok',
  company: 'Fresh Agency · 2022–2023',
  bullets: [
    {
      heading: 'ניהול עמודי הטיקטוק הגדולים במדינה',
      text: [{ hl: "Samsung · KFC · Papa John's · SteelSeries · BUYME · סלקום" }, ' ועוד.'],
    },
    {
      heading: 'פיצוח קריאייטיב לפלטפורמה',
      text: ['לקחת מוצר ולתרגם אותו לשפת הטיקטוק. איך מוכרים את המתקפל החדש של סמסונג בסרטון? איך משווקים להורים אינטרנט סיבים?'],
    },
    {
      heading: 'הפקה וניהול יוצרים',
      text: ['הובלת המהלך מקצה לקצה. משלב הקונספט, דרך גיוס המשפיענים והטאלנטים הנכונים, ועד להפקה של סרטונים שמביאים טראפיק ומכירות.'],
    },
  ],
  // Add a video: one entry here + its thumbnail in src/assets (about 600px wide).
  // videoId: the number in the TikTok URL (or from https://www.tiktok.com/oembed?url=<share link>).
  videos: [
    {
      href: 'https://vt.tiktok.com/ZSxfNmUk5/',
      videoId: '7213342478848511233',
      image: work1,
      brandHandle: '@buyme.co.il',
      tag: 'BUYME ישראל',
      title: 'תייגו את הבסטית, ויראליות לחגיגת יום הולדת',
      desc: 'קונספט, הפקה ועריכה לסרטון יום הולדת שעבד בדיוק כמו שתוכנן. מנגנון תיוג חברתי שהפך את העוקבים למפיצי המותג.',
    },
    {
      href: 'https://vt.tiktok.com/ZSxfFM1g6/',
      videoId: '7215933593686756609',
      image: work2,
      brandHandle: '@kfcisrael',
      stat: '1M+ צפיות אורגני',
      tag: 'KFC ישראל',
      title: 'טרנד הרולאפס, מיליון צפיות אורגני',
      desc: 'רכבנו על הטרנד החם במדינה ויצרנו סרטון ויראלי מאפס. רעיון, צילום ועריכה שהביאו לחשיפה אורגנית אדירה ושיח מטורף סביב המותג.',
    },
    {
      href: 'https://vt.tiktok.com/ZSxnEYDrs/',
      videoId: '7273419268144827654',
      image: work3,
      brandHandle: '@samsungisrael',
      stat: '600K+ צפיות אורגני',
      tag: 'Samsung ישראל',
      title: 'Galaxy Z Flip5 פוגש מוזיקה',
      desc: 'חיברנו בין המכשיר המתקפל לעולם המוזיקה וההופעות בקמפיין #GalaxyMusic. קונספט, הפקה ועריכה בשפת הטיקטוק, עם חשיפה אורגנית רחבה.',
    },
  ],
  date: ['2022–', '2023'],
};

export const hot: ExperienceSection = {
  id: 'ed-hot',
  label: 'ניסיון',
  tag: 'HOT · Social Media',
  headline: { pre: 'מנהל ', gold: ['סושיאל'] },
  sub: 'HOT · 2022',
  role: 'מנהל סושיאל',
  company: 'HOT',
  body: 'ניהול נכסי סושיאל של HOT, HOT Mobile ו-NEXTtv. כתיבה, עריכה, הפקה. שיתופי פעולה עם טאלנטים, Young VOD, עמודים עם מאות אלפי עוקבים.',
  date: ['2022'],
};

export const kan: ExperienceSection = {
  id: 'ed-kan',
  label: 'ניסיון',
  tag: 'כאן 11 · דיגיטל',
  headline: { pre: 'תחקירן ', gold: ['כאן 11'] },
  sub: 'תחקירן ומתמחה · מחלקת הדיגיטל · 2022',
  role: 'תחקירן ומתמחה · מחלקת הדיגיטל',
  company: 'כאן 11 · פודקאסט "עוד יום"',
  body: 'מחקר ותחקיר תוכן: ביצוע תחקירים מעמיקים עבור פודקאסט האקטואליה המוביל "עוד יום" בהגשת עקיבא נוביק ודניאל אופיר.',
  date: ['2022'],
  miniCards: [
    { role: 'שירות צבאי', company: 'חיל התותחנים', date: '2014–2017', body: 'רס"פ פלוגה, מצטיין 2015, אחריות על 85 חיילים' },
    { role: 'קצין ביטחון', company: 'רשת ישראכרט', date: '2018–2019', body: 'ניהול משמרות, קבלת החלטות בזמן אמת' },
  ],
};

export const skills: SkillsSection = {
  id: 'ed-skills',
  label: 'כישורים',
  headline: { pre: 'הכלים ', gold: ['שלי'] },
  sub: 'מה אני מביא לכל פרויקט',
  cards: [
    { icon: 'sparkles', name: 'AI Tools', desc: 'משלב כלי Generative AI כחלק בלתי נפרד מתהליכי הקריאייטיב וההפקה (Claude, ChatGPT, Midjourney).' },
    { icon: 'send', name: 'אסטרטגיית סושיאל', desc: 'בניית אסטרטגיה מ-0, הגדרת שפה ויזואלית וקולית, תכנון לטווח ארוך.' },
    { icon: 'video', name: 'תוכן ווידאו', desc: 'Adobe Premiere Pro ברמה גבוהה, עריכה ויצירה למובייל ולדסקטופ.' },
    { icon: 'sprout', name: 'צמיחה אורגנית', desc: 'בניית קהילות אמיתיות. ללא מודעות, מהיסוד ועד מאות אלפים.' },
    { icon: 'handshake', name: 'שיתופי פעולה', desc: 'עבודה עם מותגים, יוצרי תוכן, ניהול ממשקים מורכבים.' },
    { icon: 'pen', name: 'כתיבה שיווקית', desc: 'קפשנים, סקריפטים, שפת מותג. עברית ואנגלית ברמה גבוהה מאוד.' },
    { icon: 'bulb', name: 'פיתוח פורמטים', desc: 'חשיבה על פורמטים חדשים, בניית שפה ייחודית מהקונספט ועד הביצוע.' },
  ],
};

export const education: ExperienceSection = {
  id: 'ed-edu',
  label: 'השכלה',
  headline: { pre: 'תואר ', gold: ['ראשון'] },
  role: 'B.A בתקשורת · התמחות בתוכן ויצירה',
  company: 'המכללה למנהל',
  body: 'תואר ראשון עם דגש על תוכן דיגיטלי, שיווק ומדיה.',
  date: ['2022'],
};

export const contact: ContactSection = {
  id: 'ed-contact',
  label: 'צור קשר',
  headline: { pre: 'יאללה, בוא ', gold: ['נכיר.'] },
  sub: 'אימייל, טלפון, מה שנוח לך. עונה באותו יום.',
  links: [
    { text: email, arrow: 'אימייל →', href: `mailto:${email}` },
    { text: phone.label, arrow: 'טלפון →', href: phone.href },
    { text: '@itay_shechter_', arrow: 'אינסטגרם →', href: 'https://www.instagram.com/itay_shechter_/', ltr: true, external: true },
  ],
};

export const contactModal: ContactModal = {
  title: 'דברו איתי',
  sub: 'בחרו את הערוץ הנוח לכם. עונה באותו יום.',
  closeLabel: 'סגור',
  options: [
    { icon: 'mail', label: 'אימייל', value: email, href: `mailto:${email}` },
    { icon: 'whatsapp', label: 'וואטסאפ', value: phone.label, href: 'https://wa.me/972504082579', external: true },
  ],
};

export const videoUi: VideoUi = {
  carouselLabel: 'סרטוני וידאו נבחרים',
  carouselRole: 'קרוסלה',
  prevLabel: 'הסרטון הקודם',
  nextLabel: 'הסרטון הבא',
  dotsLabel: 'ניווט בין הסרטונים',
  dotLabel: 'סרטון {n}',
  watch: 'צפה בסרטון',
  openIn: 'פתח ב-TikTok',
  closeLabel: 'סגור',
};

export const footer = '© 2026 · Itay Shechter · Social Media Lead';
