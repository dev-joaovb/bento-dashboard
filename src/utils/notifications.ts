export type NotificationPermissionStatus =
  | NotificationPermission
  | 'unsupported'

export function isNotificationSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    typeof window.Notification === 'function'
  )
}

export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (!isNotificationSupported()) {
    return 'unsupported'
  }

  if (Notification.permission !== 'default') {
    return Notification.permission
  }

  try {
    return await Notification.requestPermission()
  } catch {
    return Notification.permission
  }
}

export function showNotification(
  title: string,
  options?: NotificationOptions,
): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null
  }

  try {
    return new Notification(title, options)
  } catch {
    return null
  }
}
