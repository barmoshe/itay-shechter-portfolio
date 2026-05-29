// Single source of truth for all site copy and links.
//
// IMPORTANT: this file mirrors Itay's standalone HTML. When Itay sends an
// updated standalone.html, regenerate this file with the digest skill:
//   npm run digest -- /path/to/itay-shechter-portfolio-standalone.html
// Hand edits here will be overwritten on the next digest, so prefer editing
// the standalone HTML and re-running the digest.

export interface Link {
  label: string;
  href: string;
}

// Inline rich text: a run of plain text, optionally gold-highlighted (hl) or
// bold (strong). Mirrors <span class="hl"> and <strong> in the standalone.
export interface RichSeg {
  t: string;
  hl?: boolean;
  strong?: boolean;
}
export type Rich = RichSeg[];

export interface Stat {
  num: string;
  label: string;
  ariaLabel?: string;
}

export interface TimelineItem {
  year: string;
  role: string;
  company: string;
  detail: Rich;
  open?: boolean;
}

export interface Bullet {
  heading?: string;
  body: Rich;
}

export interface MiniCard {
  role: string;
  company: string;
  date?: string;
  body: string;
}

export type PlatformIcon = 'instagram' | 'tiktok' | 'facebook';
export interface PlatformLink {
  icon: PlatformIcon;
  name: string;
  handle: string;
  href: string;
}

export interface WorkSample {
  href: string;
  image: string;
  brandHandle: string;
  stat?: string;
  tag: string;
  title: string;
  desc: string;
}

export interface ExpItem {
  role: string;
  company: string;
  body?: Rich;
  bullets?: Bullet[];
  workSamples?: WorkSample[];
  date: string[];
}

export type SkillIcon =
  | 'ai'
  | 'strategy'
  | 'video'
  | 'growth'
  | 'collab'
  | 'writing'
  | 'format';
export interface Skill {
  icon: SkillIcon;
  name: string;
  desc: string;
}

export interface ContactLink {
  text: string;
  arrow: string;
  href: string;
}

export interface SectionHead {
  id: string;
  label: string;
  tag?: string;
  pre: string;
  gold: string;
  sub?: string;
}

export interface ExperienceSection extends SectionHead {
  organicBadge?: string;
  item: ExpItem;
  miniCards?: MiniCard[];
  platformLinks?: PlatformLink[];
}

const EMAIL = 'ltay1578@gmail.com';
const PHONE_HREF = 'tel:0504082579';
const PHONE_LABEL = '050-408-2579';
// wa.me requires the international form with no leading 0 (IL +972).
const WHATSAPP_HREF = 'https://wa.me/972504082579';

export interface ContactOption {
  kind: 'email' | 'whatsapp';
  label: string;
  value: string;
  href: string;
}

export const content = {
  nav: {
    brand: 'איתי שכטר',
    cta: { label: 'דברו איתי', href: `mailto:${EMAIL}` } as Link,
  },

  hero: {
    name: 'איתי שכטר',
    roleLead: 'Social Media ',
    roleGold: 'Lead',
    bio: [
      { t: 'אני עובד בנקודת המפגש שבין ' },
      { t: 'חדשות, יצירה וקהל', strong: true },
      {
        t: '. מהקמת שפה מותגית ועד הפקת וידאו שעובד. אני לוקח רעיון ומתרגם אותו לתוכן שאנשים באמת רוצים לראות.',
      },
    ] as Rich,
    photo: { src: 'img/hero.jpg', alt: 'איתי שכטר', width: 640, height: 640 },
    ctas: {
      primary: { label: 'דברו איתי', href: `mailto:${EMAIL}` } as Link,
      ghost: { label: PHONE_LABEL, href: PHONE_HREF } as Link,
    },
    stats: [
      { num: '100K+', label: 'קהילה אורגנית' },
      { num: '4', label: 'פלטפורמות' },
      { num: '4+', label: 'שנות ניסיון' },
      { num: '∞', label: 'צמיחה', ariaLabel: 'ללא הגבלה' },
    ] as Stat[],
  },

  timeline: {
    id: 'path',
    pre: 'ה',
    gold: 'מסלול',
    items: [
      {
        year: '2023 ←',
        role: 'ראש תחום סושיאל & ממייסדי V1',
        company: 'V1 · אפליקציית חדשות',
        open: true,
        detail: [
          { t: 'הקמת מערך הסושיאל מאפס. אסטרטגיה, שפה ותוכן בארבע פלטפורמות. ' },
          { t: 'צמיחה אורגנית ל־100K עוקבים בשנה הראשונה', hl: true },
          { t: ', וחברות בצוות שפיתח את פורמט הווידאו "60 שניות".' },
        ],
      },
      {
        year: '2022–23',
        role: 'מנהל תוכן · TikTok',
        company: 'Fresh Agency',
        detail: [
          { t: 'ניהול עמודי הטיקטוק הגדולים בישראל: ' },
          { t: "סמסונג, KFC, פאפא ג'ונס, סלקום", hl: true },
          {
            t: ' ועוד. פיצוח קריאייטיב, הפקה וניהול יוצרים, מהקונספט ועד מיליון צפיות אורגניות.',
          },
        ],
      },
      {
        year: '2022',
        role: 'מנהל סושיאל',
        company: 'HOT · HOT Mobile · NEXTtv',
        detail: [
          { t: 'ניהול נכסי הסושיאל של שלושת המותגים. כתיבה, עריכה והפקה, לצד שיתופי פעולה עם טאלנטים ועמודים עם ' },
          { t: 'מאות אלפי עוקבים', hl: true },
          { t: '.' },
        ],
      },
      {
        year: '2022',
        role: 'תחקירן · מחלקת הדיגיטל',
        company: 'כאן 11 · פודקאסט "עוד יום"',
        detail: [
          { t: 'תחקירים מעמיקים לפודקאסט האקטואליה המוביל בהגשת ' },
          { t: 'עקיבא נוביק ודניאל אופיר', hl: true },
          { t: '. הבסיס שממנו צמחה ההתמחות בחדשות.' },
        ],
      },
    ] as TimelineItem[],
  },

  v1: {
    id: 'v1',
    label: 'פרויקט מרכזי',
    tag: 'Founding Team · V1',
    pre: 'הקמנו משהו גדול ',
    gold: 'מאפס',
    sub: 'ממייסדי האפליקציה ומנהל דיגיטל וסושיאל · V1 · 12.2023 עד היום',
    organicBadge: '100% אורגני · Organic Only',
    item: {
      role: 'ממייסדי האפליקציה ומנהל דיגיטל וסושיאל',
      company: 'V1 · Founding Team · 2023 עד היום',
      date: ['12.2023 →', 'היום'],
      bullets: [
        {
          body: [
            { t: 'הקמת מערך הסושיאל של האפליקציה מאפס, ב־' },
            { t: 'Instagram · TikTok · Facebook · Telegram', hl: true },
            { t: ', החל משלב פתיחת החשבונות.' },
          ],
        },
        {
          body: [
            { t: 'פיתוח אסטרטגיה, בניית שפה מותגית, ניהול קריאייטיב והובלת קהילה שצמחה ל-' },
            { t: '100K+ עוקבים אורגניים', hl: true },
            { t: ' בתוך שנה אחת בלבד.' },
          ],
        },
        {
          body: [
            { t: 'פיתוח פורמטים וחדשנות: חבר בצוות החשיבה והפיתוח של פורמט הווידאו ' },
            { t: '"60 שניות"', hl: true },
            { t: '.' },
          ],
        },
        {
          body: [
            { t: 'שותפות בצוות המייסדים: לקחתי חלק פעיל בצוות הליבה שהקים, ייסד והשיק את אפליקציית V1.' },
          ],
        },
      ],
    },
    miniCards: [
      { role: 'Instagram', company: '100K+ עוקבים', body: 'אורגניים, ממשיך לגדול' },
      { role: 'פלטפורמות', company: '4 ערוצים', body: 'הוקמו מאפס, מנוהלים שוטף' },
      { role: 'קהילה', company: 'אורגנית', body: 'ללא מודעות ממומנות' },
    ],
    platformLinks: [
      {
        icon: 'instagram',
        name: 'Instagram',
        handle: '@v1.israel',
        href: 'https://www.instagram.com/v1.israel?igsh=bmhkMWloaGY0NGR5&utm_source=qr',
      },
      {
        icon: 'tiktok',
        name: 'TikTok',
        handle: '@v1.israel',
        href: 'https://www.tiktok.com/@v1.israel?_r=1&_t=ZS-96chaQHtPOy',
      },
      {
        icon: 'facebook',
        name: 'Facebook',
        handle: 'V1 Israel',
        href: 'https://www.facebook.com/share/1B2CCTqipD/?mibextid=wwXIfr',
      },
    ],
  } as ExperienceSection,

  fresh: {
    id: 'ed-fresh',
    label: 'ניסיון',
    tag: 'Fresh Agency · TikTok',
    pre: 'מנהל תוכן ',
    gold: 'TikTok',
    sub: 'מנהל תוכן · מחלקת TikTok · Fresh Agency · 2022–2023',
    item: {
      role: 'מנהל תוכן · מחלקת TikTok',
      company: 'Fresh Agency · 2022–2023',
      date: ['2022–', '2023'],
      bullets: [
        {
          heading: 'ניהול עמודי הטיקטוק הגדולים במדינה',
          body: [
            { t: "Samsung · KFC · Papa John's · SteelSeries · BUYME · סלקום", hl: true },
            { t: ' ועוד.' },
          ],
        },
        {
          heading: 'פיצוח קריאייטיב לפלטפורמה',
          body: [
            { t: 'לקחת מוצר ולתרגם אותו לשפת הטיקטוק. איך מוכרים את המתקפל החדש של סמסונג בסרטון? איך משווקים להורים אינטרנט סיבים?' },
          ],
        },
        {
          heading: 'הפקה וניהול יוצרים',
          body: [
            { t: 'הובלת המהלך מקצה לקצה. משלב הקונספט, דרך גיוס המשפיענים והטאלנטים הנכונים, ועד להפקה של סרטונים שמביאים טראפיק ומכירות.' },
          ],
        },
      ],
      workSamples: [
        {
          href: 'https://vt.tiktok.com/ZSxfNmUk5/',
          image: 'img/work-1.jpg',
          brandHandle: '@buyme.co.il',
          tag: 'BUYME ישראל',
          title: 'תייגו את הבסטית, ויראליות לחגיגת יום הולדת',
          desc: 'קונספט, הפקה ועריכה לסרטון יום הולדת שעבד בדיוק כמו שתוכנן. מנגנון תיוג חברתי שהפך את העוקבים למפיצי המותג.',
        },
        {
          href: 'https://vt.tiktok.com/ZSxfFM1g6/',
          image: 'img/work-2.jpg',
          brandHandle: '@kfcisrael',
          stat: '1M+ צפיות אורגני',
          tag: 'KFC ישראל',
          title: 'טרנד הרולאפס, מיליון צפיות אורגני',
          desc: 'רכבנו על הטרנד החם במדינה ויצרנו סרטון ויראלי מאפס. רעיון, צילום ועריכה שהביאו לחשיפה אורגנית אדירה ושיח מטורף סביב המותג.',
        },
      ],
    },
  } as ExperienceSection,

  hot: {
    id: 'ed-hot',
    label: 'ניסיון',
    tag: 'HOT · Social Media',
    pre: 'מנהל ',
    gold: 'סושיאל',
    sub: 'HOT · 2022',
    item: {
      role: 'מנהל סושיאל',
      company: 'HOT',
      date: ['2022'],
      body: [
        { t: 'ניהול נכסי סושיאל של HOT, HOT Mobile ו-NEXTtv. כתיבה, עריכה, הפקה. שיתופי פעולה עם טאלנטים, Young VOD, עמודים עם מאות אלפי עוקבים.' },
      ],
    },
  } as ExperienceSection,

  kan: {
    id: 'ed-kan',
    label: 'ניסיון',
    tag: 'כאן 11 · דיגיטל',
    pre: 'תחקירן ',
    gold: 'כאן 11',
    sub: 'תחקירן ומתמחה · מחלקת הדיגיטל · 2022',
    item: {
      role: 'תחקירן ומתמחה · מחלקת הדיגיטל',
      company: 'כאן 11 · פודקאסט "עוד יום"',
      date: ['2022'],
      body: [
        { t: 'מחקר ותחקיר תוכן: ביצוע תחקירים מעמיקים עבור פודקאסט האקטואליה המוביל "עוד יום" בהגשת עקיבא נוביק ודניאל אופיר.' },
      ],
    },
    miniCards: [
      {
        role: 'שירות צבאי',
        company: 'חיל התותחנים',
        date: '2014–2017',
        body: 'רס"פ פלוגה, מצטיין 2015, אחריות על 85 חיילים',
      },
      {
        role: 'קצין ביטחון',
        company: 'רשת ישראכרט',
        date: '2018–2019',
        body: 'ניהול משמרות, קבלת החלטות בזמן אמת',
      },
    ],
  } as ExperienceSection,

  skills: {
    id: 'ed-skills',
    label: 'כישורים',
    pre: 'הכלים ',
    gold: 'שלי',
    sub: 'מה אני מביא לכל פרויקט',
    cards: [
      {
        icon: 'ai',
        name: 'AI Tools',
        desc: 'משלב כלי Generative AI כחלק בלתי נפרד מתהליכי הקריאייטיב וההפקה (Claude, ChatGPT, Midjourney).',
      },
      {
        icon: 'strategy',
        name: 'אסטרטגיית סושיאל',
        desc: 'בניית אסטרטגיה מ-0, הגדרת שפה ויזואלית וקולית, תכנון לטווח ארוך.',
      },
      {
        icon: 'video',
        name: 'תוכן ווידאו',
        desc: 'Adobe Premiere Pro ברמה גבוהה, עריכה ויצירה למובייל ולדסקטופ.',
      },
      {
        icon: 'growth',
        name: 'צמיחה אורגנית',
        desc: 'בניית קהילות אמיתיות. ללא מודעות, מהיסוד ועד מאות אלפים.',
      },
      {
        icon: 'collab',
        name: 'שיתופי פעולה',
        desc: 'עבודה עם מותגים, יוצרי תוכן, ניהול ממשקים מורכבים.',
      },
      {
        icon: 'writing',
        name: 'כתיבה שיווקית',
        desc: 'קפשנים, סקריפטים, שפת מותג. עברית ואנגלית ברמה גבוהה מאוד.',
      },
      {
        icon: 'format',
        name: 'פיתוח פורמטים',
        desc: 'חשיבה על פורמטים חדשים, בניית שפה ייחודית מהקונספט ועד הביצוע.',
      },
    ] as Skill[],
  },

  education: {
    id: 'ed-edu',
    label: 'השכלה',
    pre: 'תואר ',
    gold: 'ראשון',
    item: {
      role: 'B.A בתקשורת · התמחות בתוכן ויצירה',
      company: 'המכללה למנהל',
      date: ['2022'],
      body: [{ t: 'תואר ראשון עם דגש על תוכן דיגיטלי, שיווק ומדיה.' }],
    },
  } as ExperienceSection,

  contact: {
    id: 'ed-contact',
    label: 'צור קשר',
    pre: 'Say ',
    gold: 'hi.',
    sub: 'אימייל, טלפון, מה שנוח לך. עונה באותו יום.',
    links: [
      { text: EMAIL, arrow: 'אימייל →', href: `mailto:${EMAIL}` },
      { text: PHONE_LABEL, arrow: 'טלפון →', href: PHONE_HREF },
      { text: '@itay_shechter_', arrow: 'אינסטגרם →', href: 'https://www.instagram.com/itay_shechter_/' },
    ] as ContactLink[],
  },

  contactModal: {
    title: 'דברו איתי',
    sub: 'בחרו את הערוץ הנוח לכם. עונה באותו יום.',
    closeLabel: 'סגור',
    options: [
      { kind: 'email', label: 'אימייל', value: EMAIL, href: `mailto:${EMAIL}` },
      { kind: 'whatsapp', label: 'וואטסאפ', value: PHONE_LABEL, href: WHATSAPP_HREF },
    ] as ContactOption[],
  },

  footer: '© 2026 · Itay Shechter · Social Media Lead',
} as const;

export type Content = typeof content;
