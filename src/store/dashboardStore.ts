import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { sanitizeNoteContent } from '../utils/sanitize'
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
  
  addWidget: (type: WidgetType, position: Position, size: WidgetSize) => void
  removeWidget: (id: string) => void
  updateWidgetPosition: (id: string, position: Position) => void
  updateWidgetSize: (id: string, size: WidgetSize) => void
  
  addNote: (content: string, color: string) => void
  updateNote: (id: string, content: string) => void
  deleteNote: (id: string) => void
  
  addTask: (title: string, priority: Task['priority'], dueDate?: Date) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  updateTaskPriority: (id: string, priority: Task['priority']) => void
  
  startPomodoro: () => void
  pausePomodoro: () => void
  resetPomodoro: () => void
  tickPomodoro: () => void
  skipPomodoroPhase: () => void
  
  setWeather: (data: WeatherData) => void
  
  setTheme: (theme: UserPreferences['theme']) => void
  setUserName: (name: string) => void
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
        const sanitizedContent = sanitizeNoteContent(content).trim()

        if (!sanitizedContent) return

        const newNote: Note = {
          id: uuidv4(),
          content: sanitizedContent,
          color,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => ({
          notes: [...state.notes, newNote],
        }))
      },

      updateNote: (id, content) => {
        const sanitizedContent = sanitizeNoteContent(content).trim()

        if (!sanitizedContent) return

        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? { ...n, content: sanitizedContent, updatedAt: new Date() }
              : n
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
