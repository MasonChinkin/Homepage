# Phase 0 — Cleanup & dead-load removal: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Delete every external blocking CSS/font request from the site, replace FontAwesome usage with 8 hand-rolled inline SVG components, move the starfield from runtime random generation to a static committed string, and fix three small bugs found during the audit. Zero functional changes.

**Architecture:** Pure subtractive change set. New `src/components/ui/icons/` module exports React SVG components. `contactConstants.ts` schema flips from `icon: string` to `Icon: ComponentType`. HTML template loses 4 external resource requests. Starfield runtime generator becomes a one-time script that emits a committed `.generated.ts` file.

**Tech Stack:** React 19, TypeScript, Emotion, Vitest + RTL, Bun.

**Spec:** `docs/superpowers/specs/2026-05-12-stack-diet-design.md` Phase 0.

---

## File map

**Create:**

- `src/components/ui/icons/Github.tsx`
- `src/components/ui/icons/LinkedIn.tsx`
- `src/components/ui/icons/Mail.tsx`
- `src/components/ui/icons/ArrowLeft.tsx`
- `src/components/ui/icons/LongArrowLeft.tsx`
- `src/components/ui/icons/Moon.tsx`
- `src/components/ui/icons/Sun.tsx`
- `src/components/ui/icons/ChartBar.tsx`
- `src/components/ui/icons/index.ts` (barrel re-export)
- `src/components/ui/icons/icons.test.tsx` (one test file for the lot)
- `scripts/gen-stars.ts` (one-time generator)
- `src/styles/starsData.generated.ts` (committed output)
- `src/index-html.test.ts` (regression test against `public/index.base.html`)

**Modify:**

- `public/index.base.html` (remove 4 external resources + 3 dns-prefetch entries)
- `src/components/header/contactConstants.ts` (schema change)
- `src/components/header/DesktopContact.tsx` (use Icon component)
- `src/components/header/MobileContact.tsx` (use Icon component)
- `src/components/d3/legacy/Header.tsx` (FA → SVG)
- `src/components/d3/layout/D3Layout.tsx` (FA → SVG; font inherit; drop className from vizConfig; fix className typing)
- `src/components/d3/legacy/components/reddit-visualization/components/Visualization.tsx` (FA → SVG)
- `src/components/d3/legacy/styles/legacyStyles.tsx` (drop the `.fa-chart-bar` CSS rule; replace with class on the new icon)
- `src/components/Profile.tsx` (drop dead `key={location.pathname}` from each Route)
- `src/styles/GlobalStyles.tsx` (body font-family → system stack)
- `src/styles/backgroundStyles.ts` (use committed generated data; drop runtime generator)
- `webpack.prod.ts` (drop dead `react-css-transition-replace` entry in splitChunks)

---

## Task 1: Inline SVG icon components

Single test file covering all 8 icons. Each icon is a tiny component returning an SVG with `role="img"` and `aria-label`.

**Files:**

- Create: `src/components/ui/icons/Github.tsx`, `LinkedIn.tsx`, `Mail.tsx`, `ArrowLeft.tsx`, `LongArrowLeft.tsx`, `Moon.tsx`, `Sun.tsx`, `ChartBar.tsx`, `index.ts`
- Test: `src/components/ui/icons/icons.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/icons/icons.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import {
  Github,
  LinkedIn,
  Mail,
  ArrowLeft,
  LongArrowLeft,
  Moon,
  Sun,
  ChartBar,
} from './index'

const icons = [
  { name: 'Github', Icon: Github, label: 'GitHub' },
  { name: 'LinkedIn', Icon: LinkedIn, label: 'LinkedIn' },
  { name: 'Mail', Icon: Mail, label: 'Email' },
  { name: 'ArrowLeft', Icon: ArrowLeft, label: 'Back' },
  { name: 'LongArrowLeft', Icon: LongArrowLeft, label: 'Back' },
  { name: 'Moon', Icon: Moon, label: 'Dark mode' },
  { name: 'Sun', Icon: Sun, label: 'Light mode' },
  { name: 'ChartBar', Icon: ChartBar, label: 'Bar chart' },
] as const

describe('icons', () => {
  icons.forEach(({ name, Icon, label }) => {
    it(`renders ${name} with accessible label`, () => {
      const { getByRole } = render(<Icon aria-label={label} />)
      const svg = getByRole('img', { name: label })
      expect(svg.tagName.toLowerCase()).toBe('svg')
    })
  })

  it('accepts className and inline styles', () => {
    const { getByRole } = render(
      <Github aria-label="gh" className="custom" style={{ color: 'red' }} />
    )
    const svg = getByRole('img', { name: 'gh' })
    expect(svg).toHaveClass('custom')
    expect(svg).toHaveStyle({ color: 'red' })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test -- src/components/ui/icons/icons.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Create the icon components**

Each icon follows the same shape. SVG path data sourced from FontAwesome 5.7 free-tier (matching what's currently rendered).

Create `src/components/ui/icons/Github.tsx`:

```tsx
import type { SVGProps } from 'react'

const Github = (props: SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 496 512"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
  </svg>
)

export default Github
```

Create `src/components/ui/icons/LinkedIn.tsx`:

```tsx
import type { SVGProps } from 'react'

const LinkedIn = (props: SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 448 512"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
  </svg>
)

export default LinkedIn
```

Create `src/components/ui/icons/Mail.tsx`:

```tsx
import type { SVGProps } from 'react'

const Mail = (props: SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 512 512"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z" />
  </svg>
)

export default Mail
```

Create `src/components/ui/icons/ArrowLeft.tsx`:

```tsx
import type { SVGProps } from 'react'

const ArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 448 512"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z" />
  </svg>
)

export default ArrowLeft
```

Create `src/components/ui/icons/LongArrowLeft.tsx`:

```tsx
import type { SVGProps } from 'react'

const LongArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 448 512"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.568 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
  </svg>
)

export default LongArrowLeft
```

Create `src/components/ui/icons/Moon.tsx`:

```tsx
import type { SVGProps } from 'react'

const Moon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 512 512"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z" />
  </svg>
)

export default Moon
```

Create `src/components/ui/icons/Sun.tsx`:

```tsx
import type { SVGProps } from 'react'

const Sun = (props: SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 512 512"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z" />
  </svg>
)

export default Sun
```

Create `src/components/ui/icons/ChartBar.tsx`:

```tsx
import type { SVGProps } from 'react'

const ChartBar = (props: SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 512 512"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M396.8 352h22.4c6.4 0 12.8-6.4 12.8-12.8V108.8c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v230.4c0 6.4 6.4 12.8 12.8 12.8zm-192 0h22.4c6.4 0 12.8-6.4 12.8-12.8V140.8c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v198.4c0 6.4 6.4 12.8 12.8 12.8zm96 0h22.4c6.4 0 12.8-6.4 12.8-12.8V204.8c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v134.4c0 6.4 6.4 12.8 12.8 12.8zM496 400H48V80c0-8.8-7.2-16-16-16H16C7.2 64 0 71.2 0 80v336c0 17.7 14.3 32 32 32h464c8.8 0 16-7.2 16-16v-16c0-8.8-7.2-16-16-16zm-387.2-48h22.4c6.4 0 12.8-6.4 12.8-12.8v-70.4c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v70.4c0 6.4 6.4 12.8 12.8 12.8z" />
  </svg>
)

export default ChartBar
```

Create `src/components/ui/icons/index.ts`:

```ts
export { default as Github } from './Github'
export { default as LinkedIn } from './LinkedIn'
export { default as Mail } from './Mail'
export { default as ArrowLeft } from './ArrowLeft'
export { default as LongArrowLeft } from './LongArrowLeft'
export { default as Moon } from './Moon'
export { default as Sun } from './Sun'
export { default as ChartBar } from './ChartBar'
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test -- src/components/ui/icons/icons.test.tsx`
Expected: PASS — 9 tests (8 icons + className test).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/icons/
git commit -m "Add inline SVG icon components for FA replacement"
```

---

## Task 2: Swap FontAwesome `<i>` tags for SVG components

Touches `contactConstants.ts` (schema change), DesktopContact, MobileContact, legacy Header, D3Layout, reddit Visualization, plus the legacyStyles CSS rule. The fa-chart-bar selector gets removed; the new icon sizes via inline style.

**Files:**

- Modify: `src/components/header/contactConstants.ts`
- Modify: `src/components/header/DesktopContact.tsx`
- Modify: `src/components/header/MobileContact.tsx`
- Modify: `src/components/d3/legacy/Header.tsx`
- Modify: `src/components/d3/layout/D3Layout.tsx`
- Modify: `src/components/d3/legacy/components/reddit-visualization/components/Visualization.tsx`
- Modify: `src/components/d3/legacy/styles/legacyStyles.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/header/contactConstants.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { socialLinks } from './contactConstants'

describe('socialLinks', () => {
  it('exposes an Icon component for each link', () => {
    expect(socialLinks).toHaveLength(3)
    socialLinks.forEach((link) => {
      expect(typeof link.Icon).toBe('function')
      const { container } = render(<link.Icon aria-label={link.label} />)
      expect(container.querySelector('svg')).not.toBeNull()
    })
  })

  it('no longer exposes the legacy `icon` string field', () => {
    socialLinks.forEach((link) => {
      expect((link as unknown as { icon?: string }).icon).toBeUndefined()
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test -- src/components/header/contactConstants.test.tsx`
Expected: FAIL — `link.Icon` is undefined.

- [ ] **Step 3: Update `contactConstants.ts`**

Replace `src/components/header/contactConstants.ts`:

```ts
import type { ComponentType, SVGProps } from 'react'
import { Github, LinkedIn, Mail } from 'src/components/ui/icons'

export const email = 'mason.chinkin@gmail.com'
export const subject = 'Hi Mason'
export const body = "I would like to hire you and pay you lots o' money!"
export const mailTo = `mailto:${email}?subject=${subject}&body=${body}`

type SocialLink = {
  href: string
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

export const socialLinks: SocialLink[] = [
  {
    href: 'https://www.linkedin.com/in/mason-chinkin/',
    Icon: LinkedIn,
    label: 'LinkedIn',
  },
  {
    href: 'https://github.com/MasonChinkin',
    Icon: Github,
    label: 'Github',
  },
  {
    href: mailTo,
    Icon: Mail,
    label: 'Email',
  },
]
```

- [ ] **Step 4: Update `DesktopContact.tsx`**

Replace the content of `src/components/header/DesktopContact.tsx`:

```tsx
import { socialLinks } from './contactConstants'
import { desktopSocialLinks } from './headerStyles'

const DesktopContact = () => (
  <section css={desktopSocialLinks}>
    {socialLinks.map(({ href, Icon, label }) => (
      <a key={label} target="_blank" rel="noopener noreferrer" href={href}>
        <Icon aria-label={label} /> <span>{label}</span>
      </a>
    ))}
  </section>
)

export default DesktopContact
```

- [ ] **Step 5: Update `MobileContact.tsx`**

In `src/components/header/MobileContact.tsx`, change the map at line 63:

```tsx
{
  socialLinks.map(({ href, Icon, label }) => (
    <Button key={label} variant="outline-primary">
      <a target="_blank" rel="noopener noreferrer" href={href}>
        <Icon aria-label={label} /> <span>{label}</span>
      </a>
    </Button>
  ))
}
```

- [ ] **Step 6: Update legacy `Header.tsx`**

Replace `src/components/d3/legacy/Header.tsx`:

```tsx
import { useNavigate } from 'react-router-dom'
import { LongArrowLeft } from 'src/components/ui/icons'

type HeaderProps = { title: string }

const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate()

  return (
    <header>
      <h1>{title}</h1>
      <button
        css={{ cursor: 'pointer' }}
        onClick={() => navigate('/d3')}
        type="button"
      >
        <LongArrowLeft aria-label="Back" /> Back
      </button>
    </header>
  )
}

export default Header
```

- [ ] **Step 7: Update `D3Layout.tsx` icon usage**

In `src/components/d3/layout/D3Layout.tsx`:

Add to imports:

```tsx
import { ArrowLeft, Moon, Sun } from 'src/components/ui/icons'
```

Replace the back-button icon usage (line 148):

```tsx
<ArrowLeft aria-label="Back" /> Back
```

Replace the moon/sun icon usage in `ThemeToggle` (around line 218–224):

```tsx
{
  mode === 'dark' ? (
    <Moon aria-label="Dark mode" style={{ fontSize: '12px', color: '#333' }} />
  ) : (
    <Sun
      aria-label="Light mode"
      style={{ fontSize: '12px', color: '#FDB813' }}
    />
  )
}
```

- [ ] **Step 8: Update reddit `Visualization.tsx`**

Replace `src/components/d3/legacy/components/reddit-visualization/components/Visualization.tsx`:

```tsx
import { ChartBar } from 'src/components/ui/icons'
import bubbleChart from 'src/static/images/bubble-chart.svg'
import Tooltip from './Tooltip'

const Visualization = () => {
  return (
    <section className="visualization-container">
      <div className="visualization-options">
        <button id="bar-button" type="button">
          <ChartBar
            aria-label="Bar chart"
            className="bar-chart-icon"
            style={{ fontSize: 28 }}
          />
        </button>
        <button id="bubble-button" type="button">
          <img
            className="bubble-button-icon"
            src={bubbleChart}
            alt="bubble chart icon"
          />
        </button>
        <button id="scatter-button" type="button">
          <img
            src="https://img.icons8.com/metro/26/000000/scatter-plot.png"
            alt="scatter plot icon"
          />
        </button>
      </div>
      <div id="visualization" />
      <Tooltip />
    </section>
  )
}

export default Visualization
```

- [ ] **Step 9: Update `legacyStyles.tsx` icon CSS rule**

In `src/components/d3/legacy/styles/legacyStyles.tsx`, replace the `.fa-chart-bar` block (lines ~222–224):

```ts
.bar-chart-icon {
  font-size: 28px;
}
```

(The inline `style={{ fontSize: 28 }}` in Step 8 makes this rule redundant — but keep it for any other ChartBar usages and for consistency with the existing pattern. Acceptable to delete the rule entirely if grepping shows no other consumer.)

- [ ] **Step 10: Run all tests**

Run: `bun run test`
Expected: All pass. The contactConstants test from Step 1 now passes.

- [ ] **Step 11: Commit**

```bash
git add src/components/header/contactConstants.ts src/components/header/contactConstants.test.tsx src/components/header/DesktopContact.tsx src/components/header/MobileContact.tsx src/components/d3/legacy/Header.tsx src/components/d3/layout/D3Layout.tsx src/components/d3/legacy/components/reddit-visualization/components/Visualization.tsx src/components/d3/legacy/styles/legacyStyles.tsx
git commit -m "Replace FontAwesome icon classes with inline SVG components"
```

---

## Task 3: Remove external CSS/font/dns-prefetch loads + regression test

**Files:**

- Modify: `public/index.base.html`
- Create: `src/index-html.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/index-html.test.ts`:

```ts
import { readFileSync } from 'fs'

describe('public/index.base.html', () => {
  const html = readFileSync('public/index.base.html', 'utf-8')

  it.each([
    'use.fontawesome.com',
    'fonts.googleapis.com',
    'cdnjs.cloudflare.com',
    'Material+Icons',
    'family=Roboto',
  ])('does not reference %s', (needle) => {
    expect(html).not.toContain(needle)
  })

  it('contains exactly one esm.sh dns-prefetch (until Phase 4 removes it)', () => {
    expect(html.match(/dns-prefetch[^>]*esm\.sh/g) || []).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test -- src/index-html.test.ts`
Expected: FAIL on each external resource still being referenced.

- [ ] **Step 3: Update `public/index.base.html`**

Replace `public/index.base.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />

    <!-- DNS Prefetch for external script CDN (removed in Phase 4) -->
    <link rel="dns-prefetch" href="https://esm.sh" />

    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Mason Chinkin's portfolio website" />
    <link rel="apple-touch-icon" href="logo192.png" />

    <title>Mason's Website</title>
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test -- src/index-html.test.ts`
Expected: PASS — 6 assertions.

- [ ] **Step 5: Smoke-test the build**

Run: `bun run build`
Expected: completes successfully, no warnings about missing icon resources.

- [ ] **Step 6: Commit**

```bash
git add public/index.base.html src/index-html.test.ts
git commit -m "Remove external CDN font/icon loads from HTML template"
```

---

## Task 4: System-stack body font

**Files:**

- Modify: `src/styles/GlobalStyles.tsx` (around line 136)
- Modify: `src/components/d3/layout/D3Layout.tsx` (around line 77)

- [ ] **Step 1: Update `GlobalStyles.tsx`**

In `src/styles/GlobalStyles.tsx`, find:

```css
font-family: sans-serif, roboto;
```

Replace with:

```css
font-family:
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;
```

- [ ] **Step 2: Update `D3Layout.tsx`**

In `src/components/d3/layout/D3Layout.tsx`, in the `containerStyle` object, change:

```tsx
fontFamily: "'Roboto', sans-serif",
```

to:

```tsx
fontFamily: 'inherit',
```

- [ ] **Step 3: Run tests + build**

```bash
bun run test && bun run build
```

Expected: All pass.

- [ ] **Step 4: Visual sanity check (manual)**

Run: `bun run start` and visit / and /d3. Text should look like the system font (San Francisco on macOS / Segoe on Windows). Note this in your PR description so reviewers know to do their own visual check.

- [ ] **Step 5: Commit**

```bash
git add src/styles/GlobalStyles.tsx src/components/d3/layout/D3Layout.tsx
git commit -m "Switch site font to system stack"
```

---

## Task 5: Build-time starfield

**Files:**

- Create: `scripts/gen-stars.ts`
- Create: `src/styles/starsData.generated.ts` (committed output)
- Modify: `src/styles/backgroundStyles.ts`

- [ ] **Step 1: Write the generator script**

Create `scripts/gen-stars.ts`:

```ts
import { writeFileSync } from 'fs'

const AREA_X = 6016
const AREA_Y = 3384

const generate = (count: number): string => {
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * AREA_X)
    const y = Math.floor(Math.random() * AREA_Y)
    out.push(`${x}px ${y}px #FFF`)
  }
  return out.join(', ')
}

const shadowsSmall = generate(1000)
const shadowsMedium = generate(400)
const shadowsBig = generate(200)

const content = `// AUTO-GENERATED by scripts/gen-stars.ts — do not edit by hand.
// Regenerate with: bun run scripts/gen-stars.ts
export const shadowsSmall = ${JSON.stringify(shadowsSmall)}
export const shadowsMedium = ${JSON.stringify(shadowsMedium)}
export const shadowsBig = ${JSON.stringify(shadowsBig)}
`

writeFileSync('src/styles/starsData.generated.ts', content)
console.log('Wrote src/styles/starsData.generated.ts')
```

- [ ] **Step 2: Run the generator**

Run: `bun run scripts/gen-stars.ts`
Expected: `src/styles/starsData.generated.ts` exists, exports three large string constants.

- [ ] **Step 3: Update `backgroundStyles.ts`**

Replace `src/styles/backgroundStyles.ts`:

```ts
import { css, keyframes } from '@emotion/react'
import { shadowsSmall, shadowsMedium, shadowsBig } from './starsData.generated'

const areaSizeY = 3384

const animStar = keyframes`
  from { transform: translateY(0px); }
  to { transform: translateY(-${areaSizeY}px); }
`

export const starsSmall = css({
  width: '1px',
  height: '1px',
  background: 'transparent',
  boxShadow: shadowsSmall,
  animation: `${animStar} 150s linear infinite`,
  '&:after': {
    content: '""',
    position: 'absolute',
    top: `${areaSizeY}px`,
    width: '1px',
    height: '1px',
    background: 'transparent',
    boxShadow: shadowsSmall,
  },
})

export const starsMedium = css({
  width: '2px',
  height: '2px',
  background: 'transparent',
  boxShadow: shadowsMedium,
  animation: `${animStar} 300s linear infinite`,
  '&:after': {
    content: '""',
    position: 'absolute',
    top: `${areaSizeY}px`,
    width: '2px',
    height: '2px',
    background: 'transparent',
    boxShadow: shadowsMedium,
  },
})

export const starsBig = css({
  width: '3px',
  height: '3px',
  background: 'transparent',
  boxShadow: shadowsBig,
  animation: `${animStar} 450s linear infinite`,
  '&:after': {
    content: '""',
    position: 'absolute',
    top: `${areaSizeY}px`,
    width: '3px',
    height: '3px',
    background: 'transparent',
    boxShadow: shadowsBig,
  },
})
```

- [ ] **Step 4: Run typecheck + tests + build**

```bash
bun run typecheck && bun run test && bun run build
```

Expected: All pass. Background test (`Background.test.tsx`) still passes.

- [ ] **Step 5: Visual sanity check**

Run: `bun run start`. Stars should be visible and animating exactly as before. (They'll be deterministic across reloads now, which is fine.)

- [ ] **Step 6: Commit**

```bash
git add scripts/gen-stars.ts src/styles/starsData.generated.ts src/styles/backgroundStyles.ts
git commit -m "Move starfield random generation from runtime to build-time"
```

---

## Task 6: Bug fixes (Profile Route key, D3Layout className, dead splitChunks entry)

**Files:**

- Modify: `src/components/Profile.tsx`
- Modify: `src/components/d3/layout/D3Layout.tsx`
- Modify: `webpack.prod.ts`

- [ ] **Step 1: Fix duplicate `key` on routes in `Profile.tsx`**

In `src/components/Profile.tsx`, find:

```tsx
<Routes location={location}>
  {routes.map((route) => (
    <Route key={location.pathname} path={route.path} element={route.element} />
  ))}
</Routes>
```

Replace with:

```tsx
<Routes location={location}>
  {routes.map((route) => (
    <Route key={route.path} path={route.path} element={route.element} />
  ))}
</Routes>
```

- [ ] **Step 2: Drop `className` from `vizConfig` in `D3Layout.tsx`**

In `src/components/d3/layout/D3Layout.tsx`:

Change the `vizConfig` type from:

```tsx
vizConfig?: {
  maxWidth?: string
  height?: string
  showBorder?: boolean
  className?: string
}
```

to:

```tsx
vizConfig?: {
  maxWidth?: string
  height?: string
  showBorder?: boolean
}
```

Change the JSX from:

```tsx
<div
  css={[
    vizContainerInnerStyle,
    vizConfig?.className ? css(vizConfig.className) : undefined,
  ]}
>
  {children}
</div>
```

to:

```tsx
<div css={vizContainerInnerStyle}>{children}</div>
```

- [ ] **Step 3: Verify no callers passed `className`**

Run: `grep -rn "vizConfig" src/`
Expected: no caller passes `className`. (If grep finds one, switch that caller to add the styles via composition instead.)

- [ ] **Step 4: Remove dead splitChunks entry**

In `webpack.prod.ts`, change:

```ts
animation: {
  test: /[\\/]node_modules[\\/](framer-motion|react-css-transition-replace)/,
  name: 'animation',
  priority: 25,
},
```

to:

```ts
animation: {
  test: /[\\/]node_modules[\\/]framer-motion/,
  name: 'animation',
  priority: 25,
},
```

Also remove the unused `radix` cacheGroup (no `@radix-ui/*` is in `package.json`):

Delete the entire block:

```ts
// Radix UI components
radix: {
  test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
  name: 'radix',
  priority: 20,
},
```

- [ ] **Step 5: Run typecheck + tests + build**

```bash
bun run typecheck && bun run test && bun run build
```

Expected: All pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/Profile.tsx src/components/d3/layout/D3Layout.tsx webpack.prod.ts
git commit -m "Fix Profile Route key collision, drop unused vizConfig.className, remove dead splitChunks entries"
```

---

## Task 7: Final verification + PR

- [ ] **Step 1: Full verification gauntlet**

```bash
bun run typecheck
bun run lint
bun run test
bun run build
```

Expected: every command exits 0.

- [ ] **Step 2: Visual smoke test in browser**

Run: `bun run start` and walk through:

- `/` — home loads, header icons (LinkedIn/GitHub/Email) render as SVGs in desktop view
- `/about` — about page loads
- `/d3` — project grid loads
- `/reddit-visualization` — back arrow renders, chart-bar icon button renders
- `/budget-sankey` — back arrow renders
- `/syria-network` — back arrow renders
- `/force-cluster` — back arrow renders
- `/congress-map` — back arrow renders
- `/gdp-growth` — back arrow renders
- `/d3/template` — D3 layout with arrow + moon/sun toggle works; theme toggles correctly
- Stars background animates on `/` (system font visible too)
- DevTools → Network: zero requests to `use.fontawesome.com`, `fonts.googleapis.com`, `cdnjs.cloudflare.com`
- DevTools → Console: no errors

- [ ] **Step 3: Measure new bundle baseline**

```bash
bun run build
for f in dist/vendor.*.js dist/router.*.js dist/animation.*.chunk.js dist/d3.*.chunk.js dist/emotion.*.js dist/main.*.js dist/runtime.*.js; do
  [ -f "$f" ] || continue
  gz=$(gzip -c "$f" | wc -c)
  raw=$(wc -c <"$f")
  printf "%-60s raw=%6dK  gz=%5dK\n" "$(basename $f)" "$(($raw/1024))" "$(($gz/1024))"
done
```

Record the output to share in the PR description for comparison against the audit baseline.

- [ ] **Step 4: Push and open PR**

```bash
git push -u origin <branch-or-main>
```

If working on `main` directly (per repo convention), the changes ship as a series of commits. Otherwise create branch and `gh pr create`.

PR description should include:

- "Phase 0 of stack-diet migration (see `docs/superpowers/specs/2026-05-12-stack-diet-design.md`)"
- The before/after bundle size table from Step 3
- "Network panel confirms zero external CDN requests."
- "Visual smoke-tested on every route — see Step 2 checklist."

---

## Notes

- After this phase, ESLint may surface unused-import warnings if any file imported FA-related types. Run `bun run lint` early.
- `legacyStyles.tsx` still has CSS for `.fa-chart-bar`. Step 9 of Task 2 renames it to `.bar-chart-icon`. If subsequent phases find no consumer, it can be deleted entirely — but cleaning up that selector isn't required for Phase 0 acceptance.
- Don't worry about the `https://img.icons8.com/...` scatter-plot icon in reddit `Visualization.tsx` — that's an external image, not a font, and it's not in the audit-flagged blocking-CSS bucket. Leaving it for a separate cleanup phase if you want.
