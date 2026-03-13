# @dniskav/hero-terminal

A **decorative terminal component** for React hero sections. It looks and feels like a real terminal — typing animation, autocomplete, command history — but it's purely cosmetic: commands and output are defined by you. Perfect for portfolios and landing pages that want a technical aesthetic without the complexity of a real shell.

![npm](https://img.shields.io/npm/v/@dniskav/hero-terminal)
![license](https://img.shields.io/npm/l/@dniskav/hero-terminal)

**[Live demo →](https://dniskav.github.io/hero-terminal/)**

---

## Installation

```bash
npm install @dniskav/hero-terminal
# peer deps (if not already installed)
npm install react react-dom framer-motion
```

---

## Quick start

```tsx
import { HeroTerminal } from '@dniskav/hero-terminal'

export default function Hero() {
  return <HeroTerminal />
}
```

That's it. By default the terminal shows a short intro animation and includes `help` and `clear` commands.

---

## Usage with custom commands

```tsx
import { HeroTerminal } from '@dniskav/hero-terminal'
import type { TerminalConfig } from '@dniskav/hero-terminal'

const config: TerminalConfig = {
  introLines: [
    { prompt: 'whoami', output: ['daniel niskav', 'frontend engineer'] },
    { prompt: 'ls projects/', output: ['hero-terminal', 'dniskav.com', '...'] },
  ],
  extraCommands: {
    about: {
      description: 'About me',
      action: () => (
        <p style={{ paddingLeft: '1rem', opacity: 0.8 }}>Building things for the web.</p>
      ),
    },
    contact: {
      description: 'Get in touch',
      action: ({ navigate }) => {
        navigate('/contact')
        return <p style={{ paddingLeft: '1rem', opacity: 0.8 }}>Navigating to /contact…</p>
      },
    },
  },
}

export default function Hero() {
  return <HeroTerminal config={config} />
}
```

---

## Usage with Next.js (App Router)

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { HeroTerminal } from '@dniskav/hero-terminal'
import type { TerminalConfig } from '@dniskav/hero-terminal'

export function HeroSection() {
  const router = useRouter()
  const { setTheme } = useTheme()

  const config: TerminalConfig = {
    onNavigate: (path) => router.push(path),
    onSetTheme: (theme) => setTheme(theme),
    extraCommands: {
      projects: {
        description: 'Go to projects page',
        action: ({ navigate }) => {
          navigate('/projects')
          return <p style={{ paddingLeft: '1rem', opacity: 0.8 }}>Navigating…</p>
        },
      },
      theme: {
        description: 'Switch theme — usage: theme dark | light',
        action: ({ setTheme, rawArgs }) => {
          if (!rawArgs)
            return (
              <p style={{ paddingLeft: '1rem', color: '#f87171' }}>Usage: theme dark | light</p>
            )
          setTheme(rawArgs)
          return <p style={{ paddingLeft: '1rem', opacity: 0.8 }}>Theme set to {rawArgs}</p>
        },
      },
    },
  }

  return <HeroTerminal config={config} />
}
```

---

## API

### `<HeroTerminal config? />`

The main component. All props are optional.

| Prop | Type | Default |
|------|------|---------|
| `config` | `TerminalConfig` | `{}` |

---

### `TerminalConfig`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `introLines` | `TerminalLine[]` | `[{ prompt: 'ready', output: [...] }]` | Lines animated on mount |
| `typingSpeed` | `number` | `36` | Milliseconds per character |
| `delayBetweenLines` | `number` | `800` | Milliseconds between intro lines |
| `commands` | `Record<string, CommandDef>` | — | **Replaces** the default command set entirely |
| `extraCommands` | `Record<string, CommandDef>` | — | **Merges** on top of the default commands |
| `onNavigate` | `(path: string) => void` | — | Called when a command triggers navigation |
| `onSwitchLocale` | `() => void` | — | Called when a command triggers locale switch |
| `onSetTheme` | `(theme: string) => void` | — | Called when a command triggers theme change |
| `theme` | `string \| TerminalTheme` | `"default"` | Preset name or custom theme object (see [Theming](#theming)) |
| `width` | `number \| string` | `320` | Terminal width — number (px) or any CSS value |
| `height` | `number \| string` | `288` | Content area height — number (px) or any CSS value |
| `resizable` | `boolean` | `false` | Allow user to resize by dragging the corner |
| `persistHistory` | `boolean` | `true` | Persist command history (↑/↓) in localStorage |
| `promptSymbol` | `string` | theme default / `"❯"` | Override the prompt symbol (e.g. `"$"`, `"PS>"`, `">"`) |
| `windowStyle` | `"mac" \| "windows" \| "linux"` | theme default / `"mac"` | Title bar chrome style |

---

### `TerminalLine`

```ts
interface TerminalLine {
  prompt: string   // text typed after the ❯ prompt
  output: string[] // lines of output shown below
}
```

---

### `CommandDef`

```ts
interface CommandDef {
  description: string                        // shown by `help`
  action: (ctx: CommandContext) => ReactNode // called on execute
}
```

---

### `CommandContext`

Context passed to every command action:

| Property | Type | Description |
|----------|------|-------------|
| `scroll` | `(id: string) => void` | Smooth-scroll to a DOM element by id |
| `navigate` | `(path: string) => void` | Wraps `onNavigate` |
| `setTheme` | `(theme: string) => void` | Wraps `onSetTheme` |
| `switchLocale` | `() => void` | Wraps `onSwitchLocale` |
| `clear` | `() => void` | Clears the terminal history |
| `rawArgs` | `string` | Arguments after the command name (`"theme dark"` → `"dark"`) |
| `allCommands` | `Record<string, CommandDef>` | All active commands (useful for custom `help`) |

---

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Execute command |
| `Tab` / `→` | Accept autocomplete suggestion |
| `↑` / `↓` | Navigate command history |

---

## Theming

### Preset themes

Pass a theme name via `config.theme`. Available presets:

| Name | Style |
|------|-------|
| `default` | Dark blue (default) |
| `dracula` | Purple & green |
| `nord` | Arctic blue |
| `monokai` | Classic editor |
| `solarized-dark` | Warm dark |
| `solarized-light` | Warm light |
| `gruvbox` | Retro warm |
| `one-dark` | Atom classic |
| `catppuccin` | Pastel mocha |
| `tokyo-night` | Neon city |
| `bash` | Classic bash `$` |
| `zsh` | Oh-My-Zsh style `❯` |
| `powershell` | Windows PowerShell `PS>` |
| `cmd` | Windows CMD `>` |

```tsx
<HeroTerminal config={{ theme: 'dracula' }} />
<HeroTerminal config={{ theme: 'powershell' }} />
<HeroTerminal config={{ theme: 'cmd' }} />
```

### Custom theme object

Pass a `TerminalTheme` object to control every detail:

```tsx
import type { TerminalTheme } from '@dniskav/hero-terminal'

const myTheme: TerminalTheme = {
  background: '#0d1117',
  foreground: '#e6edf3',
  accent: '#58a6ff',
  promptColor: '#3fb950',   // color of the prompt symbol
  promptSymbol: '❯',        // the actual symbol (default: ❯)
  border: '#30363d',
  headerBackground: '#161b22',
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 13,
  borderRadius: '0.5rem',
}

<HeroTerminal config={{ theme: myTheme }} />
```

### CSS Custom Properties

All theme values map to CSS variables you can also set globally or per-scope:

| Variable | Controls | Default |
|----------|----------|---------|
| `--ht-bg` | Window background | `rgba(0,0,0,0.85)` |
| `--ht-fg` | Text color | `#ffffff` |
| `--ht-accent` | Accent / caret color | `#3b82f6` |
| `--ht-prompt` | Prompt symbol color | inherits `--ht-accent` |
| `--ht-border` | Border & separators | `rgba(255,255,255,0.1)` |
| `--ht-header-bg` | Title bar background | `transparent` |
| `--ht-font-family` | Font family | `monospace` |
| `--ht-font-size` | Font size | `12px` |
| `--ht-border-radius` | Window corner radius | `0.75rem` |

```css
/* Minimal override via CSS */
:root {
  --ht-accent: #10b981;
  --ht-font-size: 13px;
}
```

### Window style

Controls the title bar chrome. The `powershell` and `cmd` presets automatically use `"windows"`.

| Value | Title bar |
|-------|-----------|
| `"mac"` | Colored traffic-light dots left, pin right (default) |
| `"windows"` | Pin left, title center, `— □ ✕` buttons right |
| `"linux"` | Muted grey dots left, circular close right |

```tsx
<HeroTerminal config={{ theme: 'nord', windowStyle: 'linux' }} />
```

### Size & resize

```tsx
<HeroTerminal
  config={{
    width: 480,      // terminal width (px)
    height: 320,     // scrollable content height (px)
    resizable: true, // user can drag the bottom-right corner to resize
  }}
/>
```

---

## Pin & drag

Clicking the 📌 button detaches the terminal from the layout and makes it freely draggable via Framer Motion. Click 📌 again to return it to its original position.

---

## Peer dependencies

| Package | Version |
|---------|---------|
| `react` | `>=18` |
| `react-dom` | `>=18` |
| `framer-motion` | `>=11` |

---

## License

MIT © [Daniel Niskav](https://dniskav.com)
