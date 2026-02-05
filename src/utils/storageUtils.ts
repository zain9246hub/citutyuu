// Utility functions for managing localStorage quota

const MAX_BUSINESSES = 3;
const MAX_DEALS = 5;

// Estimate localStorage usage
export const getStorageUsage = (): { used: number; total: number; percentage: number } => {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length * 2; // UTF-16 = 2 bytes per character
    }
  }
  const maxStorage = 5 * 1024 * 1024; // 5MB typical limit
  return {
    used: total,
    total: maxStorage,
    percentage: (total / maxStorage) * 100
  };
};

// Clean up old data to free space
export const cleanupStorage = () => {
  console.log('🧹 Storage cleanup initiated...');
  
  // Clean up old notifications
  try {
    const notifications = localStorage.getItem('dealNotifications');
    if (notifications) {
      const parsed = JSON.parse(notifications);
      if (Array.isArray(parsed) && parsed.length > 50) {
        localStorage.setItem('dealNotifications', JSON.stringify(parsed.slice(-20)));
      }
    }
  } catch (e) {
    localStorage.removeItem('dealNotifications');
  }

  // Limit businesses
  try {
    const businesses = localStorage.getItem('userBusinesses');
    if (businesses) {
      const parsed = JSON.parse(businesses);
      if (Array.isArray(parsed) && parsed.length > MAX_BUSINESSES) {
        localStorage.setItem('userBusinesses', JSON.stringify(parsed.slice(0, MAX_BUSINESSES)));
      }
    }
  } catch (e) {
    console.warn('Error cleaning businesses:', e);
  }

  // Limit deals
  try {
    const deals = localStorage.getItem('userDeals');
    if (deals) {
      const parsed = JSON.parse(deals);
      if (Array.isArray(parsed) && parsed.length > MAX_DEALS) {
        localStorage.setItem('userDeals', JSON.stringify(parsed.slice(0, MAX_DEALS)));
      }
    }
  } catch (e) {
    console.warn('Error cleaning deals:', e);
  }

  // Clean chat messages older than 7 days
  try {
    const chatMessages = localStorage.getItem('chatMessages');
    if (chatMessages) {
      const parsed = JSON.parse(chatMessages);
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const filtered: Record<string, unknown[]> = {};
      for (const [key, messages] of Object.entries(parsed)) {
        if (Array.isArray(messages)) {
          filtered[key] = messages.filter((m: { timestamp?: number }) => 
            m.timestamp && m.timestamp > sevenDaysAgo
          ).slice(-50);
        }
      }
      localStorage.setItem('chatMessages', JSON.stringify(filtered));
    }
  } catch (e) {
    console.warn('Error cleaning chat messages:', e);
  }

  const usage = getStorageUsage();
  console.log(`🧹 Storage after cleanup: ${(usage.used / 1024).toFixed(2)}KB (${usage.percentage.toFixed(1)}%)`);
};

// Safe storage set with quota handling
export const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn('Storage quota exceeded, attempting cleanup...');
    cleanupStorage();
    
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e2) {
      console.error('Storage still full after cleanup');
      return false;
    }
  }
};

// Remove image data from stored items to reduce size
export const stripImageData = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map(stripImageData);
  }
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip large base64 images in nested objects (keep main images array)
      if (key === 'image' && typeof value === 'string' && value.startsWith('data:')) {
        result[key] = '/placeholder.svg'; // Replace with placeholder
      } else if (typeof value === 'string' && value.startsWith('data:image') && value.length > 10000) {
        result[key] = '/placeholder.svg';
      } else {
        result[key] = stripImageData(value);
      }
    }
    return result;
  }
  return obj;
};
