import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Gauge, Menu, Sparkles, X } from 'lucide-react';
import { useRef } from 'react';
import { useSettings } from '@/lib/settings';
import { iconMap } from '@/lib/icons';
import { Counter, Logo, Reveal, cx } from '@/components/ui';
import { Hero } from '@/components/Hero';

const links = [['Capabilities', '#capabilities'], ['How it works', '#workflow'], ['Pricing', '#pricing'], ['FAQ', '#faq']];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const solid = scrolled || open;
  return (
    <header className={cx('fixed inset-x-0 top-0 z-40 transition-all duration-300', solid ? 'border-b border-black/5 bg-[#f8f6f1]/85 shadow-sm backdrop-blur-xl' : 'bg-transparent')}>
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-4 lg:px-10">
        <Logo light={!solid} />
        <nav className={cx('hidden items-center gap-8 text-sm md:flex', solid ? 'text-[#686677]' : 'text-white/75')}>
          {links.map(([l, h]) => <a key={h} href={h} className="transition hover:text-brand-light">{l}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" data-testid="link-login" className={cx('focus-ring hidden px-4 py-3 text-sm font-semibold transition md:inline-flex', solid ? 'text-[#59586b] hover:text-brand' : 'text-white/85 hover:text-white')}>Log in</Link>
          <Link href="/signup" data-testid="link-start-free" className="focus-ring inline-flex items-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-[#f8f5ed] transition hover:bg-brand-dark">Start free <ArrowUpRight size={15} /></Link>
          <button aria-label="Menu" onClick={() => setOpen(!open)} className={cx('ml-1 grid h-10 w-10 place-items-center md:hidden', solid ? 'text-[#28283d]' : 'text-white')}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-black/5 md:hidden">
            <div className="flex flex-col gap-1 px-6 py-4 text-[#28283d]">
              {links.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="py-3 text-base font-medium">{l}</a>)}
              <Link href="/login" className="py-3 text-base font-medium">Log in</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-brand via-[#7dd3fc] to-brand-light" />;
}

function Marquee() {
  const { settings } = useSettings();
  const items = [...settings.integrations, ...settings.integrations];
  return (
    <div className="overflow-hidden border-y border-[#dfdce4] bg-[#f1efe8] py-6 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className="animate-marquee flex w-max gap-16 whitespace-nowrap text-xl font-semibold lowercase text-[#8a8793]">
        {items.map((x, i) => <span key={i} className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-brand" />{x}</span>)}
      </div>
    </div>
  );
}

function ProductPreview() {
  const { settings, firstName, initials } = useSettings();
  const d = settings.dash;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const rotate = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const hour = new Date().getHours();
  const hello = d.greetingMode === 'custom' ? d.greeting.replace('{name}', firstName) : `${hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'}, ${firstName}.`;
  const date = d.dateMode === 'custom' ? d.date : new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return (
    <div ref={ref} className="relative mx-auto max-w-[1100px] px-4 [perspective:1400px]">
      <div className="absolute -inset-10 -z-10 bg-brand-soft/60 blur-3xl" />
      <motion.div style={{ rotateX: rotate, scale }} className="overflow-hidden rounded-[18px] border border-[#d4d1df] bg-[#fbfaf7] shadow-[0_30px_80px_rgba(40,40,61,.2)]">
        <div className="flex items-center justify-between border-b border-[#e4e1e8] bg-[#f4f2ec] px-5 py-3">
          <div className="flex gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" /></div>
          <span className="font-mono text-[10px] tracking-[.14em] text-[#8b8993]">{settings.brand} / WORKSPACE</span><span className="w-8" />
        </div>
        <div className="grid min-h-[460px] md:grid-cols-[180px_1fr]">
          <aside className="hidden border-r border-[#e4e1e8] bg-[#f8f6f1] p-4 md:block">
            <div className="mb-8 flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded bg-brand text-[10px] font-bold text-white">{settings.brand.charAt(0)}</span><span className="text-[10px] font-bold tracking-widest">{settings.brand}</span></div>
            {['Overview', 'Assistant', 'Projects', 'Documents', 'Automations'].map((x, i) => <div key={x} className={cx('mb-1 flex items-center gap-2 rounded-md px-2.5 py-2 text-[11px]', i === 0 ? 'bg-brand-tint font-semibold text-brand' : 'text-[#777481]')}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />{x}</div>)}
          </aside>
          <div className="p-5 md:p-8">
            <div className="mb-7 flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#8a8793]">{date}</p><h3 className="mt-2 text-2xl font-semibold tracking-[-.04em] text-[#28283d]">{hello}</h3></div><div className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand">{initials}</div></div>
            <div className="grid gap-4 md:grid-cols-[1.25fr_1fr]">
              <div className="rounded-xl p-5 text-[#f8f5ed]" style={{ background: d.command.color || 'var(--nx-accent)' }}><div className="mb-12 flex items-center gap-2 text-xs opacity-75"><Sparkles size={14} />{d.command.label}</div><p className="max-w-[250px] text-xl leading-tight tracking-[-.03em]">“{d.command.question}”</p><div className="mt-5 flex items-center justify-between border-t border-white/20 pt-3 text-[10px] opacity-75"><span>{d.command.footnote}</span><ArrowUpRight size={13} /></div></div>
              <div className="rounded-xl border border-[#e4e1e8] p-5"><div className="mb-5 flex justify-between text-xs font-semibold"><span>{d.focus.title}</span><span className="font-mono text-[10px] text-[#8a8793]">{String(d.focus.items.length).padStart(2, '0')} items</span></div>{d.focus.items.slice(0, 4).map(x => <div key={x.id} className="flex items-center gap-2.5 border-t border-[#efedf1] py-3 text-[11px] text-[#656373]"><span className={cx('grid h-4 w-4 place-items-center rounded-full border', x.done ? 'border-brand bg-brand text-white' : 'border-[#c9c6d2]')}>{x.done && <Check size={10} />}</span>{x.text}</div>)}</div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">{d.stats.slice(0, 3).map(s => <div key={s.id} className="rounded-xl border border-[#e4e1e8] p-4"><p className="text-[10px] uppercase tracking-widest text-[#8a8793]">{s.label}</p><p className="mt-3 text-xl font-semibold tracking-tight">{s.value}</p><p className="mt-1 text-[10px] text-[#8a8793]">{s.caption}</p></div>)}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AskDemo() {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const full = 'Enterprise opportunities are moving 11 days faster through evaluation. The strongest signal is the new security overview — three accounts referenced it unprompted.';
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setN(v => (v >= full.length ? (clearInterval(t), v) : v + 2)), 28);
    return () => clearInterval(t);
  }, [inView]);
  return (
    <div className="rounded-2xl border border-white/15 bg-white/[.04] p-5 backdrop-blur md:p-7">
      <div className="mb-8 flex items-center gap-2 text-xs text-brand-light"><span className="h-2 w-2 animate-[pulse-soft_2s_ease-in-out_infinite] rounded-full bg-brand-light" />NEXORA is thinking across 142 sources</div>
      <p className="text-xl leading-8">“What changed in our enterprise pipeline after the pricing update?”</p>
      <div className="mt-8 border-t border-white/15 pt-6">
        <p ref={ref} className={cx('min-h-[112px] text-sm leading-7 text-[#c9c6d0]', n < full.length && 'caret')}>{full.slice(0, n)}</p>
        <div className={cx('mt-5 flex flex-wrap items-center gap-3 text-[11px] text-[#8f8b99] transition-opacity duration-700', n >= full.length ? 'opacity-100' : 'opacity-0')}><span className="rounded-full border border-white/15 px-3 py-1">Source · Gong call</span><span className="rounded-full border border-white/15 px-3 py-1">Source · Pricing brief</span></div>
      </div>
    </div>
  );
}

export function Landing() {
  const { settings } = useSettings();
  const [openFaq, setOpenFaq] = useState(0);
  const [yearly, setYearly] = useState(false);
  const { features, workflow, testimonials, pricing, faqs, stats } = settings;
  const bars = [38, 48, 42, 67, 61, 76, 70, 91, 84, 98, 89, 100];

  return (
    <div className="noise overflow-hidden bg-[#f8f6f1] text-[#28283d]">
      <ProgressBar />
      <Nav />
      <main>
        <Hero />

        {/* stats strip */}
        <section className="relative z-10 -mt-px bg-[#080818] px-6 pb-20 pt-4 text-white">
          <div className="mx-auto grid max-w-[1160px] gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="text-5xl tracking-[-.05em]"><Counter to={s.value} suffix={s.suffix} /></p>
                <p className="mt-2 text-sm text-white/55">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <Marquee />

        <section id="preview" className="scroll-mt-20 py-28 md:py-36"><ProductPreview /></section>

        <section id="capabilities" className="scroll-mt-16 border-y border-[#dfdce4] bg-[#f1efe8] px-6 py-28">
          <div className="mx-auto max-w-[1160px]"><div className="grid gap-12 lg:grid-cols-[.8fr_1.4fr]">
            <Reveal><p className="font-mono text-[11px] uppercase tracking-[.2em] text-brand">A better default</p><h2 className="mt-5 max-w-[400px] text-5xl leading-[.98] tracking-[-.06em]">Less searching.<br /><span className="font-serif italic">More deciding.</span></h2></Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((f, i) => { const Icon = iconMap[f.icon] ?? Sparkles; return (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="group h-full rounded-2xl border border-[#ddd9e3] bg-[#f8f6f1] p-7 transition duration-300 hover:-translate-y-1.5 hover:border-brand hover:shadow-[0_20px_50px_rgba(48,44,176,.12)]">
                    <span className="font-mono text-[10px] text-brand">{String(i + 1).padStart(2, '0')}</span>
                    <div className="my-8 grid h-12 w-12 place-items-center rounded-xl bg-brand-tint text-brand transition group-hover:scale-110 group-hover:bg-brand group-hover:text-white"><Icon size={22} strokeWidth={1.5} /></div>
                    <h3 className="text-lg font-semibold">{f.title}</h3><p className="mt-3 text-sm leading-6 text-[#777482]">{f.copy}</p>
                  </div>
                </Reveal>); })}
            </div>
          </div></div>
        </section>

        <section id="workflow" className="scroll-mt-16 px-6 py-32">
          <div className="mx-auto max-w-[1160px]">
            <Reveal className="mb-16 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div><p className="font-mono text-[11px] uppercase tracking-[.2em] text-brand">The NEXORA loop</p><h2 className="mt-4 text-5xl tracking-[-.06em]">From scattered to <span className="font-serif italic text-brand">decided.</span></h2></div>
              <p className="max-w-[290px] text-sm leading-6 text-[#777482]">A quieter workflow for the part of work that usually gets lost between tools.</p>
            </Reveal>
            <div className="grid gap-4 lg:grid-cols-3">
              {workflow.map((w, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <Link href={w.href} className="group focus-ring relative flex min-h-[290px] flex-col justify-between overflow-hidden rounded-2xl border border-[#ddd9e3] p-7 transition duration-300 hover:-translate-y-1.5 hover:border-brand">
                    <span className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-t from-brand-tint to-transparent transition duration-500 group-hover:translate-y-0" />
                    <div className="flex items-start justify-between"><span className="font-mono text-xs text-brand">{String(i + 1).padStart(2, '0')}</span><ArrowUpRight className="text-[#a7a4b2] transition group-hover:rotate-12 group-hover:text-brand" size={19} /></div>
                    <div><h3 className="text-2xl tracking-[-.03em]">{w.title}</h3><p className="mt-3 max-w-[290px] text-sm leading-6 text-[#777482]">{w.copy}</p></div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#0d0d20] px-6 py-28 text-[#f8f6f1]">
          <div className="animate-blob absolute -right-20 top-0 h-96 w-96 rounded-full bg-brand opacity-30 blur-[110px]" />
          <div className="relative mx-auto max-w-[1160px]"><div className="grid items-center gap-16 lg:grid-cols-[1fr_1.05fr]">
            <Reveal><p className="font-mono text-[11px] uppercase tracking-[.2em] text-brand-light">Ask the room</p><h2 className="mt-5 text-5xl leading-[.98] tracking-[-.06em]">The answer is<br /><span className="font-serif italic text-brand-light">already in there.</span></h2><p className="mt-6 max-w-[400px] text-sm leading-7 text-[#b9b6c2]">NEXORA reads the full thread — not just the last message. Ask in plain language, get a useful answer, and see precisely where it came from.</p><Link href="/dashboard/assistant" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold hover:text-brand-light">Open the assistant <ArrowRight size={16} /></Link></Reveal>
            <Reveal delay={0.15}><AskDemo /></Reveal>
          </div></div>
        </section>

        <section className="border-b border-[#dfdce4] bg-[#f1efe8] px-6 py-28">
          <div className="mx-auto max-w-[1160px]">
            <Reveal className="flex flex-wrap items-end justify-between gap-8"><div><p className="font-mono text-[11px] uppercase tracking-[.2em] text-brand">Your work, in motion</p><h2 className="mt-4 text-5xl tracking-[-.06em]">Make the invisible<br /><span className="font-serif italic">measurable.</span></h2></div><Link href="/dashboard/insights" className="inline-flex items-center gap-2 text-sm font-semibold text-brand">Explore insights <ArrowUpRight size={16} /></Link></Reveal>
            <div className="mt-16 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
              <Reveal><div className="h-full rounded-2xl border border-[#d9d5df] bg-[#f8f6f1] p-6"><div className="flex justify-between text-xs"><span className="font-semibold">Decision velocity</span><span className="font-mono text-brand">+24.8%</span></div>
                <div className="mt-12 flex h-40 items-end gap-2 border-b border-[#ddd9e3] pl-2">{bars.map((n, i) => <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${n}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }} className="group relative flex-1 rounded-t bg-brand-soft transition hover:bg-brand"><span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 font-mono text-[9px] text-brand group-hover:block">{n}</span></motion.div>)}</div>
                <div className="mt-3 flex justify-between font-mono text-[9px] text-[#9996a1]">{['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP'].map(m => <span key={m}>{m}</span>)}</div></div></Reveal>
              <Reveal delay={0.1}><div className="h-full rounded-2xl bg-brand p-6 text-[#f8f6f1]"><Gauge size={21} className="text-brand-light" /><p className="mt-16 text-5xl tracking-[-.06em]"><Counter to={68} /><span className="font-serif text-3xl italic">%</span></p><p className="mt-2 text-sm text-white/75">of your team's work has a clear next action.</p><div className="mt-6 h-1 overflow-hidden rounded bg-white/20"><motion.div initial={{ width: 0 }} whileInView={{ width: '68%' }} viewport={{ once: true }} transition={{ duration: 1.4, ease: 'easeOut' }} className="h-full bg-brand-light" /></div></div></Reveal>
            </div>
          </div>
        </section>

        <section className="px-6 py-28"><div className="mx-auto max-w-[1160px]">
          <div className="grid gap-10 border-t border-[#ddd9e3] pt-14 md:grid-cols-2">
            {testimonials.map((t, i) => <Reveal key={i} delay={i * 0.12}><blockquote className="max-w-[480px] text-2xl leading-9 tracking-[-.03em]">“{t.quote}”<footer className="mt-6 font-mono text-[10px] uppercase tracking-widest text-[#8d8a98]">{t.by}</footer></blockquote></Reveal>)}
          </div>
        </div></section>

        <section id="pricing" className="scroll-mt-16 bg-[#28283d] px-6 py-28 text-[#f8f6f1]"><div className="mx-auto max-w-[1160px]">
          <Reveal className="flex flex-wrap items-end justify-between gap-8"><div><p className="font-mono text-[11px] uppercase tracking-[.2em] text-brand-light">Simple by design</p><h2 className="mt-4 text-5xl tracking-[-.06em]">A clear place<br /><span className="font-serif italic text-brand-light">to start.</span></h2></div>
            <div className="flex items-center gap-2 rounded-full border border-white/15 p-1 text-xs">{[false, true].map(y => <button key={String(y)} onClick={() => setYearly(y)} className={cx('rounded-full px-4 py-2 transition', yearly === y ? 'bg-[#f8f6f1] text-[#28283d]' : 'text-[#b9b6c2]')}>{y ? 'Yearly · save 20%' : 'Monthly'}</button>)}</div></Reveal>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {pricing.map((p, i) => { const hi = i === 1; return (
              <Reveal key={i} delay={i * 0.1}><div className={cx('h-full rounded-2xl p-7 transition duration-300 hover:-translate-y-1.5', hi ? 'bg-[#f8f6f1] text-[#28283d] shadow-[0_0_60px_rgba(139,138,255,.35)]' : 'border border-white/15')}>
                <div className="flex items-center justify-between"><h3 className="text-xl">{p.name}</h3>{hi && <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-semibold text-brand">MOST USED</span>}</div>
                <p className={cx('mt-3 min-h-12 text-sm', hi ? 'text-[#777482]' : 'text-[#b9b6c2]')}>{p.desc}</p>
                <p className="mt-8 text-4xl tracking-[-.05em]">{yearly ? p.yearly : p.monthly}{p.perSeat && <span className="text-sm text-[#9794a0]"> / seat / mo</span>}</p>
                <Link href="/signup" className={cx('mt-8 flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition hover:scale-[1.02]', hi ? 'bg-brand text-white' : 'bg-[#f8f6f1] text-[#28283d]')}>Start with {p.name}</Link>
                <div className="mt-8 space-y-3 border-t border-current/15 pt-6 text-sm">{p.features.map(f => <div className="flex items-center gap-2" key={f}><Check size={14} className={hi ? 'text-brand' : 'text-brand-light'} />{f}</div>)}</div>
              </div></Reveal>); })}
          </div>
        </div></section>

        <section id="faq" className="scroll-mt-16 px-6 py-28"><div className="mx-auto grid max-w-[960px] gap-14 md:grid-cols-[.8fr_1.2fr]">
          <Reveal><p className="font-mono text-[11px] uppercase tracking-[.2em] text-brand">Questions, answered</p><h2 className="mt-4 text-5xl tracking-[-.06em]">No fine<br /><span className="font-serif italic">print energy.</span></h2></Reveal>
          <div>{faqs.map((f, i) => (
            <div className="border-t border-[#ddd9e3]" key={i}>
              <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i} className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold" data-testid={`button-faq-${i}`}>{f.q}<ChevronDown size={18} className={cx('shrink-0 transition', openFaq === i && 'rotate-180 text-brand')} /></button>
              <AnimatePresence initial={false}>{openFaq === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="max-w-[600px] pb-6 text-sm leading-7 text-[#777482]">{f.a}</p></motion.div>}</AnimatePresence>
            </div>))}</div>
        </div></section>

        <section className="px-6 pb-28"><Reveal><div className="relative mx-auto flex max-w-[1160px] flex-col items-start justify-between gap-8 overflow-hidden rounded-3xl bg-brand-soft p-8 md:flex-row md:items-end md:p-12">
          <div className="animate-blob absolute -right-10 -top-20 h-72 w-72 rounded-full bg-brand opacity-20 blur-3xl" />
          <div className="relative"><p className="font-mono text-[11px] uppercase tracking-[.2em] text-brand">The next move is yours</p><h2 className="mt-5 max-w-[650px] text-5xl leading-[.95] tracking-[-.07em]">Make your team's<br /><span className="font-serif italic text-brand">good thinking count.</span></h2></div>
          <Link href="/signup" className="relative inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-4 text-sm font-semibold text-[#f8f6f1] transition hover:scale-105">Build your workspace <ArrowUpRight size={16} /></Link>
        </div></Reveal></section>
      </main>
      <footer className="border-t border-[#ddd9e3] px-6 py-10"><div className="mx-auto flex max-w-[1160px] flex-col justify-between gap-6 md:flex-row"><Logo /><div className="flex flex-wrap gap-6 text-xs text-[#777482]"><a href="#capabilities">Capabilities</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a><Link href="/login">Log in</Link><span>{settings.footerNote}</span></div></div></footer>
    </div>
  );
}
