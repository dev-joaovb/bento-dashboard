import { ClockWidget } from './widgets/ClockWidget'
import { WeatherWidget } from './widgets/WeatherWidget'
import { NotesWidget } from './widgets/NotesWidget'
import { PomodoroWidget } from './widgets/PomodoroWidget'
import { TasksWidget } from './widgets/TasksWidget'
import { QuoteWidget } from './widgets/QuoteWidget'
import { CalendarWidget } from './widgets/CalendarWidget'
import { SearchWidget } from './widgets/SearchWidget'
import type { WidgetType, WidgetSize } from '../types'

export interface WidgetDefinition {
  id: WidgetType
  name: string
  description: string
  defaultSize: WidgetSize
  component: React.ComponentType
  icon: string
}

export const WIDGET_REGISTRY: Record<WidgetType, WidgetDefinition> = {
  clock: {
    id: 'clock',
    name: 'Clock',
    description: 'Display current time with greeting',
    defaultSize: 'medium',
    component: ClockWidget,
    icon: 'clock',
  },
  weather: {
    id: 'weather',
    name: 'Weather',
    description: 'Current weather conditions',
    defaultSize: 'medium',
    component: WeatherWidget,
    icon: 'cloud',
  },
  notes: {
    id: 'notes',
    name: 'Sticky Notes',
    description: 'Quick notes and reminders',
    defaultSize: 'large',
    component: NotesWidget,
    icon: 'sticky-note',
  },
  pomodoro: {
    id: 'pomodoro',
    name: 'Pomodoro Timer',
    description: 'Focus timer for productivity',
    defaultSize: 'small',
    component: PomodoroWidget,
    icon: 'timer',
  },
  tasks: {
    id: 'tasks',
    name: 'Tasks',
    description: 'Todo list with priorities',
    defaultSize: 'medium',
    component: TasksWidget,
    icon: 'check-square',
  },
  quote: {
    id: 'quote',
    name: 'Daily Quote',
    description: 'Inspirational quotes',
    defaultSize: 'medium',
    component: QuoteWidget,
    icon: 'quote',
  },
  calendar: {
    id: 'calendar',
    name: 'Calendar',
    description: 'Monthly calendar view',
    defaultSize: 'medium',
    component: CalendarWidget,
    icon: 'calendar',
  },
  search: {
    id: 'search',
    name: 'Quick Search',
    description: 'Search the web quickly',
    defaultSize: 'medium',
    component: SearchWidget,
    icon: 'search',
  },
}

/**
 * Returns the React component associated with a widget type.
 *
 * @param type - The type of widget to retrieve.
 * @returns The widget component, or undefined if the type is not registered.
 */
export const getWidgetComponent = (type: WidgetType) => {
  return WIDGET_REGISTRY[type]?.component
}

/**
 * Returns the Tailwind CSS classes for a widget size.
 *
 * @param size - The size of the widget.
 * @returns The CSS classes used to define the widget's grid dimensions.
 */
export const getWidgetSizeClasses = (size: WidgetSize) => {
  const sizeClasses: Record<WidgetSize, string> = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 row-span-2',
    large: 'col-span-2 row-span-2',
  }
  return sizeClasses[size]
}

export const AVAILABLE_WIDGETS = Object.values(WIDGET_REGISTRY)
