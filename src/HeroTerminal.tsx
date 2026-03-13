'use client'

import { useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { usePinnedTerminal } from './hooks/usePinnedTerminal'
import { TerminalShell } from './components/TerminalShell'
import type { HeroTerminalProps, CommandDef, TerminalConfig } from './types'

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_INTRO_LINES = [
  { prompt: 'ready', output: ['interactive terminal', 'type help to get available commands'] },
]
const DEFAULT_TYPING_SPEED = 36
const DEFAULT_DELAY_BETWEEN_LINES = 800

function buildDefaultCommands(): Record<string, CommandDef> {
  return {
    help: {
      description: 'Show available commands',
      action: ({ allCommands }) => (
        <div style={{ paddingLeft: '1rem' }}>
          <p style={{ marginBottom: '0.25rem', color: 'var(--ht-accent, #3b82f6)', margin: '0 0 4px' }}>
            Available commands:
          </p>
          {Object.entries(allCommands).map(([cmd, { description }]) => (
            <p key={cmd} style={{ display: 'flex', gap: '0.5rem', margin: 0 }}>
              <span style={{ color: 'white', minWidth: '120px', fontFamily: 'monospace' }}>{cmd}</span>
              <span style={{ opacity: 0.6 }}>{description}</span>
            </p>
          ))}
        </div>
      ),
    },
    clear: {
      description: 'Clear terminal history',
      action: ({ clear }) => {
        clear()
        return null
      },
    },
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroTerminal({ config = {} }: HeroTerminalProps) {
  const { pinned, mounted, pinnedPos, inlineRef, handlePin } = usePinnedTerminal()

  const resolvedConfig = useMemo<Required<TerminalConfig>>(
    () => ({
      introLines: config.introLines ?? DEFAULT_INTRO_LINES,
      typingSpeed: config.typingSpeed ?? DEFAULT_TYPING_SPEED,
      delayBetweenLines: config.delayBetweenLines ?? DEFAULT_DELAY_BETWEEN_LINES,
      commands: config.commands ?? {},
      extraCommands: config.extraCommands ?? {},
      onNavigate: config.onNavigate ?? (() => {}),
      onSwitchLocale: config.onSwitchLocale ?? (() => {}),
      onSetTheme: config.onSetTheme ?? (() => {}),
    }),
    [config],
  )

  const resolvedCommands = useMemo<Record<string, CommandDef>>(() => {
    const base =
      Object.keys(resolvedConfig.commands).length > 0
        ? resolvedConfig.commands
        : buildDefaultCommands()
    return { ...base, ...resolvedConfig.extraCommands }
  }, [resolvedConfig])

  const shell = (
    <TerminalShell
      pinned={pinned}
      onPin={handlePin}
      config={resolvedConfig}
      resolvedCommands={resolvedCommands}
    />
  )

  const floatingTerminal =
    mounted && pinned && pinnedPos
      ? createPortal(
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              left: pinnedPos.x,
              top: pinnedPos.y,
              zIndex: 9999,
              width: 320,
            }}
          >
            {shell}
          </motion.div>,
          document.body,
        )
      : null

  return (
    <>
      <style>{`
        @keyframes ht-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
      <div
        ref={inlineRef}
        style={{
          width: '100%',
          maxWidth: 320,
          transition: 'opacity 0.3s',
          opacity: pinned ? 0 : 1,
          pointerEvents: pinned ? 'none' : 'auto',
          visibility: pinned ? 'hidden' : 'visible',
        }}
      >
        {!pinned && shell}
      </div>
      {floatingTerminal}
    </>
  )
}
