import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, ChevronDown, Play, Sparkles } from 'lucide-react';
import { useSettings } from '@/lib/settings';
import { NeuralCanvas } from './NeuralCanvas';

const word = { hidden: { opacity: 0, y: 40, rotateX: -50 }, show: { opacity: 1, y: 0, rotateX: 0 } };

function Words({ text, className }: { text: string; className?: string }) {
  return (
    <span aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[.08em] align-bottom [perspective:600px]" aria-hidden>
          <motion.span className={`inline-block ${className ?? ''}`} variants={word} initial="hidden" animate="show"
            transition={{ duration: 0.8, delay: 0.25 + i * 0.09, ease: [0.2, 0.8, 0.2, 1] }}>{w}&nbsp;</motion.span>
        </span>
      ))}
    </span>
  );
}

/** Full-viewport hero banner: video / image / animated AI network background. */
export function Hero() {
  const { settings } = useSettings();
  const h = settings.hero;
  const ref = useRef<HTMLElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const type = h.mediaType === 'video' && (!h.mediaSrc || videoFailed) ? 'network' : h.mediaType === 'image' && !h.mediaSrc ? 'network' : h.mediaType;

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#080818] text-white">
      {/* ── background media ── */}
      <motion.div style={{ scale: mediaScale }} className="absolute inset-0 -z-30">
        {type === 'video' && (
          <video className="h-full w-full object-cover" src={h.mediaSrc} poster={h.poster || undefined} autoPlay muted loop playsInline onError={() => setVideoFailed(true)} />
        )}
        {type === 'image' && <img className="animate-kenburns h-full w-full object-cover" src={h.mediaSrc} alt="" />}
        {type === 'network' && <NeuralCanvas accent="#8b8aff" />}
      </motion.div>

      {/* ── overlays: glow, grid, scan line ── */}
      <div className="absolute inset-0 -z-20" style={{ background: `linear-gradient(180deg, rgba(8,8,24,${h.overlay * 0.7}) 0%, rgba(8,8,24,${h.overlay}) 60%, #080818 100%)` }} />
      <div className="animate-blob absolute -left-32 top-10 -z-20 h-[480px] w-[480px] rounded-full bg-brand opacity-40 blur-[120px]" />
      <div className="animate-blob absolute -right-24 bottom-0 -z-20 h-[420px] w-[420px] rounded-full bg-[#06b6d4] opacity-25 blur-[120px] [animation-delay:-6s]" />
      <div className="grid-lines absolute inset-0 -z-20" />
      <div className="animate-scan absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-transparent via-white/[.05] to-transparent" />

      {/* ── content ── */}
      <motion.div style={{ y, opacity: fade }} className="mx-auto grid w-full max-w-[1240px] items-center gap-12 px-6 pb-24 pt-32 lg:grid-cols-[1.25fr_.75fr] lg:px-10">
        <div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
            className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[.2em] text-brand-light backdrop-blur">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7dd3fc] opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#7dd3fc]" /></span>
            {h.eyebrow}
          </motion.div>
          <h1 className="text-balance text-[clamp(3.2rem,7.4vw,7rem)] leading-[.95] tracking-[-.06em]">
            <Words text={h.line1} /><br />
            <Words text={h.line2} className="text-shimmer font-serif italic" />
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }} className="mt-8 max-w-[540px] text-lg leading-8 text-white/70">{h.sub}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.7 }} className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/signup" data-testid="link-hero-start" className="focus-ring group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#14142b] shadow-[0_0_40px_rgba(139,138,255,.45)] transition hover:scale-[1.03]">
              {h.cta1} <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
            <a href="#preview" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10">
              <Play size={14} className="fill-white" /> {h.cta2}
            </a>
          </motion.div>
        </div>

        {/* floating glass cards */}
        <div className="relative hidden h-[420px] lg:block">
          {h.floatingCards.slice(0, 3).map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 1 + i * 0.2, duration: 0.8 }}
              className={['absolute right-0 top-0 w-[290px]', 'absolute left-0 top-[42%] w-[250px]', 'absolute bottom-0 right-6 w-[280px]'][i]}>
              <div className={i === 1 ? 'animate-float-slow' : 'animate-float'} style={{ animationDelay: `${-i * 2}s` }}>
                <div className="rounded-2xl border border-white/15 bg-white/[.07] p-5 shadow-[0_20px_60px_rgba(0,0,0,.4)] backdrop-blur-xl">
                  <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-brand-light"><Sparkles size={12} />{c.label}</div>
                  <p className="text-sm leading-6 text-white/85">{c.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <a href="#preview" aria-label="Scroll down" className="absolute bottom-7 left-1/2 -translate-x-1/2 text-white/60 transition hover:text-white"><ChevronDown className="animate-bounce" size={26} /></a>
    </section>
  );
}
