import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { defaults, type Settings } from '@/config/content';

const KEY = 'nexora:settings:v1';

/** Deep-merge saved data over defaults. Arrays are replaced whole, so lists stay exactly as edited. */
function merge<T>(base: T, over: unknown): T {
  if (Array.isArray(base)) return (Array.isArray(over) ? over : base) as T;
  if (base && typeof base === 'object') {
    const o = (over && typeof over === 'object' ? over : {}) as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(base as object)) out[k] = merge((base as Record<string, unknown>)[k], o[k]);
    return out as T;
  }
  return (typeof over === typeof base && over !== undefined ? over : base) as T;
}

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return merge(defaults, JSON.parse(raw));
  } catch { /* corrupted or blocked storage → fall back to defaults */ }
  return structuredClone(defaults);
}

/* ── accent colour → the 5 shades the UI uses ── */
const hex2rgb = (h: string): [number, number, number] => {
  const m = /^#?([\da-f]{6})$/i.exec(h.trim());
  const n = parseInt(m ? m[1] : '302cb0', 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a: [number, number, number], b: [number, number, number], t: number) =>
  '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('');

export function applyAccent(hex: string) {
  const c = hex2rgb(hex), white: [number, number, number] = [248, 246, 241], black: [number, number, number] = [10, 10, 30];
  const s = document.documentElement.style;
  s.setProperty('--nx-accent', mix(c, c, 0));
  s.setProperty('--nx-accent-dark', mix(c, black, 0.22));
  s.setProperty('--nx-accent-soft', mix(c, white, 0.83));
  s.setProperty('--nx-accent-tint', mix(c, white, 0.9));
  s.setProperty('--nx-accent-light', mix(c, white, 0.55));
}

type Ctx = {
  settings: Settings;
  update: (fn: (draft: Settings) => void) => void;
  replaceAll: (next: unknown) => void;
  reset: () => void;
  firstName: string;
  initials: string;
};
const SettingsCtx = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);

  useEffect(() => {
    applyAccent(settings.accent);
    try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch { /* storage full / private mode */ }
  }, [settings]);

  const update = useCallback((fn: (d: Settings) => void) => setSettings(prev => { const n = structuredClone(prev); fn(n); return n; }), []);
  const replaceAll = useCallback((next: unknown) => setSettings(merge(defaults, next)), []);
  const reset = useCallback(() => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } setSettings(structuredClone(defaults)); }, []);

  const value = useMemo<Ctx>(() => {
    const name = settings.profile.name.trim() || 'there';
    const parts = name.split(/\s+/);
    return {
      settings, update, replaceAll, reset,
      firstName: parts[0],
      initials: (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2)).toUpperCase(),
    };
  }, [settings, update, replaceAll, reset]);

  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsCtx);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
}
