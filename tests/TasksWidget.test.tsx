import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useDashboardStore } from '../src/store/dashboardStore'
import { TasksWidget } from '../src/components/widgets/TasksWidget'

vi.mock('../src/store/dashboardStore', () => ({
  useDashboardStore: vi.fn(),
}))

describe('TasksWidget', () => {
  const mockAddTask = vi.fn()
  const mockToggleTask = vi.fn()
  const mockDeleteTask = vi.fn()
  const mockUpdateTaskPriority = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      tasks: [],
      addTask: mockAddTask,
      toggleTask: mockToggleTask,
      deleteTask: mockDeleteTask,
      updateTaskPriority: mockUpdateTaskPriority,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state when no tasks exist', () => {
    render(<TasksWidget />)
    
    expect(screen.getByText('No tasks yet. Click + to add one!')).toBeInTheDocument()
  })

  it('displays active task count', () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      tasks: [
        { id: '1', title: 'Task 1', completed: false, priority: 'medium', createdAt: new Date() },
        { id: '2', title: 'Task 2', completed: true, priority: 'low', createdAt: new Date() },
      ],
      addTask: mockAddTask,
      toggleTask: mockToggleTask,
      deleteTask: mockDeleteTask,
      updateTaskPriority: mockUpdateTaskPriority,
    })

    render(<TasksWidget />)
    
    expect(screen.getByText('1 active task')).toBeInTheDocument()
  })

  it('adds a new task when form is submitted', async () => {
    render(<TasksWidget />)
    
    const addButton = screen.getByLabelText('Add new task')
    await userEvent.click(addButton)

    const input = screen.getByPlaceholderText('What needs to be done?')
    await userEvent.type(input, 'New task item')

    const submitButton = screen.getByText('Add Task')
    await userEvent.click(submitButton)

    expect(mockAddTask).toHaveBeenCalledWith('New task item', 'medium', undefined)
  })

  it('adds a task with priority and due date', async () => {
    render(<TasksWidget />)
    
    const addButton = screen.getByLabelText('Add new task')
    await userEvent.click(addButton)

    const input = screen.getByPlaceholderText('What needs to be done?')
    await userEvent.type(input, 'Important task')

    const prioritySelect = screen.getByLabelText('Task priority')
    await userEvent.selectOptions(prioritySelect, 'high')

    const dateInput = screen.getByLabelText('Due date')
    fireEvent.change(dateInput, { target: { value: '2024-12-31' } })

    const submitButton = screen.getByText('Add Task')
    await userEvent.click(submitButton)

    expect(mockAddTask).toHaveBeenCalledWith('Important task', 'high', expect.any(Date))
  })

  it('toggles task completion', async () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      tasks: [
        { id: '1', title: 'Test task', completed: false, priority: 'medium', createdAt: new Date() },
      ],
      addTask: mockAddTask,
      toggleTask: mockToggleTask,
      deleteTask: mockDeleteTask,
      updateTaskPriority: mockUpdateTaskPriority,
    })

    render(<TasksWidget />)
    
    const toggleButton = screen.getByLabelText('Mark as complete')
    await userEvent.click(toggleButton)

    expect(mockToggleTask).toHaveBeenCalledWith('1')
  })

  it('deletes a task', async () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      tasks: [
        { id: '1', title: 'Test task', completed: false, priority: 'medium', createdAt: new Date() },
      ],
      addTask: mockAddTask,
      toggleTask: mockToggleTask,
      deleteTask: mockDeleteTask,
      updateTaskPriority: mockUpdateTaskPriority,
    })

    render(<TasksWidget />)
    
    const deleteButton = screen.getByLabelText('Delete task')
    await userEvent.click(deleteButton)

    expect(mockDeleteTask).toHaveBeenCalledWith('1')
  })

  it('filters tasks by status', async () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      tasks: [
        { id: '1', title: 'Active task', completed: false, priority: 'medium', createdAt: new Date() },
        { id: '2', title: 'Completed task', completed: true, priority: 'low', createdAt: new Date() },
      ],
      addTask: mockAddTask,
      toggleTask: mockToggleTask,
      deleteTask: mockDeleteTask,
      updateTaskPriority: mockUpdateTaskPriority,
    })

    render(<TasksWidget />)
    
    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.getByText('Completed task')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Active'))
    
    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.queryByText('Completed task')).not.toBeInTheDocument()

    await userEvent.click(screen.getByText('Completed'))
    
    expect(screen.queryByText('Active task')).not.toBeInTheDocument()
    expect(screen.getByText('Completed task')).toBeInTheDocument()
  })

  it('displays correct priority colors', () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      tasks: [
        { id: '1', title: 'High priority', completed: false, priority: 'high', createdAt: new Date() },
        { id: '2', title: 'Medium priority', completed: false, priority: 'medium', createdAt: new Date() },
        { id: '3', title: 'Low priority', completed: false, priority: 'low', createdAt: new Date() },
      ],
      addTask: mockAddTask,
      toggleTask: mockToggleTask,
      deleteTask: mockDeleteTask,
      updateTaskPriority: mockUpdateTaskPriority,
    })

    render(<TasksWidget />)
    
    expect(screen.getByText('high')).toBeInTheDocument()
    expect(screen.getByText('medium')).toBeInTheDocument()
    expect(screen.getByText('low')).toBeInTheDocument()
  })

  it('does not add empty tasks', async () => {
    render(<TasksWidget />)
    
    const addButton = screen.getByLabelText('Add new task')
    await userEvent.click(addButton)

    const submitButton = screen.getByText('Add Task')
    await userEvent.click(submitButton)

    expect(mockAddTask).not.toHaveBeenCalled()
  })

  it('does not add tasks with titles longer than 200 characters', async () => {
    render(<TasksWidget />)

    const addButton = screen.getByLabelText('Add new task')
    await userEvent.click(addButton)

    const input = screen.getByPlaceholderText('What needs to be done?')
    await userEvent.type(input, 'a'.repeat(201))

    const submitButton = screen.getByText('Add Task')
    await userEvent.click(submitButton)

    expect(mockAddTask).not.toHaveBeenCalled()
    expect(
      screen.getByText('Task title cannot exceed 200 characters.')
    ).toBeInTheDocument()
  })

  it('shows overdue indicator for past due dates', () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 1)

    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      tasks: [
        { id: '1', title: 'Overdue task', completed: false, priority: 'high', dueDate: pastDate, createdAt: new Date() },
      ],
      addTask: mockAddTask,
      toggleTask: mockToggleTask,
      deleteTask: mockDeleteTask,
      updateTaskPriority: mockUpdateTaskPriority,
    })

    render(<TasksWidget />)
    
    const overdueIcon = document.querySelector('.text-red-500 svg')
    expect(overdueIcon).toBeInTheDocument()
  })
})