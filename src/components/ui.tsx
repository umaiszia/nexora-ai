import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { Link } from 'wouter';
import { useSettings } from '@/lib/settings';

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

export function Logo({ light = false }: { light?: boolean }) {
  const { settings } = useSettings();
  return (
    <Link href="/" className="focus-ring inline-flex items-center gap-2.5" data-testid="link-logo">
      <span className={cx('grid h-7 w-7 place-items-center rounded-[8px] text-sm font-bold', light ? 'bg-[#f8f5ed] text-[#28283d]' : 'bg-brand text-[#f8f5ed]')}>
        {settings.brand.charAt(0)}
      </span>
      <span className={cx('text-[15px] font-bold tracking-[.22em]', light ? 'text-[#f8f5ed]' : 'text-[#27263d]')}>{settings.brand}</span>
    </Link>
  );
}

type BtnProps = { children: React.ReactNode; variant?: 'primary' | 'outline' | 'ghost' | 'dark'; onClick?: () => void; className?: string; type?: 'button' | 'submit'; testId?: string };
export function Button({ children, variant = 'primary', onClick, className = '', type = 'button', testId }: BtnProps) {
  return (
    <button type={type} onClick={onClick} data-testid={testId}
      className={cx('focus-ring inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-[.98]',
        variant === 'primary' && 'bg-brand text-[#f8f5ed] hover:bg-brand-dark',
        variant === 'dark' && 'bg-[#28283d] text-[#f8f5ed] hover:bg-[#171725]',
        variant === 'outline' && 'border border-[#d3d0df] text-[#28283d] hover:border-brand hover:text-brand',
        variant === 'ghost' && 'text-[#59586b] hover:bg-[#ebe9f1] hover:text-[#28283d]', className)}>
      {children}
    </button>
  );
}

export function PageHeading({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-brand">{eyebrow}</p>
        <h1 className="mt-3 text-4xl tracking-[-.06em] md:text-5xl">{title}</h1>
        {copy && <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#777482]">{copy}</p>}
      </div>
      {action}
    </div>
  );
}

/** Fades + slides children in the first time they scroll into view. */
export function Reveal({ children, delay = 0, y = 32, className }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }} transition={{ duration: 0.75, delay, ease: [0.2, 0.8, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}

/** Counts up from 0 when scrolled into view. */
export function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: v => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={cx('relative h-6 w-11 shrink-0 rounded-full transition', on ? 'bg-brand' : 'bg-[#d4d1df]')}>
      <span className={cx('absolute top-1 h-4 w-4 rounded-full bg-white transition-all', on ? 'left-6' : 'left-1')} />
    </button>
  );
}
