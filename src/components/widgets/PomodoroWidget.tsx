import { useState, useEffect, useRef } from 'react'
import { useDashboardStore } from '../../store/dashboardStore'
import { showNotification } from '../../utils/notifications'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'

const POMODORO_SETTINGS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

const MODE_LABELS = {
  work: 'Focus Time',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
}

export function PomodoroWidget() {
  const {
    pomodoro,
    preferences,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    tickPomodoro,
    skipPomodoroPhase,
  } = useDashboardStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pomodoroRef = useRef(pomodoro)
  const notificationsEnabledRef = useRef(preferences.notificationsEnabled)

  useEffect(() => {
    pomodoroRef.current = pomodoro
    notificationsEnabledRef.current = preferences.notificationsEnabled
  }, [pomodoro, preferences.notificationsEnabled])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [customWorkDuration, setCustomWorkDuration] = useState(25)

  useEffect(() => {
    if (pomodoro.isRunning) {
      intervalRef.current = setInterval(() => {
        const currentPomodoro = pomodoroRef.current
        const notificationsEnabled = notificationsEnabledRef.current

        if (currentPomodoro.isRunning && currentPomodoro.timeLeft <= 1) {
          if (notificationsEnabled) {
            const isWorkSession = currentPomodoro.mode === 'work'
            showNotification(
              isWorkSession ? 'Focus session complete' : 'Break complete',
              {
                body: isWorkSession
                  ? 'Great work! Time for a break.'
                  : 'Your break is over. Ready to focus again?',
              },
            )
          }
        }

        tickPomodoro()
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [pomodoro.isRunning, tickPomodoro])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const calculateProgress = () => {
    const totalTime = POMODORO_SETTINGS[pomodoro.mode]
    const elapsed = totalTime - pomodoro.timeLeft
    return (elapsed / totalTime) * 100
  }

  const handleToggle = () => {
    if (pomodoro.isRunning) {
      pausePomodoro()
    } else {
      startPomodoro()
    }
  }

  const progress = calculateProgress()
  const circumference = 2 * Math.PI * 45

  return (
    <div className="widget-card p-6 h-full flex flex-col items-center justify-center">
      <h2 className="text-lg font-semibold mb-2">{MODE_LABELS[pomodoro.mode]}</h2>
      
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className="text-primary-500 transition-all duration-1000"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: circumference - (progress / 100) * circumference,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold tabular-nums">
            {formatTime(pomodoro.timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleToggle}
          className="p-3 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
          aria-label={pomodoro.isRunning ? 'Pause timer' : 'Start timer'}
        >
          {pomodoro.isRunning ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={resetPomodoro}
          className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={skipPomodoroPhase}
          className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Skip to next phase"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span>Sessions completed:</span>
        <span className="font-semibold">{pomodoro.sessionsCompleted}</span>
      </div>

      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="mt-3 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        {isSettingsOpen ? 'Hide Settings' : 'Settings'}
      </button>

      {isSettingsOpen && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <label className="block text-xs text-gray-500 mb-1">
            Work Duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={customWorkDuration}
            onChange={(e) => setCustomWorkDuration(parseInt(e.target.value) || 25)}
            className="input-field text-sm w-20"
          />
          <button
            onClick={() => {
              pausePomodoro()
            }}
            className="ml-2 text-xs text-primary-500 hover:text-primary-600"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}
