import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, ChevronRight, MessageSquare, Sparkles, SlidersHorizontal } from 'lucide-react';
import { useSettings } from '@/lib/settings';
import { iconMap } from '@/lib/icons';
import { Button, PageHeading, cx } from '@/components/ui';
import { openCustomizer } from '@/components/Customizer';

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

/** The "Good morning, Maya" dashboard. Every piece of text/number here comes from settings.dash. */
export function Overview() {
  const [, go] = useLocation();
  const { settings, firstName, update } = useSettings();
  const d = settings.dash;

  const hour = new Date().getHours();
  const auto = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const title = d.greetingMode === 'custom' ? d.greeting.replaceAll('{name}', firstName) : `${auto}, ${firstName}.`;
  const eyebrow = d.dateMode === 'custom' ? d.date : new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const toggleDone = (id: string) => update(s => { const f = s.dash.focus.items.find(x => x.id === id); if (f) f.done = !f.done; });

  const top = (
    <div className={cx('grid gap-4', d.show.command && d.show.focus && 'lg:grid-cols-[1.2fr_.8fr]')}>
      {d.show.command && (
        <motion.div variants={item} className="rounded-2xl p-6 text-[#f8f6f1] md:p-8" style={{ background: d.command.color || 'var(--nx-accent)' }}>
          <div className="flex items-center gap-2 text-xs text-white/75"><Sparkles size={14} />{d.command.label}</div>
          <h2 className="mt-16 max-w-[440px] text-3xl leading-tight tracking-[-.05em]">“{d.command.question}”</h2>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button onClick={() => go('/dashboard/assistant')} className="rounded-full bg-[#f8f6f1] px-4 py-2.5 text-xs font-semibold text-[#28283d] transition hover:scale-105">{d.command.button} <ArrowRight size={14} className="ml-1 inline" /></button>
            <span className="text-[10px] text-white/75">{d.command.footnote}</span>
          </div>
        </motion.div>
      )}
      {d.show.focus && (
        <motion.div variants={item} className="rounded-2xl border border-[#dfdce4] p-6 md:p-8">
          <div className="flex justify-between"><p className="text-sm font-semibold">{d.focus.title}</p><span className="font-mono text-[10px] text-[#8b8993]">{String(d.focus.items.length).padStart(2, '0')} items</span></div>
          <div className="mt-5">
            {d.focus.items.map(x => (
              <div key={x.id} className="flex items-center gap-3 border-t border-[#ebe8ef] py-4 text-sm text-[#656373]">
                <button onClick={() => toggleDone(x.id)} aria-label={x.done ? 'Mark as not done' : 'Mark as done'} className={cx('grid h-5 w-5 shrink-0 place-items-center rounded-full border transition', x.done ? 'border-brand bg-brand text-white' : 'border-[#c9c6d2] hover:border-brand')}>{x.done && <Check size={11} />}</button>
                <button onClick={() => go('/dashboard/projects')} className={cx('flex-1 text-left', x.done && 'line-through opacity-60')}>{x.text}</button>
                <ChevronRight className="text-[#aaa7b2]" size={15} />
              </div>
            ))}
            {!d.focus.items.length && <p className="border-t border-[#ebe8ef] py-4 text-xs text-[#8b8993]">Nothing here yet — add items from Customize.</p>}
          </div>
        </motion.div>
      )}
    </div>
  );

  const stats = d.show.stats && (
    <motion.div variants={item} className="grid gap-4 md:grid-cols-3">
      {d.stats.map(s => { const Icon = iconMap[s.icon] ?? Sparkles; return (
        <div className="rounded-2xl border border-[#dfdce4] p-5 transition hover:-translate-y-1 hover:border-brand" key={s.id}>
          <Icon size={18} className="text-brand" />
          <p className="mt-7 font-mono text-[10px] uppercase tracking-widest text-[#8b8993]">{s.label}</p>
          <p className="mt-2 text-3xl tracking-[-.05em]">{s.value}</p>
          <p className="mt-1 text-xs text-[#777482]">{s.caption}</p>
        </div>); })}
    </motion.div>
  );

  const bottom = (
    <div className={cx('grid gap-10', d.show.threads && d.show.signal && 'lg:grid-cols-[1.1fr_.9fr]')}>
      {d.show.threads && (
        <motion.div variants={item}>
          <div className="mb-4 flex justify-between"><h2 className="text-lg font-semibold">{d.threads.title}</h2><Link href="/dashboard/assistant" className="text-xs font-semibold text-brand">View all <ArrowRight className="inline" size={13} /></Link></div>
          <div className="border-y border-[#dfdce4]">
            {d.threads.items.map(t => (
              <div key={t.id} className="flex items-center gap-4 border-b border-[#ebe8ef] py-4 last:border-0">
                <div className="grid h-9 w-9 shrink-0 place-items-center bg-brand-tint text-brand"><MessageSquare size={15} /></div>
                <div className="min-w-0"><p className="truncate text-sm font-semibold">{t.title}</p><p className="mt-1 text-xs text-[#8b8993]">{t.kind}</p></div>
                <span className="ml-auto hidden font-mono text-[10px] text-[#aaa7b2] sm:block">{t.when}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      {d.show.signal && (
        <motion.div variants={item}>
          <h2 className="mb-4 text-lg font-semibold">{d.signal.title}</h2>
          <div className="rounded-2xl border border-[#dfdce4] p-5">
            <div className="flex items-center gap-2 text-xs font-semibold"><span className="h-2 w-2 animate-pulse rounded-full bg-brand" />{d.signal.tag}</div>
            <p className="mt-5 text-sm leading-6">{d.signal.text}</p>
            <button onClick={() => go('/dashboard/assistant')} className="mt-6 text-xs font-semibold text-brand">{d.signal.cta} <ArrowUpRight className="inline" size={13} /></button>
          </div>
        </motion.div>
      )}
    </div>
  );

  const rows = { top, stats, bottom };
  return (
    <div>
      <PageHeading eyebrow={eyebrow} title={title} copy={d.subtitle} action={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => openCustomizer('dashboard')} testId="button-customize-dashboard"><SlidersHorizontal size={15} /> Customize</Button>
          <Button onClick={() => go('/dashboard/assistant')}><Sparkles size={15} /> {d.askLabel}</Button>
        </div>} />
      <motion.div key={d.rows.join()} variants={{ show: { transition: { staggerChildren: 0.09 } } }} initial="hidden" animate="show" className="space-y-4 [&>*:last-child]:mt-8">
        {d.rows.map(r => <div key={r}>{rows[r]}</div>)}
      </motion.div>
    </div>
  );
}
