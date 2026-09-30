/**
 * ─────────────────────────────────────────────────────────────
 *  NEXORA — EDIT EVERYTHING HERE
 * ─────────────────────────────────────────────────────────────
 *  This file is the single source of truth for every piece of text,
 *  colour, list, image/video and dashboard widget on the site.
 *
 *  Two ways to customise:
 *   1. Edit this file (permanent defaults for everyone).
 *   2. Click the floating "Customize" button on the live site
 *      (saved per-browser in localStorage, overrides these defaults).
 *      "Reset" in the panel brings these defaults back.
 */

export type IconKey =
  | 'database' | 'gauge' | 'zap' | 'brain' | 'target' | 'sparkles'
  | 'users' | 'clock' | 'lightbulb' | 'chart' | 'file' | 'message';

export type MediaType = 'network' | 'video' | 'image';

export const defaults = {
  /** Main brand colour. Every button, highlight and chart follows it. */
  accent: '#302cb0',
  brand: 'NEXORA',
  footerNote: '© 2026 NEXORA · Fictional demo',

  /** Who is "logged in" — used in the dashboard greeting, sidebar and avatar. */
  profile: {
    name: 'Maya Lin',
    email: 'maya@northstar.studio',
    role: 'Head of Product',
    workspace: 'Northstar Studio',
  },

  /* ───────────────────────── LANDING PAGE ───────────────────────── */
  hero: {
    eyebrow: 'THE INTELLIGENCE LAYER FOR MODERN TEAMS',
    line1: 'Turn information',
    line2: 'into action.',
    sub: 'NEXORA gives your team one clear place to think, decide, and move. It finds the signal in scattered knowledge — then helps you act on it.',
    cta1: 'Build your workspace',
    cta2: 'See the workspace',
    /**
     * 'network' → built-in animated AI neural-network background (no files needed)
     * 'video'   → looping background video.  mediaSrc = '/hero.mp4'  (put file in /public)
     * 'image'   → full-bleed image with slow zoom. mediaSrc = '/hero.jpg' or any https URL
     */
    mediaType: 'network' as MediaType,
    mediaSrc: '',
    poster: '',
    /** 0 = no dark overlay, 1 = fully dark. Keep ~0.5 so the text stays readable. */
    overlay: 0.5,
    floatingCards: [
      { label: 'Signal detected', text: 'Enterprise deals are moving 11 days faster.' },
      { label: 'Sources', text: '142 connected · 6 tools' },
      { label: 'Next move', text: 'Draft the launch decision memo →' },
    ],
  },

  stats: [
    { value: 142, suffix: '+', label: 'sources connected per team' },
    { value: 68, suffix: '%', label: 'of work with a clear next action' },
    { value: 11, suffix: ' days', label: 'faster through evaluation' },
    { value: 24, suffix: '.8%', label: 'lift in decision velocity' },
  ],

  features: [
    { icon: 'brain' as IconKey, title: 'Understand the whole picture', copy: 'Ask across your workspace and get an answer with the context, source, and nuance intact.' },
    { icon: 'target' as IconKey, title: 'Make the next move obvious', copy: 'Turn conversations into decisions, owners, and momentum without another status meeting.' },
    { icon: 'zap' as IconKey, title: 'Keep the thread alive', copy: 'Automations watch the signals that matter and bring the right thing back at the right time.' },
    { icon: 'database' as IconKey, title: 'Give good work a home', copy: 'A living layer over your knowledge — structured enough to use, flexible enough to think in.' },
  ],

  /** The three "From scattered to decided" cards. href = where the card opens. */
  workflow: [
    { title: 'Bring it together', copy: 'Connect the docs, calls, notes, and customer signals your team already relies on.', href: '/dashboard' },
    { title: 'Ask better questions', copy: 'NEXORA sees relationships across sources, so your answers arrive with receipts.', href: '/dashboard/assistant' },
    { title: 'Move with confidence', copy: 'Create the brief, trigger the follow-up, or share the decision while it is still warm.', href: '/dashboard/automations' },
  ],

  integrations: ['slack', 'notion', 'drive', 'linear', 'gong', 'hubspot', 'figma', 'github'],

  testimonials: [
    { quote: 'We stopped asking where something lives. NEXORA gives us the thread, the context, and the next move.', by: 'Mara Lin · COO, Fieldwork' },
    { quote: 'It feels less like adding a tool and more like finally giving our team a shared memory.', by: 'Jonas Reed · Founder, Arcwell' },
  ],

  pricing: [
    { name: 'Starter', desc: 'For a focused team getting organized.', monthly: '$20', yearly: '$16', perSeat: true, features: ['3 collaborators', '500 sources', 'Core assistant'] },
    { name: 'Team', desc: 'For teams turning insight into momentum.', monthly: '$40', yearly: '$32', perSeat: true, features: ['Unlimited collaborators', 'Unlimited sources', 'Automations + insights'] },
    { name: 'Scale', desc: 'For operating systems with more surface area.', monthly: 'Let’s talk', yearly: 'Let’s talk', perSeat: false, features: ['SAML SSO', 'Advanced permissions', 'Dedicated support'] },
  ],

  faqs: [
    { q: 'What is NEXORA, exactly?', a: 'NEXORA is the intelligence layer for your team. It connects the places your knowledge already lives, understands the context between them, and turns that understanding into clear next actions.' },
    { q: 'Will NEXORA replace our existing tools?', a: 'No. NEXORA works across your existing workspace. Think of it as the connective tissue between your docs, conversations, and decisions.' },
    { q: 'How does it handle sensitive information?', a: 'Your workspace is private by default. NEXORA uses permissions-aware retrieval, encryption in transit and at rest, and never trains shared models on your content.' },
    { q: 'Can I try it with my team?', a: 'Yes. Start with a 14-day workspace trial. No credit card, no sales call, and your workspace is yours to keep.' },
  ],

  /* ─────────────────── DASHBOARD OVERVIEW ("Good morning, Maya") ─────────────────── */
  dash: {
    /** 'auto' = Good morning / afternoon / evening by the clock. 'custom' = use `greeting`. */
    greetingMode: 'auto' as 'auto' | 'custom',
    /** {name} is replaced with the first name from the profile. */
    greeting: 'Welcome back, {name}.',
    dateMode: 'auto' as 'auto' | 'custom',
    date: 'Wednesday · October 16',
    subtitle: 'Here’s the signal from your workspace — and the few things worth your attention today.',
    askLabel: 'Ask NEXORA',

    /** Order of the three rows. Any order of 'top' | 'stats' | 'bottom'. */
    rows: ['top', 'stats', 'bottom'] as ('top' | 'stats' | 'bottom')[],
    show: { command: true, focus: true, stats: true, threads: true, signal: true },

    command: {
      label: 'Your command center',
      question: 'What should I know before the launch review?',
      button: 'Explore answer',
      footnote: '142 sources connected',
      /** Leave empty to use the accent colour, or set any hex like '#0f766e'. */
      color: '',
    },
    focus: {
      title: 'Focus this week',
      items: [
        { id: 'f1', text: 'Launch narrative review', done: true },
        { id: 'f2', text: 'Send research synthesis', done: true },
        { id: 'f3', text: 'Approve sales brief', done: false },
        { id: 'f4', text: 'Ops sync', done: false },
      ],
    },
    stats: [
      { id: 's1', label: 'Knowledge', value: '142', caption: 'sources connected', icon: 'database' as IconKey },
      { id: 's2', label: 'Momentum', value: '68%', caption: 'work with a next action', icon: 'gauge' as IconKey },
      { id: 's3', label: 'Automations', value: '07', caption: 'running quietly', icon: 'zap' as IconKey },
    ],
    threads: {
      title: 'Recent threads',
      items: [
        { id: 't1', title: 'Pricing review · what changed', kind: 'Assistant thread', when: '12 min ago' },
        { id: 't2', title: 'Weekly customer signal', kind: 'Document synthesis', when: 'Yesterday' },
        { id: 't3', title: 'Launch readiness check-in', kind: 'Project update', when: 'Oct 14' },
      ],
    },
    signal: {
      title: 'Signal from your workspace',
      tag: 'A useful pattern',
      text: 'Customer language around “time to value” is appearing in 4 teams this week. Worth pulling into the next narrative review.',
      cta: 'Ask NEXORA why',
    },
  },

  /** Saved toggle states on the Settings page. */
  prefs: { 'Weekly signal digest': true, 'Project activity': false, 'Mentions and assignments': false, 'Two-factor authentication': true, 'Session timeout': false, 'Login alerts': false } as Record<string, boolean>,
};

export type Settings = typeof defaults;
