import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useDashboardStore } from '../src/store/dashboardStore'
import { PomodoroWidget } from '../src/components/widgets/PomodoroWidget'

vi.mock('../src/store/dashboardStore', () => ({
  useDashboardStore: vi.fn(),
}))

describe('PomodoroWidget', () => {
  const mockStartPomodoro = vi.fn()
  const mockPausePomodoro = vi.fn()
  const mockResetPomodoro = vi.fn()
  const mockTickPomodoro = vi.fn()
  const mockSkipPomodoroPhase = vi.fn()

  const defaultPomodoroState = {
    timeLeft: 25 * 60,
    isRunning: false,
    mode: 'work' as const,
    sessionsCompleted: 0,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      pomodoro: defaultPomodoroState,
      preferences: { notificationsEnabled: false },
      startPomodoro: mockStartPomodoro,
      pausePomodoro: mockPausePomodoro,
      resetPomodoro: mockResetPomodoro,
      tickPomodoro: mockTickPomodoro,
      skipPomodoroPhase: mockSkipPomodoroPhase,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders with initial state', () => {
    render(<PomodoroWidget />)
    
    expect(screen.getByText('Focus Time')).toBeInTheDocument()
    expect(screen.getByText('25:00')).toBeInTheDocument()
    expect(screen.getByText('Sessions completed:')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('starts timer when play button is clicked', async () => {
    render(<PomodoroWidget />)
    
    const playButton = screen.getByLabelText('Start timer')
    fireEvent.click(playButton)

    expect(mockStartPomodoro).toHaveBeenCalled()
  })

  it('pauses timer when pause button is clicked', async () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      pomodoro: { ...defaultPomodoroState, isRunning: true },
      preferences: { notificationsEnabled: false },
      startPomodoro: mockStartPomodoro,
      pausePomodoro: mockPausePomodoro,
      resetPomodoro: mockResetPomodoro,
      tickPomodoro: mockTickPomodoro,
      skipPomodoroPhase: mockSkipPomodoroPhase,
    })

    render(<PomodoroWidget />)
    
    const pauseButton = screen.getByLabelText('Pause timer')
    fireEvent.click(pauseButton)

    expect(mockPausePomodoro).toHaveBeenCalled()
  })

  it('resets timer when reset button is clicked', async () => {
    render(<PomodoroWidget />)
    
    const resetButton = screen.getByLabelText('Reset timer')
    fireEvent.click(resetButton)

    expect(mockResetPomodoro).toHaveBeenCalled()
  })

  it('skips to next phase when skip button is clicked', async () => {
    render(<PomodoroWidget />)
    
    const skipButton = screen.getByLabelText('Skip to next phase')
    fireEvent.click(skipButton)

    expect(mockSkipPomodoroPhase).toHaveBeenCalled()
  })

  it('displays short break time correctly', () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      pomodoro: { ...defaultPomodoroState, mode: 'shortBreak', timeLeft: 5 * 60 },
      preferences: { notificationsEnabled: false },
      startPomodoro: mockStartPomodoro,
      pausePomodoro: mockPausePomodoro,
      resetPomodoro: mockResetPomodoro,
      tickPomodoro: mockTickPomodoro,
      skipPomodoroPhase: mockSkipPomodoroPhase,
    })

    render(<PomodoroWidget />)
    
    expect(screen.getByText('Short Break')).toBeInTheDocument()
    expect(screen.getByText('05:00')).toBeInTheDocument()
  })

  it('displays long break time correctly', () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      pomodoro: { ...defaultPomodoroState, mode: 'longBreak', timeLeft: 15 * 60 },
      preferences: { notificationsEnabled: false },
      startPomodoro: mockStartPomodoro,
      pausePomodoro: mockPausePomodoro,
      resetPomodoro: mockResetPomodoro,
      tickPomodoro: mockTickPomodoro,
      skipPomodoroPhase: mockSkipPomodoroPhase,
    })

    render(<PomodoroWidget />)
    
    expect(screen.getByText('Long Break')).toBeInTheDocument()
    expect(screen.getByText('15:00')).toBeInTheDocument()
  })

  it('displays sessions completed count', () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      pomodoro: { ...defaultPomodoroState, sessionsCompleted: 3 },
      preferences: { notificationsEnabled: false },
      startPomodoro: mockStartPomodoro,
      pausePomodoro: mockPausePomodoro,
      resetPomodoro: mockResetPomodoro,
      tickPomodoro: mockTickPomodoro,
      skipPomodoroPhase: mockSkipPomodoroPhase,
    })

    render(<PomodoroWidget />)
    
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows settings panel when settings button is clicked', async () => {
    render(<PomodoroWidget />)
    
    const settingsButton = screen.getByText('Settings')
    fireEvent.click(settingsButton)

    expect(screen.getByText('Work Duration (minutes)')).toBeInTheDocument()
  })

  it('toggles settings visibility', async () => {
    render(<PomodoroWidget />)
    
    const settingsButton = screen.getByText('Settings')
    fireEvent.click(settingsButton)
    expect(screen.getByText('Hide Settings')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Hide Settings'))
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
})
