# Component Architecture

This project follows **Atomic Design** to structure Bemtv components. Every
new component must be placed in the correct layer before implementation begins.

---

## Layers

```
Atoms
  ↓ single-purpose, no composition
Molecules
  ↓ compose atoms, single concrete responsibility
Organisms
  ↓ full page sections, self-contained
Templates
  ↓ layout shell, named slots
Pages
     route entry points, compose sections
```

### Atoms — `src/components/atoms/`

Indivisible, single-purpose UI elements. No composition of other components.

**Rules:**
- One component, one visual responsibility.
- No lifecycle complexity beyond initializing their own state.
- Reactive state (`$`) only for own visual state (e.g. label, shadow value).
- CSS is scoped with `css\`\`` — no inline styles.
- No cross-component `proxy()` — atoms do not communicate across the tree.

**Current examples:** `LoadingBar`, `ThemeButton`, `PreviousRouteButton`

```ts
// Atom pattern
const { css, template, $ } = _`MyAtom`({ value: '' });

css`button { ... }`;

template`button[$value]`;
```

---

### Molecules — `src/components/molecules/`

Compose 2+ atoms or add a single layer of interaction logic that a raw atom
cannot contain (e.g. timeout logic, message cycling, element management).

**Rules:**
- Must compose existing atoms — do not re-implement atom-level logic.
- May use `useElManager` for direct DOM references.
- May use `onMount` / `onInit` for setup that requires composition context.
- No fetch, no routing logic.

**Current examples:** `Loading` (message cycling logic + display)

---

### Organisms — `src/components/organisms/`

Full, self-contained page sections. An organism owns its complete visual
section and all sub-components within it.

**Rules:**
- Must be independently understandable — no implicit dependency on sibling organisms.
- Static data or props only — no direct state sharing with other organisms.
- May use `proxy()` to expose an outward-facing API consumed by a template (e.g. `LoadingBarProxy`).
- Complex organisms live in their own folder: `organisms/Header/`, `organisms/Articles/`.
- Each folder has a barrel `i.ts` that imports all sub-files.

**Current examples:** `Header`, `Poster`, `Articles`, `MainFooter`

```
src/components/organisms/
├── Header/
│   ├── Header.ts          # component definition
│   ├── set-dev-message.ts # internal helper (not a component)
│   ├── style.ts           # extracted CSS constants
│   └── i.ts               # barrel: imports all above
└── Poster.ts
```

---

### Templates — `src/components/templates/`

The layout shell. Defines the overall page structure using named slots for
organisms. Contains no business logic and no state beyond layout concerns.

**Rules:**
- Template only — `template` and `css`. No `$` reactive state.
- Receives organism proxies by import, never by prop drilling.
- One template per layout variant.

**Current examples:** `App`, `Main`

```ts
// Template pattern — orchestrates named slots only
template`div[ LoadingBar[] Header[] Main[] MainFooter[] ]`;
```

---

### Pages — `src/components/pages/`

Route entry points. Each page maps to a route and composes the organisms
needed for that view.

**Rules:**
- Use `route({ title: '...' })` to set page metadata.
- Compose organisms by name — no JSX-level logic.
- No CSS — layout is the template's responsibility.

**Current examples:** `Root`, `PageNotFound`

```ts
const { template, route } = _`AboutPage`();
route({ title: 'About — Diogo Neves' });
template`Poster[]`;
```

---

## File Structure

```
src/components/
├── atoms/
│   ├── LoadingBar.ts
│   ├── ThemeButton.ts
│   └── PreviousRouteButton.ts
├── molecules/
│   └── Loading.ts
├── organisms/
│   ├── Header/
│   │   ├── Header.ts
│   │   ├── set-dev-message.ts
│   │   ├── style.ts
│   │   └── i.ts
│   ├── Articles/
│   │   ├── Articles.ts
│   │   ├── articles-transition-animation.ts
│   │   ├── set-theme.ts
│   │   └── i.ts
│   ├── Poster.ts
│   └── MainFooter.ts
├── templates/
│   ├── App.ts
│   └── Main.ts
├── pages/
│   ├── Root.ts
│   └── PageNotFound.ts
└── i.ts   ← imports everything; loaded once in main.ts
```

---

## Barrel Convention (`i.ts`)

Every multi-file organism folder must have an `i.ts` that imports all
sub-files in dependency order. The top-level `src/components/i.ts` imports
every component (atoms → molecules → organisms → templates → pages).

```ts
// src/components/organisms/Header/i.ts
import './style';
import './set-dev-message';
import './Header';
```

---

## Cross-Component Communication

Use `proxy()` only when an organism needs to expose an API to the template
layer (e.g. `LoadingBarProxy` lets the router call `showLoadingBar()`).

- Do **not** use `proxy()` between sibling organisms — extract shared state
  to `src/state-fns/` instead.
- `state-fns/` holds pure reactive state (like `theme.ts`). Any component
  can watch or call it.

---

## AI Rules for Component Creation

### Decision tree — before writing any component

```
I need a new UI component
│
├─ Does a component already do this?
│   └─ YES → reuse it. Pass data through the template slot or state-fns.
│
├─ Is it a single, indivisible UI element (button, indicator, toggle)?
│   └─ YES → Atom in src/components/atoms/
│
├─ Does it compose atoms or add interaction logic on top of them?
│   └─ YES → Molecule in src/components/molecules/
│
├─ Does it represent a full visual section of the page?
│   └─ YES → Organism in src/components/organisms/
│
├─ Does it define the page layout with named slots?
│   └─ YES → Template in src/components/templates/
│
└─ Is it a route entry point?
    └─ YES → Page in src/components/pages/
```

### Never

- Place an organism inside an atom or molecule template.
- Duplicate `template` markup across two components — extract the shared part as a lower-layer component.
- Use inline `style=""` attributes — always use scoped `css\`\``.
- Put fetch or routing logic inside an atom or molecule.
- Use `proxy()` between sibling organisms — use `state-fns/` instead.
- Add a component to a folder without also importing it in that folder's `i.ts`.
- Mix layout concerns (positioning, full-page structure) into an organism — that belongs in a template.

### Always

1. **Identify the layer first** — write the filename path before writing any code.
2. **Check `src/components/` for existing components** before creating a new one.
3. **Scope all styles** with `css\`\`` — never style via global selectors from inside a component.
4. **Extract helpers** (animation logic, DOM manipulations) into a sibling `.ts` file, not inline.
5. **Update `i.ts`** after creating any component.
6. **Keep `template` readable** — if the template exceeds ~20 lines, split into sub-components.

### Warning signs in generated code

```ts
// ⚠ Organism or section inside an atom template
template`div[Header[] Articles[]]`  // in an Atom file

// ⚠ Inline style instead of css``
template`button[style="color:red" ~ Label]`

// ⚠ proxy() between two organisms with no template mediating
// organism A reads organism B's proxy directly

// ⚠ Fetch logic inside a molecule or atom
onMount(async () => { const data = await fetch(...) })

// ⚠ Duplicated template blocks
// Same markup with only text variation — extract an atom
```

---

## Checklist Before Merge

- [ ] Component is in the correct Atomic layer directory
- [ ] Filename added to the appropriate `i.ts` barrel
- [ ] All styles use scoped `css\`\`` — no inline `style=""` attributes
- [ ] No logic from a higher layer leaking into a lower one
- [ ] Complex organisms live in their own folder with an `i.ts`
- [ ] `state-fns/` used for shared reactive state (not `proxy()` between siblings)
- [ ] Template is under ~20 lines or has been split into sub-components
- [ ] No component duplicates the responsibility of an existing one
