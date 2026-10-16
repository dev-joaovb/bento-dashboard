import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ClockWidget } from '../src/components/widgets/ClockWidget'

vi.mock('../src/store/dashboardStore', () => ({
  useDashboardStore: vi.fn(() => ({
    preferences: { theme: 'light' },
  })),
}))

describe('ClockWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders current time', () => {
    const date = new Date('2024-01-15T10:30:00')
    vi.setSystemTime(date)

    render(<ClockWidget />)
    
    expect(screen.getByText('10:30:00')).toBeInTheDocument()
  })

  it('displays correct greeting based on time of day', () => {
    const morningDate = new Date('2024-01-15T08:00:00')
    vi.setSystemTime(morningDate)

    render(<ClockWidget />)
    
    expect(screen.getByText('Good Morning')).toBeInTheDocument()
  })

  it('displays afternoon greeting after 12pm', () => {
    const afternoonDate = new Date('2024-01-15T14:00:00')
    vi.setSystemTime(afternoonDate)

    render(<ClockWidget />)
    
    expect(screen.getByText('Good Afternoon')).toBeInTheDocument()
  })

  it('displays evening greeting after 6pm', () => {
    const eveningDate = new Date('2024-01-15T19:00:00')
    vi.setSystemTime(eveningDate)

    render(<ClockWidget />)
    
    expect(screen.getByText('Good Evening')).toBeInTheDocument()
  })

  it('toggles between 12-hour and 24-hour format', async () => {
    const date = new Date('2024-01-15T14:30:00')
    vi.setSystemTime(date)

    render(<ClockWidget />)
    
    expect(screen.getByText('14:30:00')).toBeInTheDocument()

    const toggleButton = screen.getByText('Switch to 12-hour')
    fireEvent.click(toggleButton)

    expect(screen.getByText('02:30:00 PM')).toBeInTheDocument()
  })

  it('updates time every second', () => {
    const date = new Date('2024-01-15T10:30:00')
    vi.setSystemTime(date)

    render(<ClockWidget />)
    
    expect(screen.getByText('10:30:00')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    expect(screen.getByText('10:30:01')).toBeInTheDocument()
  })

  it('displays formatted date', () => {
    const date = new Date('2024-01-15T10:30:00')
    vi.setSystemTime(date)

    render(<ClockWidget />)
    
    expect(screen.getByText(/Monday, January 15th, 2024/)).toBeInTheDocument()
  })
})
