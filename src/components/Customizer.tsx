import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Download, Plus, RotateCcw, SlidersHorizontal, Trash2, Upload, X } from 'lucide-react';
import { useLocation } from 'wouter';
import { useSettings } from '@/lib/settings';
import { iconKeys } from '@/lib/icons';
import { cx } from './ui';

type Tab = 'dashboard' | 'profile' | 'landing' | 'advanced';
export const openCustomizer = (tab?: Tab) => window.dispatchEvent(new CustomEvent('nexora:customize', { detail: tab }));

const input = 'mt-1.5 w-full font-normal rounded-md border border-[#d4d1df] bg-white px-3 py-2 text-sm text-[#28283d] outline-none focus:border-brand';
const swatches = ['#302cb0', '#0f766e', '#be185d', '#c2410c', '#1d4ed8', '#7c3aed', '#15803d', '#0f172a'];

function Field({ label, value, onChange, area, type = 'text', hint }: { label: string; value: string | number; onChange: (v: string) => void; area?: boolean; type?: string; hint?: string }) {
  return (
    <label className="block text-xs font-semibold text-[#59586b]">{label}
      {area ? <textarea rows={3} className={input} value={value} onChange={e => onChange(e.target.value)} /> : <input type={type} className={input} value={value} onChange={e => onChange(e.target.value)} />}
      {hint && <span className="mt-1 block text-[10px] font-normal text-[#8b8993]">{hint}</span>}
    </label>
  );
}
function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return <label className="block text-xs font-semibold text-[#59586b]">{label}<select className={input} value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o}>{o}</option>)}</select></label>;
}
function Check({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-[#59586b]"><input type="checkbox" className="h-4 w-4 accent-[var(--nx-accent)]" checked={on} onChange={e => onChange(e.target.checked)} />{label}</label>;
}
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-3 border-b border-[#ebe8ef] pb-6"><h3 className="font-mono text-[10px] uppercase tracking-[.18em] text-brand">{title}</h3>{children}</section>;
}

type FieldDef = { key: string; label: string; type?: 'text' | 'area' | 'select' | 'check' | 'lines'; options?: string[] };
/** Generic add / remove / reorder / edit list. `lines` fields are string[] edited one-per-line. */
function ListEditor<T extends Record<string, unknown>>({ items, fields, make, onChange, title }: { items: T[]; fields: FieldDef[]; make: () => T; onChange: (n: T[]) => void; title: (x: T, i: number) => string }) {
  const patch = (i: number, k: string, v: unknown) => onChange(items.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const move = (i: number, dir: number) => { const n = [...items]; const j = i + dir; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; onChange(n); };
  return (
    <div className="space-y-3">
      {items.map((x, i) => (
        <details key={i} className="rounded-lg border border-[#e4e1e8] bg-[#fbfaf7]">
          <summary className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-xs font-semibold text-[#28283d]"><span className="min-w-0 flex-1 truncate">{title(x, i) || `Item ${i + 1}`}</span>
            <button type="button" aria-label="Move up" onClick={e => { e.preventDefault(); move(i, -1); }} className="text-[#8b8993] hover:text-brand"><ArrowUp size={14} /></button>
            <button type="button" aria-label="Move down" onClick={e => { e.preventDefault(); move(i, 1); }} className="text-[#8b8993] hover:text-brand"><ArrowDown size={14} /></button>
            <button type="button" aria-label="Delete" onClick={e => { e.preventDefault(); onChange(items.filter((_, j) => j !== i)); }} className="text-[#8b8993] hover:text-red-600"><Trash2 size={14} /></button>
          </summary>
          <div className="space-y-3 border-t border-[#e4e1e8] p-3">
            {fields.map(f => f.type === 'select' ? <Select key={f.key} label={f.label} value={String(x[f.key])} options={f.options ?? []} onChange={v => patch(i, f.key, v)} />
              : f.type === 'check' ? <Check key={f.key} label={f.label} on={!!x[f.key]} onChange={v => patch(i, f.key, v)} />
              : f.type === 'lines' ? <Field key={f.key} area label={f.label} hint="One per line" value={(x[f.key] as string[]).join('\n')} onChange={v => patch(i, f.key, v.split('\n'))} />
              : <Field key={f.key} area={f.type === 'area'} label={f.label} value={String(x[f.key] ?? '')} onChange={v => patch(i, f.key, v)} />)}
          </div>
        </details>
      ))}
      <button type="button" onClick={() => onChange([...items, make()])} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#c9c6d2] py-2.5 text-xs font-semibold text-brand hover:bg-brand-tint"><Plus size={14} />Add item</button>
    </div>
  );
}

const uid = () => Math.random().toString(36).slice(2, 8);

export function Customizer() {
  const { settings, update, replaceAll, reset } = useSettings();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [json, setJson] = useState('');
  const [jsonErr, setJsonErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const d = settings.dash, h = settings.hero;
  const hidden = location === '/login' || location === '/signup' || location === '/onboarding';

  useEffect(() => {
    const on = (e: Event) => { setTab(((e as CustomEvent).detail as Tab) || (location.startsWith('/dashboard') ? 'dashboard' : 'landing')); setOpen(true); };
    window.addEventListener('nexora:customize', on);
    return () => window.removeEventListener('nexora:customize', on);
  }, [location]);
  useEffect(() => { if (open && tab === 'advanced') { setJson(JSON.stringify(settings, null, 2)); setJsonErr(''); } }, [open, tab]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);

  if (hidden) return null;

  const applyJson = () => { try { replaceAll(JSON.parse(json)); setJsonErr(''); } catch (e) { setJsonErr('Invalid JSON: ' + (e as Error).message); } };
  const exportJson = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })); a.download = 'nexora-settings.json'; a.click(); URL.revokeObjectURL(a.href); };
  const importFile = (f?: File) => { if (!f) return; f.text().then(t => { try { replaceAll(JSON.parse(t)); setJsonErr(''); } catch { setJsonErr('That file is not valid settings JSON.'); } }); };
  const upload = (f?: File) => { if (!f) return; if (f.size > 2_500_000) { alert('Files over 2.5 MB can’t be saved in the browser. Put the file in /public and paste its path (e.g. /hero.mp4) instead.'); return; } const r = new FileReader(); r.onload = () => update(s => { s.hero.mediaSrc = String(r.result); s.hero.mediaType = f.type.startsWith('video') ? 'video' : 'image'; }); r.readAsDataURL(f); };

  const tabs: [Tab, string][] = [['dashboard', 'Dashboard'], ['profile', 'Profile & theme'], ['landing', 'Landing page'], ['advanced', 'Advanced']];

  return (
    <>
      <button onClick={() => openCustomizer()} aria-label="Customize this site" data-testid="button-customize"
        className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-[#14142b] px-4 py-3 text-xs font-semibold text-white shadow-[0_10px_40px_rgba(0,0,0,.35)] ring-1 ring-white/20 transition hover:scale-105">
        <SlidersHorizontal size={15} /> Customize
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-[70] bg-black/30" />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 260 }}
              className="fixed bottom-0 right-0 top-0 z-[80] flex w-full max-w-[460px] flex-col bg-[#f8f6f1] text-[#28283d] shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#dfdce4] px-5 py-4"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-brand">Live editor</p><h2 className="text-lg font-semibold">Customize</h2></div><button aria-label="Close" onClick={() => setOpen(false)}><X size={20} /></button></div>
              <div className="flex gap-1 overflow-x-auto border-b border-[#dfdce4] px-3 py-2">{tabs.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={cx('whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold', tab === k ? 'bg-brand text-white' : 'text-[#777482] hover:bg-[#ebe9f1]')}>{l}</button>)}</div>

              <div className="flex-1 space-y-6 overflow-y-auto p-5">
                {tab === 'dashboard' && <>
                  <Group title="Greeting">
                    <Select label="Greeting" value={d.greetingMode} options={['auto', 'custom']} onChange={v => update(s => { s.dash.greetingMode = v as 'auto' | 'custom'; })} />
                    {d.greetingMode === 'custom' && <Field label="Custom greeting" hint="Use {name} for the first name" value={d.greeting} onChange={v => update(s => { s.dash.greeting = v; })} />}
                    <Select label="Date line" value={d.dateMode} options={['auto', 'custom']} onChange={v => update(s => { s.dash.dateMode = v as 'auto' | 'custom'; })} />
                    {d.dateMode === 'custom' && <Field label="Custom date text" value={d.date} onChange={v => update(s => { s.dash.date = v; })} />}
                    <Field area label="Subtitle" value={d.subtitle} onChange={v => update(s => { s.dash.subtitle = v; })} />
                    <Field label="Top-right button label" value={d.askLabel} onChange={v => update(s => { s.dash.askLabel = v; })} />
                  </Group>
                  <Group title="Command-center card">
                    <Field label="Label" value={d.command.label} onChange={v => update(s => { s.dash.command.label = v; })} />
                    <Field area label="Question" value={d.command.question} onChange={v => update(s => { s.dash.command.question = v; })} />
                    <Field label="Button" value={d.command.button} onChange={v => update(s => { s.dash.command.button = v; })} />
                    <Field label="Footnote" value={d.command.footnote} onChange={v => update(s => { s.dash.command.footnote = v; })} />
                    <div className="flex items-end gap-3"><label className="text-xs font-semibold text-[#59586b]">Card colour<input type="color" value={d.command.color || settings.accent} onChange={e => update(s => { s.dash.command.color = e.target.value; })} className="mt-1.5 block h-10 w-16 cursor-pointer rounded border border-[#d4d1df] bg-white p-1" /></label><button onClick={() => update(s => { s.dash.command.color = ''; })} className="pb-2 text-xs font-semibold text-brand">Use brand colour</button></div>
                  </Group>
                  <Group title="Focus list">
                    <Field label="Title" value={d.focus.title} onChange={v => update(s => { s.dash.focus.title = v; })} />
                    <ListEditor items={d.focus.items} title={x => x.text} make={() => ({ id: uid(), text: 'New task', done: false })} onChange={n => update(s => { s.dash.focus.items = n; })} fields={[{ key: 'text', label: 'Task' }, { key: 'done', label: 'Completed', type: 'check' }]} />
                  </Group>
                  <Group title="Stat cards">
                    <ListEditor items={d.stats} title={x => `${x.label} · ${x.value}`} make={() => ({ id: uid(), label: 'Metric', value: '0', caption: 'caption', icon: 'chart' as const })} onChange={n => update(s => { s.dash.stats = n; })} fields={[{ key: 'label', label: 'Label' }, { key: 'value', label: 'Value' }, { key: 'caption', label: 'Caption' }, { key: 'icon', label: 'Icon', type: 'select', options: iconKeys }]} />
                  </Group>
                  <Group title="Recent threads">
                    <Field label="Title" value={d.threads.title} onChange={v => update(s => { s.dash.threads.title = v; })} />
                    <ListEditor items={d.threads.items} title={x => x.title} make={() => ({ id: uid(), title: 'New thread', kind: 'Assistant thread', when: 'Just now' })} onChange={n => update(s => { s.dash.threads.items = n; })} fields={[{ key: 'title', label: 'Title' }, { key: 'kind', label: 'Type' }, { key: 'when', label: 'When' }]} />
                  </Group>
                  <Group title="Signal card">
                    <Field label="Heading" value={d.signal.title} onChange={v => update(s => { s.dash.signal.title = v; })} />
                    <Field label="Tag" value={d.signal.tag} onChange={v => update(s => { s.dash.signal.tag = v; })} />
                    <Field area label="Text" value={d.signal.text} onChange={v => update(s => { s.dash.signal.text = v; })} />
                    <Field label="Link label" value={d.signal.cta} onChange={v => update(s => { s.dash.signal.cta = v; })} />
                  </Group>
                  <Group title="Layout">
                    {(['command', 'focus', 'stats', 'threads', 'signal'] as const).map(k => <Check key={k} label={`Show ${k}`} on={d.show[k]} onChange={v => update(s => { s.dash.show[k] = v; })} />)}
                    <p className="pt-2 text-xs font-semibold text-[#59586b]">Row order</p>
                    {d.rows.map((r, i) => <div key={r} className="flex items-center justify-between rounded-md border border-[#e4e1e8] bg-[#fbfaf7] px-3 py-2 text-xs"><span className="capitalize">{r === 'top' ? 'Command + focus' : r === 'stats' ? 'Stat cards' : 'Threads + signal'}</span><span className="flex gap-2"><button aria-label="Up" disabled={i === 0} onClick={() => update(s => { const n = s.dash.rows; [n[i - 1], n[i]] = [n[i], n[i - 1]]; })} className="disabled:opacity-30"><ArrowUp size={14} /></button><button aria-label="Down" disabled={i === d.rows.length - 1} onClick={() => update(s => { const n = s.dash.rows; [n[i + 1], n[i]] = [n[i], n[i + 1]]; })} className="disabled:opacity-30"><ArrowDown size={14} /></button></span></div>)}
                  </Group>
                </>}

                {tab === 'profile' && <>
                  <Group title="Profile">
                    <Field label="Full name" value={settings.profile.name} onChange={v => update(s => { s.profile.name = v; })} />
                    <Field label="Email" value={settings.profile.email} onChange={v => update(s => { s.profile.email = v; })} />
                    <Field label="Role" value={settings.profile.role} onChange={v => update(s => { s.profile.role = v; })} />
                    <Field label="Workspace name" value={settings.profile.workspace} onChange={v => update(s => { s.profile.workspace = v; })} />
                  </Group>
                  <Group title="Brand & colour">
                    <Field label="Brand name" value={settings.brand} onChange={v => update(s => { s.brand = v || 'BRAND'; })} />
                    <div className="flex flex-wrap items-center gap-2">{swatches.map(c => <button key={c} aria-label={c} onClick={() => update(s => { s.accent = c; })} className={cx('h-8 w-8 rounded-full ring-offset-2 transition hover:scale-110', settings.accent === c && 'ring-2 ring-[#28283d]')} style={{ background: c }} />)}<input type="color" aria-label="Custom colour" value={settings.accent} onChange={e => update(s => { s.accent = e.target.value; })} className="h-8 w-10 cursor-pointer rounded border border-[#d4d1df] bg-white p-0.5" /></div>
                    <Field label="Footer text" value={settings.footerNote} onChange={v => update(s => { s.footerNote = v; })} />
                  </Group>
                </>}

                {tab === 'landing' && <>
                  <Group title="Hero banner">
                    <Field label="Eyebrow" value={h.eyebrow} onChange={v => update(s => { s.hero.eyebrow = v; })} />
                    <Field label="Headline — line 1" value={h.line1} onChange={v => update(s => { s.hero.line1 = v; })} />
                    <Field label="Headline — line 2 (shimmer)" value={h.line2} onChange={v => update(s => { s.hero.line2 = v; })} />
                    <Field area label="Sub-text" value={h.sub} onChange={v => update(s => { s.hero.sub = v; })} />
                    <Field label="Primary button" value={h.cta1} onChange={v => update(s => { s.hero.cta1 = v; })} />
                    <Field label="Secondary button" value={h.cta2} onChange={v => update(s => { s.hero.cta2 = v; })} />
                  </Group>
                  <Group title="Hero background">
                    <Select label="Type" value={h.mediaType} options={['network', 'video', 'image']} onChange={v => update(s => { s.hero.mediaType = v as 'network' | 'video' | 'image'; })} />
                    {h.mediaType !== 'network' && <Field label="File path or URL" hint="e.g. /hero.mp4 (file in /public) or https://…" value={h.mediaSrc.startsWith('data:') ? '(uploaded file)' : h.mediaSrc} onChange={v => update(s => { s.hero.mediaSrc = v; })} />}
                    {h.mediaType === 'video' && <Field label="Poster image (optional)" value={h.poster} onChange={v => update(s => { s.hero.poster = v; })} />}
                    <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 text-xs font-semibold text-brand"><Upload size={14} />Upload image / video (≤ 2.5 MB)</button>
                    <input ref={fileRef} type="file" accept="image/*,video/*" hidden onChange={e => upload(e.target.files?.[0])} />
                    <label className="block text-xs font-semibold text-[#59586b]">Dark overlay · {Math.round(h.overlay * 100)}%<input type="range" min={0} max={1} step={0.05} value={h.overlay} onChange={e => update(s => { s.hero.overlay = +e.target.value; })} className="mt-2 w-full accent-[var(--nx-accent)]" /></label>
                  </Group>
                  <Group title="Floating hero cards"><ListEditor items={h.floatingCards} title={x => x.label} make={() => ({ label: 'Label', text: 'Text' })} onChange={n => update(s => { s.hero.floatingCards = n; })} fields={[{ key: 'label', label: 'Label' }, { key: 'text', label: 'Text', type: 'area' }]} /></Group>
                  <Group title="Stats strip"><ListEditor items={settings.stats} title={x => `${x.value}${x.suffix} ${x.label}`} make={() => ({ value: 10, suffix: '+', label: 'label' })} onChange={n => update(s => { s.stats = n.map(x => ({ ...x, value: Number(x.value) || 0 })); })} fields={[{ key: 'value', label: 'Number' }, { key: 'suffix', label: 'Suffix' }, { key: 'label', label: 'Label' }]} /></Group>
                  <Group title="Capabilities"><ListEditor items={settings.features} title={x => x.title} make={() => ({ icon: 'sparkles' as const, title: 'New feature', copy: 'Describe it.' })} onChange={n => update(s => { s.features = n; })} fields={[{ key: 'title', label: 'Title' }, { key: 'copy', label: 'Text', type: 'area' }, { key: 'icon', label: 'Icon', type: 'select', options: iconKeys }]} /></Group>
                  <Group title="“From scattered to decided” cards"><ListEditor items={settings.workflow} title={x => x.title} make={() => ({ title: 'New step', copy: 'Describe it.', href: '/dashboard' })} onChange={n => update(s => { s.workflow = n; })} fields={[{ key: 'title', label: 'Title' }, { key: 'copy', label: 'Text', type: 'area' }, { key: 'href', label: 'Opens page', type: 'select', options: ['/dashboard', '/dashboard/assistant', '/dashboard/projects', '/dashboard/documents', '/dashboard/automations', '/dashboard/insights', '/dashboard/integrations', '/dashboard/settings', '/signup'] }]} /></Group>
                  <Group title="Testimonials"><ListEditor items={settings.testimonials} title={x => x.by} make={() => ({ quote: 'Great product.', by: 'Name · Role' })} onChange={n => update(s => { s.testimonials = n; })} fields={[{ key: 'quote', label: 'Quote', type: 'area' }, { key: 'by', label: 'Attribution' }]} /></Group>
                  <Group title="Pricing"><ListEditor items={settings.pricing} title={x => x.name} make={() => ({ name: 'Plan', desc: 'Description', monthly: '$0', yearly: '$0', perSeat: true, features: ['Feature'] })} onChange={n => update(s => { s.pricing = n; })} fields={[{ key: 'name', label: 'Name' }, { key: 'desc', label: 'Description' }, { key: 'monthly', label: 'Monthly price' }, { key: 'yearly', label: 'Yearly price' }, { key: 'perSeat', label: 'Show “/ seat / mo”', type: 'check' }, { key: 'features', label: 'Features', type: 'lines' }]} /></Group>
                  <Group title="FAQ"><ListEditor items={settings.faqs} title={x => x.q} make={() => ({ q: 'Question?', a: 'Answer.' })} onChange={n => update(s => { s.faqs = n; })} fields={[{ key: 'q', label: 'Question' }, { key: 'a', label: 'Answer', type: 'area' }]} /></Group>
                  <Group title="Integrations marquee"><Field area label="Names" hint="One per line" value={settings.integrations.join('\n')} onChange={v => update(s => { s.integrations = v.split('\n').filter(Boolean); })} /></Group>
                </>}

                {tab === 'advanced' && <div className="space-y-4">
                  <p className="text-xs leading-5 text-[#777482]">Every setting on the site as JSON. Edit anything, then press Apply. Permanent defaults live in <code className="rounded bg-[#ebe9f1] px-1">src/config/content.ts</code>.</p>
                  <textarea spellCheck={false} value={json} onChange={e => setJson(e.target.value)} className="h-72 w-full rounded-md border border-[#d4d1df] bg-white p-3 font-mono text-[11px] leading-5 outline-none focus:border-brand" />
                  {jsonErr && <p className="text-xs text-red-700">{jsonErr}</p>}
                  <div className="flex flex-wrap gap-2">
                    <button onClick={applyJson} className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white">Apply JSON</button>
                    <button onClick={exportJson} className="flex items-center gap-1.5 rounded-full border border-[#d3d0df] px-4 py-2 text-xs font-semibold"><Download size={13} />Export</button>
                    <button onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'application/json'; i.onchange = () => importFile(i.files?.[0]); i.click(); }} className="flex items-center gap-1.5 rounded-full border border-[#d3d0df] px-4 py-2 text-xs font-semibold"><Upload size={13} />Import</button>
                  </div>
                </div>}
              </div>

              <div className="flex items-center justify-between border-t border-[#dfdce4] px-5 py-3 text-[11px] text-[#8b8993]">
                <span>Changes save automatically</span>
                <button onClick={() => { if (confirm('Reset everything back to the defaults in content.ts?')) reset(); }} className="flex items-center gap-1.5 font-semibold text-red-700"><RotateCcw size={12} />Reset all</button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
