import { useState, useRef, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import type { CommandDef, CommandContext, TerminalConfig, HistoryEntry } from '../types'

type Callbacks = Required<Pick<TerminalConfig, 'onNavigate' | 'onSwitchLocale' | 'onSetTheme'>>

/**
 * Core terminal logic: command execution, history, input state,
 * autocomplete ghost text, and keyboard navigation (↑ / ↓ / Tab / →).
 */
export function useTerminal(
  resolvedCommands: Record<string, CommandDef>,
  callbacks: Callbacks,
  options: { persistHistory?: boolean } = { persistHistory: true }
) {
  const persist = options.persistHistory ?? true

  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>(() => {
    if (!persist) return []
    try {
      const raw = localStorage.getItem('ht_cmd_history')
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
      return []
    }
  })
  const [historyIndex, setHistoryIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Autocomplete
  const lowerInput = input.toLowerCase()
  const cmdKeys = Object.keys(resolvedCommands)
  const suggestion =
    input.length > 0
      ? (cmdKeys.find((k) => k.startsWith(lowerInput) && k !== lowerInput) ?? '')
      : ''
  const ghostText = suggestion ? suggestion.slice(input.length) : ''

  // Auto-scroll on new history entry
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [history])

  function clearHistory() {
    setHistory([])
    setCmdHistory([])
    if (persist) localStorage.removeItem('ht_cmd_history')
  }

  function runCommand(raw: string) {
    const trimmed = raw.trim()
    if (!trimmed) return

    const [cmd, ...argParts] = trimmed.toLowerCase().split(/\s+/)
    const rawArgs = argParts.join(' ')
    const def = resolvedCommands[cmd]

    const ctx: CommandContext = {
      scroll: (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }),
      navigate: (path) => callbacks.onNavigate(path),
      setTheme: (theme) => callbacks.onSetTheme(theme),
      switchLocale: () => callbacks.onSwitchLocale(),
      clear: clearHistory,
      rawArgs,
      allCommands: resolvedCommands
    }

    const output = def ? (
      def.action(ctx)
    ) : (
      <p style={{ paddingLeft: '1rem', color: '#f87171' }}>
        Sorry, my super powers are limited at the moment 😔
      </p>
    )

    // Push to command history for ↑/↓ navigation
    setCmdHistory((h) => {
      const next = [trimmed, ...h]
      if (persist) {
        try {
          localStorage.setItem('ht_cmd_history', JSON.stringify(next))
        } catch {}
      }
      return next
    })
    setHistoryIndex(-1)

    // `clear` action calls clearHistory() via ctx, no need to add to display history
    if (cmd !== 'clear') {
      setHistory((h) => [...h, { command: trimmed, output }])
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      runCommand(input)
      setInput('')
    } else if ((e.key === 'Tab' || e.key === 'ArrowRight') && ghostText) {
      e.preventDefault()
      setInput(suggestion)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(historyIndex + 1, cmdHistory.length - 1)
      setHistoryIndex(next)
      setInput(cmdHistory[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex <= 0) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        const next = historyIndex - 1
        setHistoryIndex(next)
        setInput(cmdHistory[next] ?? '')
      }
    }
  }

  return {
    history,
    input,
    setInput,
    ghostText,
    suggestion,
    inputRef,
    bottomRef,
    handleKeyDown
  }
}
