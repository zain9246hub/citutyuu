// Utility functions for notification management

export const NOTIFICATION_STORAGE_KEYS = {
  NEW_DEALS: 'notifiedNewDeals',
  EXPIRING_DEALS: 'notifiedExpiringDeals',
  PRICE_DROPS: 'notifiedPriceDrops',
  SETTINGS: 'dealNotificationSettings',
  NOTIFICATIONS: 'dealNotifications'
} as const;

export const MAX_STORED_NOTIFICATIONS = 50;

/**
 * Get notified items from localStorage with error handling
 */
export const getNotifiedItems = (key: string): number[] => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn(`Failed to load notification data from ${key}:`, error);
    return [];
  }
};

/**
 * Store notified items to localStorage with size limit
 */
export const setNotifiedItems = (key: string, items: number[]): void => {
  try {
    const limitedItems = items.slice(-MAX_STORED_NOTIFICATIONS);
    localStorage.setItem(key, JSON.stringify(limitedItems));
  } catch (error) {
    console.warn(`Failed to save notification data to ${key}:`, error);
  }
};

/**
 * Add new items to notified list
 */
export const addToNotifiedList = (key: string, newItems: number[]): void => {
  if (newItems.length === 0) return;
  
  const existing = getNotifiedItems(key);
  const updated = [...existing, ...newItems];
  setNotifiedItems(key, updated);
};

/**
 * Check if an item has been notified about
 */
export const isAlreadyNotified = (key: string, itemId: number): boolean => {
  const notified = getNotifiedItems(key);
  return notified.includes(itemId);
};

/**
 * Clean up old notification data
 */
export const cleanupNotificationStorage = (): void => {
  try {
    Object.values(NOTIFICATION_STORAGE_KEYS).forEach(key => {
      const items = getNotifiedItems(key);
      if (items.length > MAX_STORED_NOTIFICATIONS) {
        setNotifiedItems(key, items);
      }
    });
  } catch (error) {
    console.warn('Failed to cleanup notification storage:', error);
  }
};

/**
 * Debounce function for notification checks
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};