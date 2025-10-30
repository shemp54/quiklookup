const STORAGE_KEY = 'quicklookup_daily_count';
const MAX_FREE_LOOKUPS = 3;

interface LookupData {
  count: number;
  date: string;
}

// Get today's date string (YYYY-MM-DD)
const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Get current lookup data from localStorage
const getLookupData = (): LookupData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { count: 0, date: getTodayString() };
    }
    return JSON.parse(stored) as LookupData;
  } catch {
    return { count: 0, date: getTodayString() };
  }
};

// Save lookup data to localStorage
const saveLookupData = (data: LookupData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save lookup data:', error);
  }
};

// Check if user can perform a lookup
export const canPerformLookup = (): boolean => {
  const data = getLookupData();
  const today = getTodayString();

  // Reset count if it's a new day
  if (data.date !== today) {
    saveLookupData({ count: 0, date: today });
    return true;
  }

  return data.count < MAX_FREE_LOOKUPS;
};

// Increment lookup count
export const incrementLookupCount = (): void => {
  const data = getLookupData();
  const today = getTodayString();

  // Reset count if it's a new day
  if (data.date !== today) {
    saveLookupData({ count: 1, date: today });
  } else {
    saveLookupData({ count: data.count + 1, date: today });
  }
};

// Get remaining lookups for today
export const getRemainingLookups = (): number => {
  const data = getLookupData();
  const today = getTodayString();

  // Reset count if it's a new day
  if (data.date !== today) {
    return MAX_FREE_LOOKUPS;
  }

  return Math.max(0, MAX_FREE_LOOKUPS - data.count);
};

// Get time until midnight (for countdown display)
export const getTimeUntilMidnight = (): string => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};
