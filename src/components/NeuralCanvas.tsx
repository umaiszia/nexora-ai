import { useEffect, useRef } from 'react';

/** Animated AI "neural network" — drifting nodes that connect and react to the mouse. */
export function NeuralCanvas({ accent = '#7c7bff' }: { accent?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0;
    const mouse = { x: -9999, y: -9999 };
    type P = { x: number; y: number; vx: number; vy: number; r: number; hue: boolean };
    let pts: P[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(110, Math.max(35, Math.floor((w * h) / 14000)));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.8, hue: Math.random() > 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const link = 130;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (!reduce) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
          if (d < 160 && d > 0) { p.x -= (dx / d) * 0.6; p.y -= (dy / d) * 0.6; }
        }
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < link) {
            ctx.strokeStyle = `rgba(150,160,255,${(1 - d / link) * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        ctx.fillStyle = p.hue ? '#7dd3fc' : accent;
        ctx.shadowColor = p.hue ? '#7dd3fc' : accent; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const move = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const leave = () => { mouse.x = mouse.y = -9999; };
    resize(); draw();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', leave);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', move); window.removeEventListener('mouseleave', leave); };
  }, [accent]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}
