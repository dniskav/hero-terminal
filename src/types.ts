import type { ReactNode } from 'react'

// ─── Theme ─────────────────────────────────────────────────────────────────────

export interface TerminalTheme {
  /** Terminal window background color */
  background?: string
  /** Default text color */
  foreground?: string
  /** Accent / highlight color (caret, autocomplete). Also used as prompt color if `promptColor` is omitted. */
  accent?: string
  /** Color of the prompt symbol. Defaults to `accent`. */
  promptColor?: string
  /** The prompt symbol text (e.g. `"❯"`, `"$"`, `"PS>"`, `">"`). Default: `"❯"`. */
  promptSymbol?: string
  /** Border and separator color */
  border?: string
  /** Title bar background. Defaults to transparent / `background`. */
  headerBackground?: string
  /** Font family for all terminal text */
  fontFamily?: string
  /** Font size — number (px) or CSS string (e.g. `"13px"`, `"0.85rem"`) */
  fontSize?: number | string
  /** Border radius of the terminal window — number (px) or CSS string */
  borderRadius?: number | string
  /**
   * Title bar / window chrome style.
   * - `"mac"` — colored traffic-light dots on the left (default)
   * - `"windows"` — flat minimize/maximize/close buttons on the right, pin on the left
   * - `"linux"` — muted dots on the left, circular close button on the right
   */
  windowStyle?: 'mac' | 'windows' | 'linux'
}

// ─── Public types ─────────────────────────────────────────────────────────────

export interface TerminalLine {
  /** Command text shown with the prompt. */
  prompt: string
  /** Lines of output shown below the prompt. */
  output: string[]
}

export interface CommandContext {
  /** Smooth-scroll to a DOM element by id. */
  scroll: (id: string) => void
  /** Trigger navigation (wraps `onNavigate`). */
  navigate: (path: string) => void
  /** Trigger theme change (wraps `onSetTheme`). */
  setTheme: (theme: string) => void
  /** Trigger locale switch (wraps `onSwitchLocale`). */
  switchLocale: () => void
  /** Clear the terminal history. */
  clear: () => void
  /** Raw argument string after the command name (e.g. `"theme dark"` → `"dark"`). */
  rawArgs: string
  /** All currently active commands. */
  allCommands: Record<string, CommandDef>
}

export interface CommandDef {
  /** Short description shown by `help`. */
  description: string
  /** Function that runs when the command is executed. Returns any React node. */
  action: (ctx: CommandContext) => ReactNode
}

export interface TerminalConfig {
  /** Lines played as an animated intro on mount. */
  introLines?: TerminalLine[]
  /** Milliseconds per character during typing animation. Default: `36` */
  typingSpeed?: number
  /** Milliseconds between intro lines. Default: `800` */
  delayBetweenLines?: number
  /**
   * Fully replace the default command set (`help` + `clear`).
   * If omitted, defaults are kept.
   */
  commands?: Record<string, CommandDef>
  /**
   * Commands merged on top of the active set.
   * Useful for adding commands without losing `help` and `clear`.
   */
  extraCommands?: Record<string, CommandDef>
  /** Called when a command triggers navigation. */
  onNavigate?: (path: string) => void
  /** Called when a command triggers a locale switch. */
  onSwitchLocale?: () => void
  /** Called when a command triggers a theme change. */
  onSetTheme?: (theme: string) => void
  /** Persist command history (for ↑/↓) in localStorage. Default: `true`. */
  persistHistory?: boolean

  // ─── Appearance ────────────────────────────────────────────────────────────

  /**
   * Visual theme. Pass a preset name (`"dracula"`, `"nord"`, `"catppuccin"`, …)
   * or a `TerminalTheme` object for full custom control.
   * Available presets: `default`, `dracula`, `nord`, `monokai`, `solarized-dark`,
   * `solarized-light`, `gruvbox`, `one-dark`, `catppuccin`, `tokyo-night`.
   */
  theme?: string | TerminalTheme
  /**
   * Width of the terminal window. Number = px, string = any CSS value.
   * Default: `320` (px).
   */
  width?: number | string
  /**
   * Height of the scrollable content area.
   * Number = px, string = any CSS value.
   * When `resizable` is true this becomes the *initial* height.
   * Default: `288` (px).
   */
  height?: number | string
  /**
   * Allow the user to resize the terminal by dragging its bottom-right corner.
   * Default: `false`.
   */
  resizable?: boolean
  /**
   * Override the prompt symbol shown before each command line.
   * If omitted, the active theme's `promptSymbol` is used (default: `"❯"`).
   * Examples: `"$"`, `">"`, `"PS>"`, `"λ"`.
   */
  promptSymbol?: string
  /**
   * Title bar / window chrome style.
   * Overrides the theme's `windowStyle` if set.
   * - `"mac"` — colored traffic-light dots on the left (default)
   * - `"windows"` — flat minimize/maximize/close buttons on the right, pin on the left
   * - `"linux"` — muted dots on the left, circular close button on the right
   */
  windowStyle?: 'mac' | 'windows' | 'linux'
}

export interface HeroTerminalProps {
  config?: TerminalConfig
}

// ─── Internal types ───────────────────────────────────────────────────────────

export interface HistoryEntry {
  command: string
  output: ReactNode
}
