// Luxury Notification System
export type NotificationType = 'success' | 'error' | 'warning' | 'info'
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export interface Notification {
  id: string | number
  type: NotificationType
  title: string
  message: string
  duration?: number
  position?: NotificationPosition
  icon?: string // Professional icon name (e.g., 'check-circle', 'alert-circle')
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ConfirmationOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: NotificationType
}

class LuxuryNotification {
  private notifications: Notification[] = []
  private subscribers: ((notifications: Notification[]) => void)[] = []
  private nextId = 0

  // Professional icon mapping (can be used in template)
  private static iconMap: Record<NotificationType, string> = {
    success: 'check-circle',
    error: 'alert-circle',
    warning: 'alert-triangle',
    info: 'info'
  }

  // Show a luxury notification
  show(notification: Omit<Notification, 'id'>): string {
    const id = ++this.nextId
    const fullNotification: Notification = {
      id,
      position: 'top-right',
      duration: 5000,
      ...notification,
      // Set default icon based on type if not provided
      icon: notification.icon || LuxuryNotification.iconMap[notification.type]
    }

    this.notifications.push(fullNotification)
    this.notifySubscribers()

    // Auto-remove after duration
    if (fullNotification.duration && fullNotification.duration > 0) {
      setTimeout(() => {
        this.remove(id)
      }, fullNotification.duration)
    }

    return id.toString()
  }

  // Remove a notification
  remove(id: string | number): void {
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.notifySubscribers()
  }

  // Clear all notifications
  clear(): void {
    this.notifications = []
    this.notifySubscribers()
  }

  // Clear by type
  clearByType(type: NotificationType): void {
    this.notifications = this.notifications.filter(n => n.type !== type)
    this.notifySubscribers()
  }

  // Get all notifications
  getAll(): Notification[] {
    return [...this.notifications]
  }

  // Subscribe to notifications
  subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.subscribers.push(callback)
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback)
    }
  }

  // Notify subscribers
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.getAll()))
  }

  // Luxury notification presets
  success(title: string, message: string, options?: Partial<Notification>): string {
    return this.show({
      type: 'success',
      title,
      message,
      icon: LuxuryNotification.iconMap.success,
      ...options
    })
  }

  error(title: string, message: string, options?: Partial<Notification>): string {
    return this.show({
      type: 'error',
      title,
      message,
      icon: LuxuryNotification.iconMap.error,
      ...options
    })
  }

  warning(title: string, message: string, options?: Partial<Notification>): string {
    return this.show({
      type: 'warning',
      title,
      message,
      icon: LuxuryNotification.iconMap.warning,
      ...options
    })
  }

  info(title: string, message: string, options?: Partial<Notification>): string {
    return this.show({
      type: 'info',
      title,
      message,
      icon: LuxuryNotification.iconMap.info,
      ...options
    })
  }

  // Luxury confirmation dialog
  async confirm(options: ConfirmationOptions): Promise<boolean> {
    return new Promise((resolve) => {
      const confirmEvent = new CustomEvent('luxury-confirmation', {
        detail: {
          ...options,
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false)
        }
      })
      window.dispatchEvent(confirmEvent)
    })
  }

  // Quick toast notification
  toast(message: string, type: NotificationType = 'info', duration: number = 3000): string {
    return this.show({
      type,
      title: '',
      message,
      duration,
      icon: LuxuryNotification.iconMap[type]
    })
  }
}

// Export singleton instance
export const luxuryNotification = new LuxuryNotification()

// Convenience functions
export const showNotification = (options: Omit<Notification, 'id'>) => 
  luxuryNotification.show(options)

export const showSuccess = (title: string, message: string, options?: Partial<Notification>) =>
  luxuryNotification.success(title, message, options)

export const showError = (title: string, message: string, options?: Partial<Notification>) =>
  luxuryNotification.error(title, message, options)

export const showWarning = (title: string, message: string, options?: Partial<Notification>) =>
  luxuryNotification.warning(title, message, options)

export const showInfo = (title: string, message: string, options?: Partial<Notification>) =>
  luxuryNotification.info(title, message, options)

export const showConfirmation = (options: ConfirmationOptions) =>
  luxuryNotification.confirm(options)

export const showToast = (message: string, type?: NotificationType, duration?: number) =>
  luxuryNotification.toast(message, type, duration)

// Quick notification for cart actions
export const cartNotification = {
  added: (productName: string) => 
    showSuccess('Added to Cart', `${productName} added to your luxury collection`, {
      icon: 'shopping-bag',
      duration: 3000
    }),
  
  removed: (productName: string) =>
    showInfo('Removed from Cart', `${productName} removed from your collection`, {
      icon: 'trash-2',
      duration: 3000
    }),
  
  updated: (productName: string, quantity: number) =>
    showSuccess('Quantity Updated', `${productName} quantity set to ${quantity}`, {
      icon: 'refresh-cw',
      duration: 3000
    }),
  
  cleared: () =>
    showSuccess('Cart Cleared', 'Your luxury cart has been cleared', {
      icon: 'trash',
      duration: 3000
    })
}

// Quick notification for auth actions
export const authNotification = {
  loggedIn: (userName: string) =>
    showSuccess('Welcome Back', `Welcome ${userName}`, {
      icon: 'log-in',
      duration: 4000
    }),
  
  loggedOut: () =>
    showInfo('Logged Out', 'Successfully logged out', {
      icon: 'log-out',
      duration: 3000
    }),
  
  error: (message: string) =>
    showError('Authentication Error', message, {
      icon: 'lock',
      duration: 5000
    })
}

// Quick notification for product actions
export const productNotification = {
  added: (productName: string) =>
    showSuccess('Product Added', `${productName} added successfully`, {
      icon: 'package-plus',
      duration: 3000
    }),
  
  updated: (productName: string) =>
    showSuccess('Product Updated', `${productName} updated successfully`, {
      icon: 'edit',
      duration: 3000
    }),
  
  deleted: (productName: string) =>
    showSuccess('Product Deleted', `${productName} removed successfully`, {
      icon: 'trash-2',
      duration: 3000
    }),
  
  error: (message: string) =>
    showError('Product Error', message, {
      icon: 'alert-circle',
      duration: 5000
    })
}