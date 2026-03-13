import React, { useState } from 'react'
import { HeroTerminal } from '../../src/HeroTerminal'
import { themes } from '../../src/themes'

const themeNames = Object.keys(themes)
const LIGHT_THEMES = ['solarized-light']
const WINDOW_STYLES = ['mac', 'windows', 'linux'] as const
type WindowStyle = typeof WINDOW_STYLES[number]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 10, opacity: 0.45, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
      {children}
    </p>
  )
}

export default function App() {
  const [selectedTheme, setSelectedTheme] = useState('default')
  const [selectedWindow, setSelectedWindow] = useState<WindowStyle | 'auto'>('auto')
  const isDark = !LIGHT_THEMES.includes(selectedTheme)

  const themeWindowStyle = themes[selectedTheme]?.windowStyle as WindowStyle | undefined
  const resolvedWindow = selectedWindow === 'auto' ? (themeWindowStyle ?? 'mac') : selectedWindow

  const btnBase = (active: boolean, bg?: string, fg?: string, border?: string): React.CSSProperties => ({
    padding: '5px 14px',
    borderRadius: 6,
    border: active ? `2px solid ${border ?? '#3b82f6'}` : '2px solid transparent',
    background: active ? (bg ?? 'rgba(59,130,246,0.15)') : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'),
    color: active ? (fg ?? 'inherit') : 'inherit',
    cursor: 'pointer',
    fontSize: 13,
    fontFamily: 'monospace',
    transition: 'all 0.15s',
  })

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#0f0f13' : '#f5f5f0', color: isDark ? '#e2e8f0' : '#1a1a1a', fontFamily: 'system-ui, sans-serif', transition: 'background 0.3s, color 0.3s' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>@dniskav/hero-terminal</h1>
        <p style={{ opacity: 0.6, marginBottom: 40, fontSize: 14 }}>
          A decorative terminal component for React hero sections.
        </p>

        {/* Theme picker */}
        <div style={{ marginBottom: 24 }}>
          <SectionLabel>Theme</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {themeNames.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedTheme(name)}
                style={btnBase(
                  selectedTheme === name,
                  themes[name].background ?? 'rgba(0,0,0,0.8)',
                  themes[name].foreground ?? '#fff',
                  themes[name].accent ?? '#3b82f6',
                )}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Window style picker */}
        <div style={{ marginBottom: 32 }}>
          <SectionLabel>Window style</SectionLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setSelectedWindow('auto')} style={btnBase(selectedWindow === 'auto')}>
              auto {selectedWindow === 'auto' && <span style={{ opacity: 0.5 }}>({resolvedWindow})</span>}
            </button>
            {WINDOW_STYLES.map((ws) => (
              <button key={ws} onClick={() => setSelectedWindow(ws)} style={btnBase(selectedWindow === ws)}>
                {ws}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal preview */}
        <HeroTerminal
          key={selectedTheme + selectedWindow}
          config={{
            theme: selectedTheme,
            windowStyle: resolvedWindow,
            width: 480,
            height: 300,
            resizable: true,
            introLines: [
              { prompt: 'whoami', output: ['hero-terminal — decorative terminal for React'] },
              {
                prompt: 'env --current',
                output: [
                  `theme:  ${selectedTheme}`,
                  `window: ${resolvedWindow}`,
                  `prompt: ${themes[selectedTheme]?.promptSymbol ?? '❯'}`,
                ],
              },
            ],
          }}
        />

        {/* Code snippet */}
        <div style={{ marginTop: 48 }}>
          <SectionLabel>Usage</SectionLabel>
          <pre
            style={{
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: 8,
              padding: '20px 24px',
              fontSize: 13,
              fontFamily: 'monospace',
              overflowX: 'auto',
              lineHeight: 1.7,
            }}
          >
{`<HeroTerminal
  config={{
    theme: "${selectedTheme}",
    windowStyle: "${resolvedWindow}",
    width: 480,
    height: 300,
    resizable: true,
  }}
/>`}
          </pre>
        </div>
      </div>
    </div>
  )
}
