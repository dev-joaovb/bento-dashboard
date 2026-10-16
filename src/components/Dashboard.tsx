import { useState, useCallback } from 'react'
import { useDashboardStore } from '../store/dashboardStore'
import { requestNotificationPermission } from '../utils/notifications'
import { ThemeToggle } from './ThemeToggle'
import { WIDGET_REGISTRY, getWidgetComponent, getWidgetSizeClasses, AVAILABLE_WIDGETS } from './WidgetRegistry'
import { Plus, X, Settings, LayoutGrid, Grid3X3 } from 'lucide-react'
import type { WidgetConfig, WidgetType, WidgetSize } from '../types'

function WidgetWrapper({ 
  widget, 
  onRemove 
}: { 
  widget: WidgetConfig
  onRemove: (id: string) => void 
}) {
  const [isHovered, setIsHovered] = useState(false)
  const WidgetComponent = getWidgetComponent(widget.type)
  const sizeClasses = getWidgetSizeClasses(widget.size)

  if (!WidgetComponent) {
    return (
      <div className={`${sizeClasses} widget-card p-4 flex items-center justify-center`}>
        <p className="text-gray-400">Unknown widget: {widget.type}</p>
      </div>
    )
  }

  return (
    <div 
      className={`${sizeClasses} relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <WidgetComponent />
      {isHovered && (
        <button
          onClick={() => onRemove(widget.id)}
          className="absolute top-2 right-2 p-1 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
          aria-label={`Remove ${WIDGET_REGISTRY[widget.type]?.name} widget`}
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      )}
    </div>
  )
}

function AddWidgetModal({ 
  isOpen, 
  onClose, 
  onAdd 
}: { 
  isOpen: boolean
  onClose: () => void
  onAdd: (type: WidgetType, size: WidgetSize) => void 
}) {
  const [selectedType, setSelectedType] = useState<WidgetType | null>(null)
  const [selectedSize, setSelectedSize] = useState<WidgetSize>('medium')

  const handleAdd = () => {
    if (!selectedType) return
    onAdd(selectedType, selectedSize)
    setSelectedType(null)
    setSelectedSize('medium')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-widget-title"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 id="add-widget-title" className="text-lg font-semibold">Add Widget</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Widget Type</label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_WIDGETS.map((widget) => (
                <button
                  key={widget.id}
                  onClick={() => setSelectedType(widget.id)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    selectedType === widget.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <p className="font-medium text-sm">{widget.name}</p>
                  <p className="text-xs text-gray-500">{widget.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm capitalize transition-colors ${
                    selectedSize === size
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedType}
            className="btn-primary disabled:opacity-50"
          >
            Add Widget
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingsPanel({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const {
    preferences,
    setUserName,
    toggleAnimations,
    toggleNotifications,
  } = useDashboardStore()
  const [notificationMessage, setNotificationMessage] = useState('')

  const handleNotificationsChange = async (enabled: boolean) => {
    setNotificationMessage('')

    if (!enabled) {
      toggleNotifications()
      setNotificationMessage('Notifications disabled.')
      return
    }

    const permission = await requestNotificationPermission()

    if (permission === 'granted') {
      if (!preferences.notificationsEnabled) {
        toggleNotifications()
      }
      setNotificationMessage('Notifications enabled.')
    } else if (permission === 'unsupported') {
      setNotificationMessage('Notifications are not supported by this browser.')
    } else {
      setNotificationMessage('Permission denied. Enable notifications in your browser settings.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 id="settings-title" className="text-lg font-semibold">Settings</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="user-name" className="block text-sm font-medium mb-2">
              Display Name
            </label>
            <input
              id="user-name"
              type="text"
              value={preferences.userName}
              onChange={(e) => setUserName(e.target.value)}
              className="input-field"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <ThemeToggle />
          </div>

          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={preferences.animationsEnabled}
                onChange={toggleAnimations}
                className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm">Enable animations</span>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={preferences.notificationsEnabled}
                onChange={(event) => void handleNotificationsChange(event.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm">Enable notifications</span>
            </label>
            <p className="mt-1 ml-7 text-xs text-gray-500 dark:text-gray-400">
              Receive reminders for Pomodoro sessions and tasks.
            </p>
            {notificationMessage && (
              <p role="status" className="mt-2 ml-7 text-xs text-gray-500 dark:text-gray-400">
                {notificationMessage}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const { widgets, preferences, addWidget, removeWidget } = useDashboardStore()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [layoutMode, setLayoutMode] = useState<'grid' | 'flex'>('grid')

  const handleAddWidget = useCallback((type: WidgetType, size: WidgetSize) => {
    const position = { x: widgets.length % 3, y: Math.floor(widgets.length / 3) }
    addWidget(type, position, size)
  }, [widgets.length, addWidget])

  const handleRemoveWidget = useCallback((id: string) => {
    removeWidget(id)
  }, [removeWidget])

  const gridStyles = layoutMode === 'grid'
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]'
    : 'flex flex-wrap gap-4'

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Bento Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back, {preferences.userName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <button
            onClick={() => setLayoutMode(layoutMode === 'grid' ? 'flex' : 'grid')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={`Switch to ${layoutMode === 'grid' ? 'flex' : 'grid'} layout`}
          >
            {layoutMode === 'grid' ? (
              <Grid3X3 className="w-5 h-5" />
            ) : (
              <LayoutGrid className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Open settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 btn-primary"
            aria-label="Add new widget"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Widget</span>
          </button>
        </div>
      </header>

      <main className={gridStyles}>
        {widgets.map((widget) => (
          <WidgetWrapper
            key={widget.id}
            widget={widget}
            onRemove={handleRemoveWidget}
          />
        ))}

        {widgets.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <LayoutGrid className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold mb-2">No widgets yet</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Add your first widget to get started
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary"
            >
              Add Widget
            </button>
          </div>
        )}
      </main>

      <AddWidgetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddWidget}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}
