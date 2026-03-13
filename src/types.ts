import type { ReactNode } from 'react'

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
}

export interface HeroTerminalProps {
  config?: TerminalConfig
}

// ─── Internal types ───────────────────────────────────────────────────────────

export interface HistoryEntry {
  command: string
  output: ReactNode
}
