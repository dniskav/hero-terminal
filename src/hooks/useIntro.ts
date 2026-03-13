import { useState, useEffect } from 'react'
import type { TerminalLine } from '../types'

/**
 * Drives the sequential intro animation.
 * Advances `introStep` automatically based on typing duration + delay.
 */
export function useIntro(
  introLines: TerminalLine[],
  typingSpeed: number,
  delayBetweenLines: number,
) {
  const [introStep, setIntroStep] = useState(0)
  const introComplete = introStep >= introLines.length

  useEffect(() => {
    if (introComplete) return
    const duration = introLines[introStep].prompt.length * typingSpeed + delayBetweenLines
    const id = setTimeout(() => setIntroStep((s) => s + 1), duration)
    return () => clearTimeout(id)
  }, [introStep, introComplete, introLines, typingSpeed, delayBetweenLines])

  return { introStep, introComplete }
}
