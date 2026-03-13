import React, { useState } from 'react'
import { HeroTerminal } from '../../src/HeroTerminal'
import { themes } from '../../src/themes'

const themeNames = Object.keys(themes)

const LIGHT_THEMES = ['solarized-light']

export default function App() {
  const [selectedTheme, setSelectedTheme] = useState('default')
  const isDark = !LIGHT_THEMES.includes(selectedTheme)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: isDark ? '#0f0f13' : '#f5f5f0',
        color: isDark ? '#e2e8f0' : '#1a1a1a',
        fontFamily: 'system-ui, sans-serif',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          @dniskav/hero-terminal
        </h1>
        <p style={{ opacity: 0.6, marginBottom: 40, fontSize: 14 }}>
          A decorative terminal component for React hero sections.
        </p>

        {/* Theme picker */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Theme
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {themeNames.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedTheme(name)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: selectedTheme === name
                    ? `2px solid ${themes[name].accent ?? '#3b82f6'}`
                    : '2px solid transparent',
                  background: selectedTheme === name
                    ? `${themes[name].background ?? 'rgba(0,0,0,0.8)'}`
                    : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
                  color: selectedTheme === name
                    ? (themes[name].foreground ?? '#fff')
                    : 'inherit',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontFamily: 'monospace',
                  transition: 'all 0.15s',
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal */}
        <HeroTerminal
          key={selectedTheme}
          config={{
            theme: selectedTheme,
            width: 480,
            height: 300,
            resizable: true,
            introLines: [
              { prompt: 'whoami', output: ['hero-terminal — decorative terminal for React'] },
              { prompt: 'theme --current', output: [selectedTheme, `prompt: ${themes[selectedTheme]?.promptSymbol ?? '❯'}`] },
            ],
          }}
        />

        {/* Code snippet */}
        <div style={{ marginTop: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Usage
          </p>
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
