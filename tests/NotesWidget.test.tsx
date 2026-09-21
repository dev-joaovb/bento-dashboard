import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useDashboardStore } from '../src/store/dashboardStore'
import { NotesWidget } from '../src/components/widgets/NotesWidget'

vi.mock('../src/store/dashboardStore', () => ({
  useDashboardStore: vi.fn(),
}))

describe('NotesWidget', () => {
  const mockAddNote = vi.fn()
  const mockUpdateNote = vi.fn()
  const mockDeleteNote = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      notes: [],
      addNote: mockAddNote,
      updateNote: mockUpdateNote,
      deleteNote: mockDeleteNote,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state when no notes exist', () => {
    render(<NotesWidget />)
    
    expect(screen.getByText('No notes yet. Click + to add one!')).toBeInTheDocument()
  })

  it('opens add note form when plus button is clicked', async () => {
    render(<NotesWidget />)
    
    const addButton = screen.getByLabelText('Add new note')
    await userEvent.click(addButton)

    expect(screen.getByPlaceholderText('Write your note...')).toBeInTheDocument()
  })

  it('adds a new note when form is submitted', async () => {
    render(<NotesWidget />)
    
    const addButton = screen.getByLabelText('Add new note')
    await userEvent.click(addButton)

    const textarea = screen.getByPlaceholderText('Write your note...')
    await userEvent.type(textarea, 'My new note')

    const submitButton = screen.getByText('Add')
    await userEvent.click(submitButton)

    expect(mockAddNote).toHaveBeenCalledWith('My new note', expect.any(String))
  })

  it('preserves safe special characters when adding a note', async () => {
    render(<NotesWidget />)

    const addButton = screen.getByLabelText('Add new note')
    await userEvent.click(addButton)

    const textarea = screen.getByPlaceholderText('Write your note...')
    await userEvent.type(textarea, '5 > 3 & 2 < 4')

    const submitButton = screen.getByText('Add')
    await userEvent.click(submitButton)

    expect(mockAddNote).toHaveBeenCalledWith(
      '5 > 3 & 2 < 4',
      expect.any(String)
    )
  })

  it('does not add empty notes', async () => {
    render(<NotesWidget />)
    
    const addButton = screen.getByLabelText('Add new note')
    await userEvent.click(addButton)

    const submitButton = screen.getByText('Add')
    await userEvent.click(submitButton)

    expect(mockAddNote).not.toHaveBeenCalled()
  })

  it('displays existing notes', () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      notes: [
        { id: '1', content: 'Test note 1', color: '#fef3c7', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', content: 'Test note 2', color: '#dbeafe', createdAt: new Date(), updatedAt: new Date() },
      ],
      addNote: mockAddNote,
      updateNote: mockUpdateNote,
      deleteNote: mockDeleteNote,
    })

    render(<NotesWidget />)
    
    expect(screen.getByText('Test note 1')).toBeInTheDocument()
    expect(screen.getByText('Test note 2')).toBeInTheDocument()
  })

  it('deletes a note when delete button is clicked', async () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      notes: [
        { id: '1', content: 'Test note', color: '#fef3c7', createdAt: new Date(), updatedAt: new Date() },
      ],
      addNote: mockAddNote,
      updateNote: mockUpdateNote,
      deleteNote: mockDeleteNote,
    })

    render(<NotesWidget />)
    
    const deleteButton = screen.getByLabelText('Delete note')
    await userEvent.click(deleteButton)

    expect(mockDeleteNote).toHaveBeenCalledWith('1')
  })

  it('enters edit mode when edit button is clicked', async () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      notes: [
        { id: '1', content: 'Test note', color: '#fef3c7', createdAt: new Date(), updatedAt: new Date() },
      ],
      addNote: mockAddNote,
      updateNote: mockUpdateNote,
      deleteNote: mockDeleteNote,
    })

    render(<NotesWidget />)
    
    const editButton = screen.getByLabelText('Edit note')
    await userEvent.click(editButton)

    expect(screen.getByDisplayValue('Test note')).toBeInTheDocument()
  })

  it('cancels add note form when Escape is pressed', async () => {
    render(<NotesWidget />)
    
    const addButton = screen.getByLabelText('Add new note')
    await userEvent.click(addButton)

    const textarea = screen.getByPlaceholderText('Write your note...')
    fireEvent.keyDown(textarea, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Write your note...')).not.toBeInTheDocument()
    })
  })

  it('selects different note colors', async () => {
    render(<NotesWidget />)
    
    const addButton = screen.getByLabelText('Add new note')
    await userEvent.click(addButton)

    const colorButtons = screen.getAllByRole('button').filter(btn => 
      btn.getAttribute('aria-label')?.includes('Select color')
    )

    await userEvent.click(colorButtons[2])

    expect(colorButtons[2]).toHaveClass('border-primary-500')
  })
})
