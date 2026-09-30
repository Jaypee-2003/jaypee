# Editing the content

Everything visitors read comes from one file: [`src/data/profile.ts`](src/data/profile.ts). Both the 3D yard and the plain page are built from it, and the yard **lays itself out from it**:

- **A new project** gets its own container stack with its name painted on the steel, a manifest board, a camera stop, a bay code on the road, a lamp post and a photograph. Everything after the project row (the skills gantry, the dispatch office, the quay and cranes) moves further down the lane to make room.
- **A removed project** takes its stack, stop and photograph with it, and the row closes up.
- **Loading-bay modules, skill groups and education entries** work the same way: the gantry, the signal board and the plaque resize to fit.

You never touch the scene code to change what the site says.

## Make a change

1. Edit `src/data/profile.ts`.
2. Check it:

   ```bash
   npm run check
   ```

   Every sign has a fixed size, so the check catches anything that wouldn't fit. It names the exact field and says what to do:

   ```
   ✗ projects[1] (Devanta The Extremely Long Name).title: is 31 characters; the sign fits 18. Shorten it.
   ```

   The same check runs before every build and every deploy, so broken content can't go live.
3. Preview with `npm start` (optional).
4. Commit and push. The deploy builds the site and **renders the photographs of every place for the plain view**, including new projects. There's nothing else to run.

## Add a project

Add an entry to the `PROJECTS` list. Order matters: the first entry is the first stack you pass, and the Projects link goes to it. Only six fields are required:

```ts
{
  id: 'fleetwise',                       // lowercase, letters/numbers/hyphens, unique
  title: 'Fleetwise',                    // painted on the container
  tagline: 'Delivery fleet tracking',
  summary: 'Live vehicle tracking and route planning for a regional courier, with role-based dispatch dashboards.',
  stack: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis'],
  highlights: [
    'Live positions over WebSockets for 200+ vehicles',
    'JWT + RBAC: drivers, dispatchers and admins see only their own tools',
  ],
},
```

Add any of these when you have them:

```ts
  code: 'FLW-05',                        // stencilled on the stack; made from the title if left out
  metrics: [{ value: '200+', label: 'vehicles tracked' }],   // real numbers only
  links: [
    { label: 'Visit live site', href: 'https://fleetwise.app', kind: 'live' },
    { label: 'View source', href: 'https://github.com/…', kind: 'github' },
  ],
  instrument: { kind: 'pipeline', title: 'Dispatch flow', steps: ['Order', 'Assign', 'Route', 'Deliver'], total: '< 2 min' },
```

- **No links:** the manifest's button offers "Request a live demo", which goes to the contact form.
- **No instrument:** the manifest shows the stack and readings without a diagram.

**The four instrument kinds** (the small diagram on the manifest's right-hand side):

| kind | What it draws | Fields |
|---|---|---|
| `checklist` | A list of checks, each marked on | `title`, `items` (1–4), `state` (optional, e.g. `'Built'`; default `On`) |
| `pipeline` | Numbered stages ending in a total | `title`, `steps` (2–5), `total` |
| `keypad` | A row of keys | `title`, `keys` (2–4, short), `display` |
| `reader` | A reading-view caption | `title`, `caption` |

## Remove a project

Delete its entry. Its stack, stop, nav position and photographs go with it. The next deploy also removes the old photographs.

## Limits

These are the sizes the signs are built for. `npm run check` enforces them.

**Projects** (up to 10)

| Field | Limit |
|---|---|
| `title` | 18 characters |
| `tagline` | 44 characters |
| `summary` | 200 characters |
| `highlights` | 1–3 items, 90 characters each |
| `stack` | 1–7 items, 16 characters each, about 90 characters in total |
| `metrics` | up to 3, `value` 6 characters, `label` 26 characters |
| `links` | up to 2, full `https://` addresses |
| `code` | 8 characters |

**Other content**

| What | Where it shows | Limit |
|---|---|---|
| `person.role` | Gate sign, under your name | 48 characters |
| `person.pitch` | Gate sign | 150 characters |
| `person.summary` | Notice board | 280 characters |
| `person.specialties` | Painted on the gate's top container | 1–4, 14 characters each |
| `person.security`, `person.ai` | Notice board columns | 1–4 items, 40 characters each |
| `experience.modules` | One container each in the loading bay | 1–6, 10 characters each |
| `experience.architecture.stores` | One tank each behind the API gantry | 1–2 (more with more modules), 10 characters each |
| `experience.architecture.gateway` | Painted on the gantry beam | 28 characters |
| `experience.work` | Lightbox list | 1–4 items |
| `expertise.ai.practices`, `expertise.security.practices` | Ops tower display, checkpoint board | 1–4 each |
| `expertise.ai.shipped` | "Shipped" table on the ops tower display | up to 3 |
| `siteSecurity` | "This site: inspected" panel | up to 6 |
| `skillGroups` | One signal head each on the gantry | 1–8 groups, 1–9 skills each, 14 characters per skill |
| `education` | Plaque on the dispatch office | 1–3 entries |

If a limit ever feels too tight, it's set in [`scripts/check-content.js`](scripts/check-content.js). Raise it there only after checking the sign in `npm start`. In development the browser console names any sign whose text overflows.

## Photographs for the plain view

The plain view shows a photograph of each place, rendered from the 3D scene by night and by day.

- **Rendering:** the deploy renders them fresh every time, so they always match the content. Nothing to do.
- **Local previews:** a project added since the last render shows as a steel plate until you render it:

  ```bash
  npm run build && npm run stills
  ```

  This needs Chrome installed. It writes to `public/stills/` and deletes photographs of places that no longer exist.
- **Naming:** project photographs are named after the project's `id` (`project-fleetwise.jpg`), so reordering projects never mixes them up.

## Where things are, if you do want to change the scene

| To change | Edit |
|---|---|
| Where things stand, and how the yard grows with content | `src/scene/layout.ts` |
| Camera positions per stop | `src/scene/rig.ts` |
| The places themselves | `src/scene/locations/*.tsx` |
| Signs' layout and typography | `src/content/*.tsx` |
| Scroll length per stop, nav sections | `src/site/stops.ts` |
| Colours and type | `src/styles/theme.ts`, `src/scene/palette.ts`, `src/index.css` |
