# NEXORA AI

NEXORA is a premium AI workspace concept with two connected experiences:

- A marketing site at `/`
- An interactive workspace at `/dashboard`

The app is frontend-only and uses demo data. It includes simulated authentication, onboarding, AI chat, projects, documents, automations, insights, integrations, and settings.

## Run in VS Code

1. Extract this zip file.
2. Open the extracted `nexora-ai-vscode` folder in VS Code.
3. Open the integrated terminal.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL shown in the terminal, usually `http://localhost:5173`.

You can also use pnpm:

```bash
pnpm install
pnpm dev
```

## Useful commands

```bash
npm run typecheck
npm run build
npm run preview
```

## Main routes

- `/`
- `/login`
- `/signup`
- `/onboarding`
- `/dashboard`
- `/dashboard/assistant`
- `/dashboard/projects`
- `/dashboard/documents`
- `/dashboard/automations`
- `/dashboard/insights`
- `/dashboard/integrations`
- `/dashboard/settings`

## Customising the site

**1. Live editor (no code).** Click the floating **Customize** button (bottom-right) on any page. Tabs:
- **Dashboard** — greeting (auto by time of day or your own text with `{name}`), date line, subtitle, command-center card (text + colour), focus list, stat cards, recent threads, signal card, show/hide widgets and row order.
- **Profile & theme** — name, email, role, workspace, brand name, accent colour (every button/highlight follows it).
- **Landing page** — hero text, hero background, floating cards, stats, capabilities, the "From scattered to decided" cards (and where each one opens), testimonials, pricing, FAQ, integrations.
- **Advanced** — the whole site as JSON (edit, export, import). **Reset all** restores the defaults.

Changes are saved in the browser (localStorage).

**2. Permanent defaults in code.** Everything lives in `src/config/content.ts`.

### Hero background (image / video)
Put your file in `/public` (e.g. `public/hero.mp4`) and set in `content.ts`:
```ts
hero: { mediaType: 'video', mediaSrc: '/hero.mp4', poster: '/hero-poster.jpg' }   // or
hero: { mediaType: 'image', mediaSrc: '/hero.jpg' }                               // or
hero: { mediaType: 'network' }   // built-in animated AI neural network (default)
```
Tip: use a dark, looping, muted MP4 under ~8 MB (free stock: pexels.com / pixabay.com → search "artificial intelligence", "neural network", "data").

## Project structure
```
src/config/content.ts     all text, colours, lists, dashboard defaults
src/lib/settings.tsx      saved settings + accent-colour engine
src/components/           Hero, NeuralCanvas, Customizer, shared UI
src/pages/Landing.tsx     marketing site
src/pages/Overview.tsx    customisable dashboard home
src/pages/Workspace.tsx   login, onboarding, assistant, projects, documents, automations, insights, integrations
src/pages/Settings.tsx    settings page
```

Requires Node.js 20.19+ or Node.js 22+.