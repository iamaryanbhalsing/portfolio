# Portfolio — Complete Developer Guide

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router + Turbopack) | 16.2.10 |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS v4 | 4.x |
| Components | shadcn/ui (v4) | 4.13.0 |
| Animation | anime.js v4 | 4.5.0 |
| Smooth Scroll | Lenis | 1.3.25 |
| 3D | React Three Fiber + Drei + Three.js | 9.6.1 / 10.7.7 / 0.185.1 |
| Blog | next-mdx-remote + gray-matter | 6.0.0 / 4.0.3 |
| Syntax Highlighting | Shiki | 4.3.1 |
| Icons | lucide-react + custom SVGs | 1.24.0 |
| Fonts | Inter (Google Fonts via next/font) | — |

---

## Project Structure

```
portfolio/
├── content/blog/              # MDX blog posts
│   ├── blockchain-voting-guide.mdx
│   ├── building-hand-gesture-mouse.mdx
│   └── deploying-nlp-chatbot.mdx
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker (stale-while-revalidate)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout — providers, SEO, JSON-LD
│   │   ├── page.tsx           # Main page — all sections
│   │   ├── globals.css        # All CSS — themes, terminal, utilities
│   │   ├── sitemap.ts         # Dynamic sitemap
│   │   ├── robots.ts          # Robots.txt
│   │   └── blog/
│   │       ├── page.tsx       # Blog listing
│   │       └── [slug]/page.tsx # Dynamic MDX blog post
│   ├── components/
│   │   ├── about/             # About section
│   │   ├── background/        # AnimatedMesh SVG background
│   │   ├── blog/              # Blog components
│   │   ├── certifications/    # Certifications grid
│   │   ├── contact/           # Contact links grid
│   │   ├── cursor/            # Custom cursor system (3 files)
│   │   ├── github/            # GitHub heatmap + stats
│   │   ├── hero/              # Hero section
│   │   ├── layout/            # Navbar + Footer
│   │   ├── projects/          # Project cards + filtering
│   │   ├── skills/            # Skills grid + SkillBar + SkillRadar
│   │   ├── terminal/          # Terminal easter egg (5 files)
│   │   ├── testimonials/      # Testimonial carousel
│   │   ├── timeline/          # Experience/Education timeline
│   │   └── ui/                # Shared UI components (15 files)
│   ├── config/                # Data config files
│   │   ├── certifications.ts
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   ├── testimonials.ts
│   │   └── timeline.ts
│   ├── hooks/                 # Custom React hooks
│   │   ├── useActiveSection.ts
│   │   ├── useIsTouchDevice.ts
│   │   ├── useKeyboardShortcut.ts
│   │   ├── useMousePosition.ts
│   │   ├── usePrefersReducedMotion.ts
│   │   └── useTerminal.ts
│   ├── lib/
│   │   ├── anime.ts           # All animation functions
│   │   ├── utils.ts           # cn() helper
│   │   └── commands/          # (empty — commands are in useTerminal.ts)
│   └── styles/
│       └── cursor.css         # Cursor dot/ring/trail/spotlight styles
```

---

## Layout & Provider Hierarchy

`layout.tsx` wraps the app in this exact order:

```
<html>
  <head> JSON-LD schema </head>
  <body>
    <ServiceWorkerRegistration />  ← production-only SW register
    <ThemeProvider>                 ← ThemeContext + data-theme attr
      <LenisProvider>              ← smooth scroll
        <CursorProvider>           ← React Context for cursor state
          <CustomCursor />         ← dual-layer cursor + trail
          <CursorSpotlight />      ← radial gradient overlay
          {children}               ← page content
        </CursorProvider>
      </LenisProvider>
    </ThemeProvider>
  </body>
</html>
```

---

## Theming System

### How It Works

1. `@theme inline` block in `globals.css` maps Tailwind color utilities to CSS custom properties: `--color-background: var(--background)`, `--color-brand: var(--brand)`, etc.
2. `:root` defines the default dark theme values.
3. `[data-theme="ocean"]` and `[data-theme="forest"]` override those same variables.
4. `ThemeProvider` sets `data-theme` attribute on `<html>` and persists to `localStorage`.

### 3 Themes

| Theme | Primary Hue | Brand Color | Surface |
|---|---|---|---|
| Dark (default) | 200 (cyan) | `#38BDF8` (sky-400) | `#0B1120` |
| Ocean | 220 (blue) | `#60A5FA` (blue-400) | `#0A1628` |
| Forest | 155 (green) | `#4ADE80` (green-400) | `#081510` |

### Adding a New Theme

1. Add `[data-theme="newtheme"]` block in `globals.css` with all CSS variable overrides.
2. Add theme option to `ThemeProvider`'s `themes` array.
3. Update `ThemeToggle` in Navbar to include the new option.

### Key Rule

Brand/surface colors must be defined in `:root` (NOT hardcoded in `@theme inline`) so `[data-theme]` selectors can override them at runtime. `@theme inline` only references `var(--brand)`, `var(--surface)`, etc.

---

## Animation System

### File: `src/lib/anime.ts`

All animations use anime.js v4 named exports (`animate`, `stagger`). Every function checks `prefers-reduced-motion` first.

| Function | What It Animates | Selector |
|---|---|---|
| `animateHeroIntro(containerId)` | Hero badge, title, subtitle, CTA, meta | `.hero-badge`, `.hero-title`, etc. |
| `animateProjectCards()` | Project cards fade-in + slide up | `[data-project-card]` |
| `animateSkills(selector)` | Skill category cards | `[data-skill-badge]` |
| `animateTimeline()` | Timeline nodes + lines | `[data-timeline-node]`, `[data-timeline-line]` |
| `animateSectionEntry(sectionId)` | Generic section reveal | `#${sectionId} > *` |
| `animateCounter(el, target, duration)` | Count-up for stat numbers | Direct element reference |
| `animateTyping(el, text, speed)` | Typewriter text | Direct element reference |
| `animateFilterChange(containerId)` | Project filter transition | `#${containerId} [data-project-card]` |

### Adding a New Animation

1. Create function in `src/lib/anime.ts` with `prefersReducedMotion()` guard.
2. Add `data-*` attribute to target elements.
3. Call the function from a `useEffect` with IntersectionObserver for scroll-triggered animations.

---

## Cursor System

### 3 Files

| File | Purpose |
|---|---|
| `CursorProvider.tsx` | React Context providing `useCursorContext()` and `useCursorState()` |
| `CustomCursor.tsx` | Dual-layer cursor: outer dot + inner ring + 6 trailing dots |
| `CursorSpotlight.tsx` | Radial gradient overlay that follows cursor |

### 6 Cursor States

| State | Trigger | Visual |
|---|---|---|
| `default` | Resting | Small dot + ring |
| `link` | Hovering `<a>` or `[data-cursor="link"]` | Expanded ring, brand color |
| `button` | Hovering button elements | Filled ring, brand-secondary color |
| `text` | Hovering text/input areas | Thin I-beam cursor |
| `project` | Hovering project cards | Spotlight effect, accent color |
| `terminal` | Terminal open | Terminal-themed color |

### Section-Based Color Shifting

`CustomCursor` listens to `data-cursor-section` attribute on sections to shift cursor colors per section.

---

## Terminal Easter Egg

### Files

| File | Purpose |
|---|---|
| `Terminal.tsx` | Toggle logic (Ctrl+`), Escape to close |
| `TerminalWindow.tsx` | Chrome (title bar), boot sequence, CRT scanline overlay |
| `TerminalInput.tsx` | Blinking cursor, command history (up/down arrows), Ctrl+L clear |
| `TerminalOutput.tsx` | Color-coded line rendering (input/output/error/system/success/info/ascii) |
| `useTerminal.ts` | Command registry, execution, history management |

### 16 Commands

| Command | Description |
|---|---|
| `help [cmd]` | List commands or show command details |
| `whoami` | Developer info |
| `about` | About the developer |
| `skills` | List technical skills |
| `projects` | Show projects |
| `experience` | Work experience |
| `education` | Education history |
| `contact` | Contact info |
| `certifications` | List certifications |
| `github` | GitHub profile link |
| `joke` | Random dev joke |
| `neofetch` | System info display |
| `banner` | ASCII art banner |
| `clear` | Clear terminal |
| `sudo` | Easter egg |

### Adding a New Command

In `src/hooks/useTerminal.ts`, add:

```ts
registerCommand("newcmd", {
  description: "What it does",
  usage: "newcmd [args]",
  handler: (args) => [
    { id: crypto.randomUUID(), type: "output", content: "Result" },
  ],
  aliases: ["nc"],  // optional
});
```

---

## Project Configuration

### File: `src/config/projects.ts`

```ts
type ProjectCategory = "ai" | "security" | "fullstack" | "cloud";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;           // Unsplash URL
  tags: { label: string; icon: string }[];
  highlight: string;
  links: { live?: string; github?: string };
  flagship?: boolean;
  category: ProjectCategory;
}
```

6 projects with category-based filtering in `Projects.tsx`.

### File: `src/config/skills.ts`

4 categories (Languages, Frameworks, Security, Tools) with proficiency percentages derived from GitHub repo analysis.

### File: `src/config/certifications.ts`

4 certifications (IBM, Google, LPI) with optional verification URLs.

### File: `src/config/testimonials.ts`

3 testimonials with name, role, company, text, optional avatar.

### File: `src/config/timeline.ts`

Education + work experience data for Timeline component.

---

## Blog System

### Tech: MDX via `next-mdx-remote`

- Posts live in `content/blog/*.mdx`
- Frontmatter: `title`, `date`, `description`, `tags`
- `/blog` — listing page (reads all `.mdx` files via `fs`)
- `/blog/[slug]` — dynamic route renders MDX content
- Shiki for code syntax highlighting

### Adding a New Blog Post

1. Create `content/blog/my-new-post.mdx`:
```mdx
---
title: "My New Post"
date: "2025-01-15"
description: "What the post is about"
tags: ["react", "nextjs"]
---

Content here...
```

2. It auto-appears on `/blog` — no config changes needed.

---

## CSS Architecture

### `globals.css` Structure

1. **Imports**: tailwindcss, tw-animate-css, shadcn/tailwind.css
2. **`@theme inline`**: Maps Tailwind color utilities → CSS vars (referencing `:root` vars)
3. **`:root`**: Default dark theme variable values
4. **`[data-theme="ocean"]`**: Ocean theme overrides
5. **`[data-theme="forest"]`**: Forest theme overrides
6. **`@layer base`**: Body styles, border defaults
7. **`@layer utilities`**: Custom utility classes (`.font-heading`)
8. **Animations**: `gradientShift`, `neon-border`, `animated-gradient-text`
9. **Terminal CSS**: Inlined directly (was separate file, moved for Turbopack compat)
10. **Components**: `.reveal`, `.glass`, `.project-card`, `.timeline-node-pulse`
11. **`prefers-reduced-motion`**: Disables all animations

### Key CSS Variables (per theme)

All themes define these via CSS custom properties:

```
--background, --foreground, --card, --card-foreground,
--popover, --popover-foreground, --primary, --primary-foreground,
--secondary, --secondary-foreground, --muted, --muted-foreground,
--accent, --accent-foreground, --destructive, --border, --input,
--ring, --radius, --surface, --brand, --brand-soft, --brand-dark,
--brandSecondary, --brandSecondary-dark
```

---

## Hooks Reference

| Hook | Purpose |
|---|---|
| `useActiveSection()` | Returns currently visible section ID (IntersectionObserver) |
| `useIsTouchDevice()` | Returns `true` if touch device (disables custom cursor) |
| `useKeyboardShortcut(key, callback)` | Registers keyboard shortcuts |
| `useMousePosition()` | Returns `{ x, y }` mouse position (RAF-driven) |
| `usePrefersReducedMotion()` | Returns `true` if user prefers reduced motion |
| `useTerminal()` | Terminal state, command execution, history navigation |

---

## PWA Setup

### `public/manifest.json`
- `name`: "Aryan Bhalsing — Portfolio"
- `theme_color`: "#0B1120"
- No icons yet (add 192x192 and 512x512 PNGs)

### `public/sw.js`
- Cache name: `portfolio-v2`
- Strategy: stale-while-revalidate
- Only registers in production mode (dev mode skips)

### ServiceWorkerRegistration.tsx
- Runs only in production (`process.env.NODE_ENV === "production"`)
- Unregisters any stale workers before registering new one
- If user sees refresh loop: DevTools → Application → Service Workers → Unregister → hard refresh

---

## SEO Setup

### `layout.tsx`
- JSON-LD Person schema (sameAs: GitHub, LinkedIn, LeetCode)
- OpenGraph meta (1200x630 image)
- Twitter card (summary_large_image)
- Site URL: `https://aryanbhalsing.dev`

### `sitemap.ts`
- Dynamic sitemap generation from `sitemap.xml`

### `robots.ts`
- Allows all crawlers

### Missing
- `public/og-image.png` — needs to be created for social sharing

---

## Build & Run

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
```

### Known Issues
- `@/` path alias doesn't work in CSS `@import` — inline CSS directly in `globals.css`
- `lucide-react` has no `Github`/`Linkedin` icons — use custom SVGs from `src/components/ui/SocialIcons.tsx`
- shadcn/ui v4 Button doesn't support `asChild` — use `<a>` tags instead
- `@theme inline` values are build-time — theme variables must be in `:root` and `@theme inline` only references `var(--name)`

---

## Deployment Checklist

- [ ] Create `public/og-image.png` (1200x630) for social sharing
- [ ] Create PWA icons (192x192, 512x512) for `manifest.json`
- [ ] Update `SITE_URL` in `layout.tsx` to actual domain
- [ ] Replace placeholder certification URLs in `config/certifications.ts`
- [ ] Test all Unsplash image URLs still work
- [ ] Run `npm run build` and verify no errors
- [ ] Test service worker in production build
- [ ] Verify theme switching works across all 3 themes
