import { useState, useEffect, useRef } from 'react'

/**
 * Manages the pin/unpin state and drag position of the floating terminal.
 * Returns the ref to attach to the inline (non-pinned) container.
 */
export function usePinnedTerminal() {
  const [pinned, setPinned] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [pinnedPos, setPinnedPos] = useState<{ x: number; y: number } | null>(null)
  const inlineRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  function handlePin() {
    if (!pinned && inlineRef.current) {
      const rect = inlineRef.current.getBoundingClientRect()
      setPinnedPos({ x: rect.left, y: rect.top })
    }
    setPinned((p) => !p)
  }

  return { pinned, mounted, pinnedPos, inlineRef, handlePin }
}
