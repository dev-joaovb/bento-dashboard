import { useState, useEffect, useRef } from 'react'
import { useDashboardStore } from '../../store/dashboardStore'
import { showNotification } from '../../utils/notifications'
import { Plus, Trash2, Check, AlertCircle } from 'lucide-react'
import { format, isToday, isTomorrow, isPast } from 'date-fns'

type Priority = 'low' | 'medium' | 'high'

const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-red-500',
}

const PRIORITY_BG: Record<Priority, string> = {
  low: 'bg-green-100 dark:bg-green-900/30',
  medium: 'bg-yellow-100 dark:bg-yellow-900/30',
  high: 'bg-red-100 dark:bg-red-900/30',
}

export function TasksWidget() {
  const {
    tasks,
    preferences,
    addTask,
    toggleTask,
    deleteTask,
    updateTaskPriority,
  } = useDashboardStore()
  const notifiedTaskKeys = useRef(new Set<string>())
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [isAddingTask, setIsAddingTask] = useState(false)

  useEffect(() => {
    if (!preferences.notificationsEnabled) return

    const checkDueTasks = () => {
      const now = new Date()
      const today = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
      ].join('-')

      tasks.forEach((task) => {
        if (task.completed || !task.dueDate) return

        const dueDate = new Date(task.dueDate)
        if (Number.isNaN(dueDate.getTime())) return

        const dueKey = dueDate.toISOString().slice(0, 10)
        if (dueKey > today) return

        const reminderKey = `${task.id}-${dueKey}-${today}`
        if (notifiedTaskKeys.current.has(reminderKey)) return

        const overdue = dueKey < today
        const notification = showNotification(
          overdue ? 'Overdue task' : 'Task due today',
          {
            body: overdue
              ? `"${task.title}" is overdue.`
              : `"${task.title}" is due today.`,
          },
        )

        if (notification) {
          notifiedTaskKeys.current.add(reminderKey)
        }
      })
    }

    checkDueTasks()
    const intervalId = setInterval(checkDueTasks, 60_000)

    return () => clearInterval(intervalId)
  }, [tasks, preferences.notificationsEnabled])

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return
    
    const dueDate = newTaskDueDate ? new Date(newTaskDueDate) : undefined
    addTask(newTaskTitle.trim(), newTaskPriority, dueDate)
    setNewTaskTitle('')
    setNewTaskPriority('medium')
    setNewTaskDueDate('')
    setIsAddingTask(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask()
    }
    if (e.key === 'Escape') {
      setIsAddingTask(false)
    }
  }

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'MMM d')
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const activeTasksCount = tasks.filter((t) => !t.completed).length

  return (
    <div className="widget-card p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Tasks</h2>
          <p className="text-xs text-gray-500">
            {activeTasksCount} active task{activeTasksCount !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setIsAddingTask(true)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Add new task"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {isAddingTask && (
        <div className="mb-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What needs to be done?"
            className="input-field text-sm mb-2"
            autoFocus
          />
          <div className="flex gap-2 mb-2">
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
              className="input-field text-xs"
              aria-label="Task priority"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="input-field text-xs"
              aria-label="Due date"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAddingTask(false)}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTask}
              disabled={!newTaskTitle.trim()}
              className="btn-primary text-xs disabled:opacity-50"
            >
              Add Task
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-2 py-1 rounded ${
              filter === f
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {sortedTasks.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">
            {filter === 'completed' 
              ? 'No completed tasks yet' 
              : 'No tasks yet. Click + to add one!'}
          </p>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 rounded-lg flex items-start gap-3 ${
                task.completed 
                  ? 'bg-gray-50 dark:bg-gray-800/50 opacity-60' 
                  : PRIORITY_BG[task.priority]
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  task.completed
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                }`}
                aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {task.completed && <Check className="w-3 h-3 text-white" />}
              </button>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm ${
                    task.completed 
                      ? 'line-through text-gray-400' 
                      : 'text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs ${PRIORITY_COLORS[task.priority]}`}>
                    {task.priority}
                  </span>
                  {task.dueDate && (
                    <span className={`text-xs flex items-center gap-1 ${
                      isPast(new Date(task.dueDate)) && !task.completed
                        ? 'text-red-500'
                        : 'text-gray-400'
                    }`}>
                      {isPast(new Date(task.dueDate)) && !task.completed && (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {formatDueDate(new Date(task.dueDate))}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <select
                  value={task.priority}
                  onChange={(e) => updateTaskPriority(task.id, e.target.value as Priority)}
                  className="text-xs bg-transparent border-none outline-none cursor-pointer"
                  aria-label="Change priority"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
