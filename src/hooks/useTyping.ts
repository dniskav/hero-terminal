import { useState, useEffect } from 'react'

/**
 * Animates text character by character.
 * Returns the currently-displayed portion of `text`.
 */
export function useTyping(text: string, active: boolean, typingSpeed: number): string {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    if (!active) {
      setDisplayed('')
      return
    }
    let i = 0
    setDisplayed('')
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, typingSpeed)
    return () => clearInterval(id)
  }, [text, active, typingSpeed])

  return displayed
}
