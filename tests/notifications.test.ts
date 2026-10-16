import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  isNotificationSupported,
  requestNotificationPermission,
  showNotification,
} from '../src/utils/notifications'

describe('notification utilities', () => {
  let permission: NotificationPermission
  let requestPermission: ReturnType<typeof vi.fn>
  let notificationMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    permission = 'default'
    requestPermission = vi.fn().mockImplementation(
      () => Promise.resolve(permission),
    )
    notificationMock = vi.fn()

    class MockNotification {
      static get permission() {
        return permission
      }

      static requestPermission = requestPermission

      constructor(title: string, options?: NotificationOptions) {
        notificationMock(title, options)
      }
    }

    Object.defineProperty(window, 'Notification', {
      configurable: true,
      writable: true,
      value: MockNotification,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('detects when browser notifications are supported', () => {
    expect(isNotificationSupported()).toBe(true)
  })

  it('requests permission when permission is still default', async () => {
    requestPermission.mockImplementationOnce(() => {
      permission = 'granted'
      return Promise.resolve('granted')
    })

    await expect(requestNotificationPermission()).resolves.toBe('granted')
    expect(requestPermission).toHaveBeenCalledOnce()
  })


  it('does not request permission again when already decided', async () => {
    permission = 'denied'

    await expect(requestNotificationPermission()).resolves.toBe('denied')
    expect(requestPermission).not.toHaveBeenCalled()
  })

  it('returns the current permission if the request rejects', async () => {
    requestPermission.mockRejectedValueOnce(new Error('Permission error'))

    await expect(requestNotificationPermission()).resolves.toBe('default')
  })

  it('shows a notification when permission is granted', () => {
    permission = 'granted'

    const result = showNotification('Test notification', {
      body: 'Test body',
    })

    expect(notificationMock).toHaveBeenCalledWith('Test notification', {
      body: 'Test body',
    })
    expect(result).toBeInstanceOf(window.Notification)
  })

  it('does not show a notification when permission is denied', () => {
    permission = 'denied'

    expect(showNotification('Test notification')).toBeNull()
    expect(notificationMock).not.toHaveBeenCalled()
  })

  it('handles notification constructor errors gracefully', () => {
    permission = 'granted'

    class BrokenNotification {
      static permission = 'granted' as NotificationPermission

      constructor() {
        throw new Error('Notifications unavailable')
      }
    }

    Object.defineProperty(window, 'Notification', {
      configurable: true,
      value: BrokenNotification,
    })

    expect(showNotification('Test notification')).toBeNull()
  })

  it('returns unsupported when the Notification API is unavailable', async () => {
    Object.defineProperty(window, 'Notification', {
      configurable: true,
      value: undefined,
    })

    expect(isNotificationSupported()).toBe(false)
    await expect(requestNotificationPermission()).resolves.toBe('unsupported')
    expect(showNotification('Test notification')).toBeNull()
  })
})
