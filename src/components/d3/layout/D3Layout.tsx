import { css } from '@emotion/react'
import { createContext, useContext, useState, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Moon, Sun } from 'src/components/ui/icons'

// Theme Definitions
export type ThemeMode = 'dark' | 'light'

interface Theme {
  background: string
  text: string
  border: string
  secondaryBackground: string
  accent: string
}

export const themes: Record<ThemeMode, Theme> = {
  dark: {
    background: '#121212', // Material Dark
    secondaryBackground: '#1E1E1E',
    text: '#E0E0E0',
    border: '#333333',
    accent: '#BB86FC',
  },
  light: {
    background: '#FAFAFA',
    secondaryBackground: '#FFFFFF',
    text: '#212121',
    border: '#E0E0E0',
    accent: '#6200EE',
  },
}

// Context
const D3ThemeContext = createContext<{
  mode: ThemeMode
  theme: Theme
  toggleTheme: () => void
} | null>(null)

export const useD3Theme = () => {
  const context = useContext(D3ThemeContext)
  if (!context) throw new Error('useD3Theme must be used within D3Layout')
  return context
}

// Layout Component
interface D3LayoutProps {
  title: string
  children: ReactNode
  vizConfig?: {
    maxWidth?: string
    height?: string
    showBorder?: boolean
  }
}

export const D3Layout = ({ title, children, vizConfig }: D3LayoutProps) => {
  const [mode, setMode] = useState<ThemeMode>('dark')
  const navigate = useNavigate()

  const theme = themes[mode]

  const toggleTheme = () =>
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))

  // Styles
  const containerStyle = css({
    minHeight: '100vh',
    width: '100%',
    backgroundColor: theme.background,
    color: theme.text,
    transition: 'background-color 0.3s ease, color 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'inherit',
  })

  const headerStyle = css({
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.border}`,
    backgroundColor: theme.secondaryBackground,
    zIndex: 10,
  })

  const titleStyle = css({
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 500,
  })

  const backButtonStyle = css({
    background: 'none',
    border: 'none',
    color: theme.text,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    padding: '0.5rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor:
        mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },
  })

  const vizContainerOuterStyle = css({
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    overflow: 'hidden',
  })

  const vizContainerInnerStyle = css({
    width: '100%',
    maxWidth: vizConfig?.maxWidth || '1200px',
    height: vizConfig?.height || '600px',
    backgroundColor: theme.secondaryBackground,
    border: vizConfig?.showBorder ? `1px solid ${theme.border}` : 'none',
    borderRadius: '8px',
    padding: '1rem',
    position: 'relative',
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
    boxShadow:
      mode === 'dark'
        ? '0 4px 6px rgba(0,0,0,0.3)'
        : '0 4px 6px rgba(0,0,0,0.05)',
  })

  return (
    <D3ThemeContext.Provider value={{ mode, theme, toggleTheme }}>
      <div css={containerStyle}>
        <header css={headerStyle}>
          <button
            css={backButtonStyle}
            onClick={() => navigate('/d3')}
            type="button"
          >
            <ArrowLeft aria-label="Back" /> Back
          </button>
          <h1 css={titleStyle}>{title}</h1>
          <ThemeToggle mode={mode} toggle={toggleTheme} />
        </header>
        <main css={vizContainerOuterStyle}>
          <div css={vizContainerInnerStyle}>{children}</div>
        </main>
      </div>
    </D3ThemeContext.Provider>
  )
}

// Toggle Component
const ThemeToggle = ({
  mode,
  toggle,
}: {
  mode: ThemeMode
  toggle: () => void
}) => {
  return (
    <div
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          toggle()
        }
      }}
      role="button"
      tabIndex={0}
      css={css({
        width: '50px',
        height: '26px',
        backgroundColor: mode === 'dark' ? '#333' : '#ddd',
        borderRadius: '13px',
        display: 'flex',
        alignItems: 'center',
        padding: '2px',
        cursor: 'pointer',
        position: 'relative',
        '&:focus': {
          outline: '2px solid cornflowerblue',
        },
      })}
    >
      <div
        css={css({
          width: '22px',
          height: '22px',
          backgroundColor: 'white',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
          },
        })}
        style={{
          marginLeft: mode === 'dark' ? '24px' : '0px',
        }}
      >
        {mode === 'dark' ? (
          <Moon
            aria-label="Dark mode"
            style={{ fontSize: '12px', color: '#333' }}
          />
        ) : (
          <Sun
            aria-label="Light mode"
            style={{ fontSize: '12px', color: '#FDB813' }}
          />
        )}
      </div>
    </div>
  )
}

export default D3Layout
