import { useState } from 'react';
import { Check, SlidersHorizontal } from 'lucide-react';
import { useSettings } from '@/lib/settings';
import { Button, PageHeading, Toggle, cx } from '@/components/ui';
import { openCustomizer } from '@/components/Customizer';

const tabs = ['Profile', 'Workspace', 'Notifications', 'Security', 'Billing'];
const toggles: Record<string, string[]> = {
  Notifications: ['Weekly signal digest', 'Project activity', 'Mentions and assignments'],
  Security: ['Two-factor authentication', 'Session timeout', 'Login alerts'],
};
const field = 'mt-2 block w-full border border-[#d4d1df] bg-transparent px-4 py-3 text-sm font-normal outline-none focus:border-brand';

export function SettingsPage() {
  const { settings, update } = useSettings();
  const p = settings.profile;
  const [tab, setTab] = useState('Profile');
  const [draft, setDraft] = useState({ ...p });
  const [saved, setSaved] = useState(false);
  const set = (k: keyof typeof draft) => (e: React.ChangeEvent<HTMLInputElement>) => { setSaved(false); setDraft(d => ({ ...d, [k]: e.target.value })); };
  const save = () => { update(s => { s.profile = { ...draft, name: draft.name.trim() || s.profile.name }; }); setSaved(true); };

  return (
    <div>
      <PageHeading eyebrow="Workspace controls" title="Settings" copy="Make NEXORA fit the way your team works."
        action={<Button variant="outline" onClick={() => openCustomizer('profile')}><SlidersHorizontal size={15} /> Customize everything</Button>} />
      <div className="grid gap-10 lg:grid-cols-[190px_1fr]">
        <nav className="flex gap-2 overflow-auto lg:block lg:space-y-1">
          {tabs.map(x => <button key={x} onClick={() => setTab(x)} className={cx('whitespace-nowrap px-3 py-2 text-left text-sm lg:block lg:w-full', tab === x ? 'bg-brand-tint font-semibold text-brand' : 'text-[#777482] hover:bg-[#efedf2]')}>{x}</button>)}
        </nav>
        <div className="max-w-[680px]">
          {tab === 'Billing' ? (
            <div className="border border-[#dfdce4] p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#8b8993]">Current plan</p>
              <div className="mt-5 flex items-center justify-between gap-4"><div><h2 className="text-2xl">Team</h2><p className="mt-1 text-sm text-[#777482]">$40 / seat / month · renews Nov 16</p></div><Button variant="outline">Manage plan</Button></div>
            </div>
          ) : toggles[tab] ? (
            <div className="space-y-6">
              <div><h2 className="text-lg font-semibold">{tab}</h2><p className="mt-1 text-sm text-[#777482]">Your {tab.toLowerCase()} preferences — saved automatically.</p></div>
              {toggles[tab].map(name => (
                <div key={name} className="flex items-center justify-between border-b border-[#ebe8ef] pb-5 text-sm font-semibold">
                  {name}<Toggle label={name} on={!!settings.prefs[name]} onChange={v => update(s => { s.prefs[name] = v; })} />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              <div><h2 className="text-lg font-semibold">{tab}</h2><p className="mt-1 text-sm text-[#777482]">These update the name shown across the dashboard.</p></div>
              <div className="space-y-5">
                {(tab === 'Profile' ? [['Display name', 'name'], ['Work email', 'email'], ['Role', 'role']] : [['Workspace name', 'workspace']] as const).map(([label, key]) => (
                  <label key={key} className="block text-sm font-semibold">{label}<input className={field} value={draft[key as keyof typeof draft]} onChange={set(key as keyof typeof draft)} /></label>
                ))}
                {tab === 'Workspace' && <label className="block text-sm font-semibold">Brand colour<input type="color" value={settings.accent} onChange={e => update(s => { s.accent = e.target.value; })} className="mt-2 block h-11 w-24 cursor-pointer border border-[#d4d1df] bg-transparent p-1" /></label>}
              </div>
              <Button onClick={save}>{saved ? <><Check size={15} /> Saved</> : 'Save changes'}</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
