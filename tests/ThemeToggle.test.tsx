import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '../src/components/ThemeToggle'
import { useDashboardStore } from '../src/store/dashboardStore'
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('../src/store/dashboardStore', () => ({
  useDashboardStore: vi.fn(),
}))

describe('ThemeToggle', () => {
  const mockSetTheme = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      preferences: { theme: 'system' },
      setTheme: mockSetTheme,
    })
  })

  it('renders all three theme buttons', () => {
    render(<ThemeToggle />)
    
    expect(screen.getByLabelText('Switch to light theme')).toBeInTheDocument()
    expect(screen.getByLabelText('Switch to dark theme')).toBeInTheDocument()
    expect(screen.getByLabelText('Use system theme')).toBeInTheDocument()
  })

  it('calls setTheme when light theme is clicked', async () => {
    render(<ThemeToggle />)
    
    const lightButton = screen.getByLabelText('Switch to light theme')
    await userEvent.click(lightButton)

    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('calls setTheme when dark theme is clicked', async () => {
    render(<ThemeToggle />)
    
    const darkButton = screen.getByLabelText('Switch to dark theme')
    await userEvent.click(darkButton)

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('calls setTheme when system theme is clicked', async () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      preferences: { theme: 'light' },
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)
    
    const systemButton = screen.getByLabelText('Use system theme')
    await userEvent.click(systemButton)

    expect(mockSetTheme).toHaveBeenCalledWith('system')
  })

  it('marks current theme as pressed', () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      preferences: { theme: 'dark' },
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)
    
    expect(screen.getByLabelText('Switch to dark theme')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByLabelText('Switch to light theme')).toHaveAttribute('aria-pressed', 'false')
  })

  it('renders loading skeleton before mount', () => {
    const markup = renderToStaticMarkup(<ThemeToggle />)

    expect(markup).toContain('animate-pulse')
  })
})