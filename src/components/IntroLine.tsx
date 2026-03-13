import { motion, AnimatePresence } from 'framer-motion'
import { useTyping } from '../hooks/useTyping'
import type { TerminalLine } from '../types'

interface IntroLineProps {
  line: TerminalLine
  active: boolean
  done: boolean
  typingSpeed: number
}

export function IntroLine({ line, active, done, typingSpeed }: IntroLineProps) {
  const typed = useTyping(line.prompt, active || done, typingSpeed)
  const showOutput = done || (active && typed === line.prompt)

  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <span style={{ color: 'var(--ht-accent, #3b82f6)' }}>❯</span>
        <span style={{ color: 'white' }}>{typed}</span>
        {active && typed !== line.prompt && (
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '14px',
              background: 'var(--ht-accent, #3b82f6)',
              marginLeft: '2px',
              animation: 'ht-pulse 1s infinite',
            }}
          />
        )}
      </div>
      <AnimatePresence>
        {showOutput && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{ paddingLeft: '1rem', marginTop: '2px' }}
          >
            {line.output.map((out, i) => (
              <p key={i} style={{ opacity: 0.6, lineHeight: 1.4, margin: 0 }}>
                {out}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
