import { useEffect } from 'react'
import { useIntro } from '../hooks/useIntro'
import { useTerminal } from '../hooks/useTerminal'
import { IntroLine } from './IntroLine'
import type { CommandDef, TerminalConfig } from '../types'

interface TerminalShellProps {
  pinned: boolean
  onPin: () => void
  config: Required<TerminalConfig>
  resolvedCommands: Record<string, CommandDef>
}

export function TerminalShell({ pinned, onPin, config, resolvedCommands }: TerminalShellProps) {
  const { introLines, typingSpeed, delayBetweenLines, onNavigate, onSwitchLocale, onSetTheme, height, resizable, promptSymbol } =
    config

  const { introStep, introComplete } = useIntro(introLines, typingSpeed, delayBetweenLines)
  const { history, input, setInput, ghostText, inputRef, bottomRef, handleKeyDown } = useTerminal(
    resolvedCommands,
    { onNavigate, onSwitchLocale, onSetTheme },
    { persistHistory: config.persistHistory }
  )

  useEffect(() => {
    if (introComplete) inputRef.current?.focus({ preventScroll: true })
  }, [introComplete, inputRef])

  const heightValue = typeof height === 'number' ? `${height}px` : height

  const outerStyle: React.CSSProperties = resizable
    ? {
        width: '100%',
        height: `calc(${heightValue} + 37px)`,
        minWidth: 240,
        minHeight: 180,
        resize: 'both',
        overflow: 'hidden',
        cursor: 'text',
        borderRadius: 'var(--ht-border-radius, 0.75rem)',
        border: '1px solid var(--ht-border, rgba(255,255,255,0.1))',
        background: 'var(--ht-bg, rgba(0,0,0,0.85))',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
      }
    : {
        width: '100%',
        cursor: 'text',
        borderRadius: 'var(--ht-border-radius, 0.75rem)',
        border: '1px solid var(--ht-border, rgba(255,255,255,0.1))',
        background: 'var(--ht-bg, rgba(0,0,0,0.85))',
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
      }

  return (
    <div onClick={() => inputRef.current?.focus({ preventScroll: true })} style={outerStyle}>
      {/* Title bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          borderBottom: '1px solid var(--ht-border, rgba(255,255,255,0.1))',
          padding: '8px 16px',
          cursor: 'default',
          background: 'var(--ht-header-bg, transparent)',
          flexShrink: 0,
        }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(239,68,68,0.7)', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(234,179,8,0.7)', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(34,197,94,0.7)', display: 'inline-block' }} />
        <span style={{ marginLeft: 8, flex: 1, fontFamily: 'var(--ht-font-family, monospace)', fontSize: 10, opacity: 0.5, color: 'var(--ht-fg, #ffffff)' }}>
          terminal
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onPin() }}
          title={pinned ? 'Unpin terminal' : 'Pin terminal (drag anywhere)'}
          style={{
            cursor: 'pointer',
            border: pinned ? '1px solid rgba(59,130,246,0.4)' : '1px solid transparent',
            borderRadius: 4,
            padding: '2px 6px',
            fontSize: 10,
            fontFamily: 'var(--ht-font-family, monospace)',
            background: pinned ? 'rgba(59,130,246,0.2)' : 'transparent',
            color: pinned ? 'var(--ht-accent, #3b82f6)' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.15s',
          }}>
          {pinned ? '📌 pinned' : '📌'}
        </button>
      </div>

      {/* Content */}
      <div
        style={
          resizable
            ? { flex: 1, overflowY: 'auto', padding: '16px', fontFamily: 'var(--ht-font-family, monospace)', fontSize: 'var(--ht-font-size, 12px)', color: 'var(--ht-fg, #ffffff)' }
            : { maxHeight: heightValue, overflowY: 'auto', padding: '16px', fontFamily: 'var(--ht-font-family, monospace)', fontSize: 'var(--ht-font-size, 12px)', color: 'var(--ht-fg, #ffffff)' }
        }
      >
        {/* Intro animation */}
        {introLines.map((line, i) => (
          <IntroLine
            key={line.prompt}
            line={line}
            active={i === introStep}
            done={i < introStep}
            typingSpeed={typingSpeed}
          />
        ))}

        {/* Command history */}
        {introComplete &&
          history.map((entry, i) => (
            <div key={i} style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ color: 'var(--ht-prompt, var(--ht-accent, #3b82f6))' }}>{promptSymbol}</span>
                <span style={{ color: 'var(--ht-fg, #ffffff)' }}>{entry.command}</span>
              </div>
              {entry.output && <div style={{ marginTop: '2px' }}>{entry.output}</div>}
            </div>
          ))}

        {/* Active input */}
        {introComplete && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 4 }}>
            <span style={{ color: 'var(--ht-prompt, var(--ht-accent, #3b82f6))' }}>{promptSymbol}</span>
            <div style={{ position: 'relative', flex: 1 }}>
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                  whiteSpace: 'pre',
                  color: 'rgba(255,255,255,0.25)',
                  fontFamily: 'var(--ht-font-family, monospace)',
                  fontSize: 'var(--ht-font-size, 12px)',
                }}>
                {input}
                <span>{ghostText}</span>
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
                style={{
                  position: 'relative',
                  width: '100%',
                  background: 'transparent',
                  color: 'var(--ht-fg, #ffffff)',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'var(--ht-font-family, monospace)',
                  fontSize: 'var(--ht-font-size, 12px)',
                  caretColor: 'var(--ht-accent, #3b82f6)',
                }}
                placeholder={input ? '' : 'type a command…'}
              />
            </div>
          </div>
        )}

        {/* Blinking cursor during last intro line */}
        {!introComplete && introStep === introLines.length - 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 4 }}>
            <span style={{ color: 'var(--ht-prompt, var(--ht-accent, #3b82f6))' }}>{promptSymbol}</span>
            <span style={{ display: 'inline-block', width: 6, height: 14, background: 'var(--ht-accent, #3b82f6)', animation: 'ht-pulse 1s infinite' }} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
