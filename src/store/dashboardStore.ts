import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { 
  WidgetConfig, 
  Note, 
  Task, 
  PomodoroState, 
  WeatherData, 
  UserPreferences,
  WidgetType,
  Position,
  WidgetSize
} from '../types'

interface DashboardStore {
  widgets: WidgetConfig[]
  notes: Note[]
  tasks: Task[]
  pomodoro: PomodoroState
  weather: WeatherData | null
  preferences: UserPreferences
  
  /**
   * Adds a new widget to the dashboard.
   *
   * @param type - The type of widget to add.
   * @param position - The position of the widget in the dashboard grid.
   * @param size - The size of the widget.
   * @returns void
   */
  addWidget: (type: WidgetType, position: Position, size: WidgetSize) => void

  /**
   * Removes a widget from the dashboard.
   *
   * @param id - The unique identifier of the widget to remove.
   * @returns void
   */
  removeWidget: (id: string) => void

  /**
   * Updates the position of a widget.
   *
   * @param id - The unique identifier of the widget.
   * @param position - The new position in the dashboard grid.
   * @returns void
   */
  updateWidgetPosition: (id: string, position: Position) => void

  /**
   * Updates the size of a widget.
   *
   * @param id - The unique identifier of the widget.
   * @param size - The new size of the widget.
   * @returns void
   */
  updateWidgetSize: (id: string, size: WidgetSize) => void
  
  /**
   * Adds a new note to the dashboard.
   *
   * @param content - The content of the note.
   * @param color - The color assigned to the note.
   * @returns void
   */
  addNote: (content: string, color: string) => void

  /**
   * Updates the content of an existing note.
   *
   * @param id - The unique identifier of the note.
   * @param content - The new content of the note.
   * @returns void
   */
  updateNote: (id: string, content: string) => void

  /**
   * Removes a note from the dashboard.
   *
   * @param id - The unique identifier of the note to remove.
   * @returns void
   */
  deleteNote: (id: string) => void
  
  /**
   * Adds a new task to the dashboard.
   *
   * @param title - The title of the task.
   * @param priority - The priority level of the task.
   * @param dueDate - The optional due date of the task.
   * @returns void
   */
  addTask: (title: string, priority: Task['priority'], dueDate?: Date) => void

  /**
   * Toggles the completion status of a task.
   *
   * @param id - The unique identifier of the task.
   * @returns void
   */
  toggleTask: (id: string) => void

  /**
   * Removes a task from the dashboard.
   *
   * @param id - The unique identifier of the task to remove.
   * @returns void
   */
  deleteTask: (id: string) => void

  /**
   * Updates the priority of an existing task.
   *
   * @param id - The unique identifier of the task.
   * @param priority - The new priority level of the task.
   * @returns void
   */
  updateTaskPriority: (id: string, priority: Task['priority']) => void
  
  /**
   * Starts the Pomodoro timer.
   *
   * @returns void
   */
  startPomodoro: () => void

  /**
   * Pauses the Pomodoro timer.
   *
   * @returns void
   */
  pausePomodoro: () => void

  /**
   * Resets the Pomodoro timer to the default work phase.
   *
   * @returns void
   */
  resetPomodoro: () => void

  /**
   * Advances the Pomodoro timer by one second and handles phase transitions.
   *
   * @returns void
   */
  tickPomodoro: () => void

  /**
   * Skips the current Pomodoro phase and advances to the next phase.
   *
   * @returns void
   */
  skipPomodoroPhase: () => void
  
  /**
   * Updates the current weather data.
   *
   * @param data - The weather data to store.
   * @returns void
   */
  setWeather: (data: WeatherData) => void

  /**
   * Updates the dashboard theme.
   *
   * @param theme - The theme to apply.
   * @returns void
   */
  setTheme: (theme: UserPreferences['theme']) => void

  /**
   * Updates the user's display name.
   *
   * @param name - The new user name.
   * @returns void
   */
  setUserName: (name: string) => void

  /**
   * Toggles dashboard animations on or off.
   *
   * @returns void
   */
  toggleAnimations: () => void
}

const defaultWidgets: WidgetConfig[] = [
  { id: uuidv4(), type: 'clock', position: { x: 0, y: 0 }, size: 'medium' },
  { id: uuidv4(), type: 'weather', position: { x: 1, y: 0 }, size: 'medium' },
  { id: uuidv4(), type: 'notes', position: { x: 0, y: 1 }, size: 'large' },
  { id: uuidv4(), type: 'pomodoro', position: { x: 2, y: 0 }, size: 'small' },
  { id: uuidv4(), type: 'tasks', position: { x: 2, y: 1 }, size: 'medium' },
]

const defaultPreferences: UserPreferences = {
  theme: 'system',
  userName: 'User',
  dashboardLayout: 'grid',
  animationsEnabled: true,
}

const defaultPomodoro: PomodoroState = {
  timeLeft: 25 * 60,
  isRunning: false,
  mode: 'work',
  sessionsCompleted: 0,
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      widgets: defaultWidgets,
      notes: [],
      tasks: [],
      pomodoro: defaultPomodoro,
      weather: null,
      preferences: defaultPreferences,

      addWidget: (type, position, size) => {
        const newWidget: WidgetConfig = {
          id: uuidv4(),
          type,
          position,
          size,
        }
        set((state) => ({
          widgets: [...state.widgets, newWidget],
        }))
      },

      removeWidget: (id) => {
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        }))
      },

      updateWidgetPosition: (id, position) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, position } : w
          ),
        }))
      },

      updateWidgetSize: (id, size) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, size } : w
          ),
        }))
      },

      addNote: (content, color) => {
        const newNote: Note = {
          id: uuidv4(),
          content,
          color,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          notes: [...state.notes, newNote],
        }))
      },

      updateNote: (id, content) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, content, updatedAt: new Date() } : n
          ),
        }))
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }))
      },

      addTask: (title, priority, dueDate) => {
        const newTask: Task = {
          id: uuidv4(),
          title,
          completed: false,
          priority,
          dueDate,
          createdAt: new Date(),
        }
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }))
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        }))
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }))
      },

      updateTaskPriority: (id, priority) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, priority } : t
          ),
        }))
      },

      startPomodoro: () => {
        set((state) => ({
          pomodoro: { ...state.pomodoro, isRunning: true },
        }))
      },

      pausePomodoro: () => {
        set((state) => ({
          pomodoro: { ...state.pomodoro, isRunning: false },
        }))
      },

      resetPomodoro: () => {
        const workDuration = 25 * 60
        set((state) => ({
          pomodoro: {
            ...state.pomodoro,
            timeLeft: workDuration,
            isRunning: false,
            mode: 'work',
          },
        }))
      },

      tickPomodoro: () => {
        const state = get()
        if (!state.pomodoro.isRunning) return
        
        const newTimeLeft = state.pomodoro.timeLeft - 1
        
        if (newTimeLeft <= 0) {
          const nextMode = state.pomodoro.mode === 'work' 
            ? (state.pomodoro.sessionsCompleted % 4 === 3 ? 'longBreak' : 'shortBreak')
            : 'work'
          
          const durations = {
            work: 25 * 60,
            shortBreak: 5 * 60,
            longBreak: 15 * 60,
          }
          
          const sessionsCompleted = state.pomodoro.mode === 'work' 
            ? state.pomodoro.sessionsCompleted + 1 
            : state.pomodoro.sessionsCompleted
          
          set({
            pomodoro: {
              ...state.pomodoro,
              timeLeft: durations[nextMode],
              mode: nextMode,
              sessionsCompleted,
              isRunning: false,
            },
          })
        } else {
          set({
            pomodoro: {
              ...state.pomodoro,
              timeLeft: newTimeLeft,
            },
          })
        }
      },

      skipPomodoroPhase: () => {
        const state = get()
        const nextMode = state.pomodoro.mode === 'work' 
          ? (state.pomodoro.sessionsCompleted % 4 === 3 ? 'longBreak' : 'shortBreak')
          : 'work'
        
        const durations = {
          work: 25 * 60,
          shortBreak: 5 * 60,
          longBreak: 15 * 60,
        }
        
        const sessionsCompleted = state.pomodoro.mode === 'work' 
          ? state.pomodoro.sessionsCompleted + 1 
          : state.pomodoro.sessionsCompleted
        
        set({
          pomodoro: {
            ...state.pomodoro,
            timeLeft: durations[nextMode],
            mode: nextMode,
            sessionsCompleted,
            isRunning: false,
          },
        })
      },

      setWeather: (data) => {
        set({ weather: data })
      },

      setTheme: (theme) => {
        set((state) => ({
          preferences: { ...state.preferences, theme },
        }))
      },

      setUserName: (name) => {
        set((state) => ({
          preferences: { ...state.preferences, userName: name },
        }))
      },

      toggleAnimations: () => {
        set((state) => ({
          preferences: { 
            ...state.preferences, 
            animationsEnabled: !state.preferences.animationsEnabled 
          },
        }))
      },
    }),
    {
      name: 'bento-dashboard-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        widgets: state.widgets,
        notes: state.notes,
        tasks: state.tasks,
        pomodoro: state.pomodoro,
        preferences: state.preferences,
      }),
    }
  )
)
