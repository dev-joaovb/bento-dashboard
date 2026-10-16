export type WidgetType = 
  | 'clock'
  | 'weather'
  | 'notes'
  | 'pomodoro'
  | 'tasks'
  | 'quote'
  | 'calendar'
  | 'search';

export type WidgetSize = 'small' | 'medium' | 'large';

export interface Position {
  x: number;
  y: number;
}

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  position: Position;
  size: WidgetSize;
  settings?: Record<string, unknown>;
}

export interface Note {
  id: string;
  content: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
}

export interface PomodoroState {
  timeLeft: number;
  isRunning: boolean;
  mode: 'work' | 'shortBreak' | 'longBreak';
  sessionsCompleted: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  icon: string;
}

export interface Quote {
  text: string;
  author: string;
  category: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemeMode;
  userName: string;
  dashboardLayout: 'grid' | 'flex';
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface DashboardState {
  widgets: WidgetConfig[];
  notes: Note[];
  tasks: Task[];
  pomodoro: PomodoroState;
  weather: WeatherData | null;
  preferences: UserPreferences;
}
