import React, { useEffect } from 'react'
import { render } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { act } from 'react'
import { useTerminal } from '../useTerminal'

function TestComp({ getApi, persist }: { getApi: (api: any) => void; persist: boolean }) {
  const api = useTerminal(
    {},
    { onNavigate: () => {}, onSwitchLocale: () => {}, onSetTheme: () => {} },
    { persistHistory: persist }
  )

  useEffect(() => {
    getApi(api)
  }, [api, getApi])
  return null
}

describe('useTerminal persistHistory', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists cmdHistory to localStorage when enabled', async () => {
    let api: any
    render(<TestComp getApi={(a) => (api = a)} persist={true} />)

    // simulate running a command via handleKeyDown (Enter)
    act(() => {
      api.setInput('hello world')
    })
    act(() => {
      api.handleKeyDown({ key: 'Enter', preventDefault: () => {} } as any)
    })

    const raw = localStorage.getItem('ht_cmd_history')
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw!)).toEqual(['hello world'])
  })

  it('does not persist cmdHistory when disabled', async () => {
    let api: any
    render(<TestComp getApi={(a) => (api = a)} persist={false} />)

    act(() => {
      api.setInput('no persist')
    })
    act(() => {
      api.handleKeyDown({ key: 'Enter', preventDefault: () => {} } as any)
    })

    const raw = localStorage.getItem('ht_cmd_history')
    expect(raw).toBeNull()
  })
})
