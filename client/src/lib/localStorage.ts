// Browser localStorage wrapper for InstaClone

interface StorageData {
  bookmarks: Bookmark[];
  cachedAccounts: CachedAccount[];
  userPreferences: UserPreferences;
}

interface Bookmark {
  id: string;
  postId: string;
  username: string;
  caption?: string;
  mediaUrl?: string;
  mediaType?: string;
  timestamp: number;
  savedAt: number;
}

interface CachedAccount {
  accountId: string;
  username: string;
  displayName?: string;
  profilePicture?: string;
  followerCount: number;
  followingCount: number;
  mediaCount: number;
  accessToken: string;
  cachedAt: number;
}

interface UserPreferences {
  darkMode: boolean;
  defaultAccount?: string;
}

const STORAGE_KEY = "instaclone_data";

function getStorage(): StorageData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data
      ? JSON.parse(data)
      : {
          bookmarks: [],
          cachedAccounts: [],
          userPreferences: { darkMode: false },
        };
  } catch {
    return {
      bookmarks: [],
      cachedAccounts: [],
      userPreferences: { darkMode: false },
    };
  }
}

function saveStorage(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

export const storageService = {
  // Bookmarks
  addBookmark(bookmark: Omit<Bookmark, "id" | "savedAt">): Bookmark {
    const data = getStorage();
    const newBookmark: Bookmark = {
      ...bookmark,
      id: `${bookmark.postId}_${Date.now()}`,
      savedAt: Date.now(),
    };
    data.bookmarks.push(newBookmark);
    saveStorage(data);
    return newBookmark;
  },

  removeBookmark(bookmarkId: string): void {
    const data = getStorage();
    data.bookmarks = data.bookmarks.filter((b) => b.id !== bookmarkId);
    saveStorage(data);
  },

  getBookmarks(): Bookmark[] {
    return getStorage().bookmarks;
  },

  getBookmarksByPostId(postId: string): Bookmark | undefined {
    return getStorage().bookmarks.find((b) => b.postId === postId);
  },

  // Cached Accounts
  addCachedAccount(account: CachedAccount): void {
    const data = getStorage();
    const existing = data.cachedAccounts.findIndex(
      (a) => a.accountId === account.accountId
    );
    if (existing >= 0) {
      data.cachedAccounts[existing] = account;
    } else {
      data.cachedAccounts.push(account);
    }
    saveStorage(data);
  },

  removeCachedAccount(accountId: string): void {
    const data = getStorage();
    data.cachedAccounts = data.cachedAccounts.filter(
      (a) => a.accountId !== accountId
    );
    saveStorage(data);
  },

  getCachedAccounts(): CachedAccount[] {
    return getStorage().cachedAccounts;
  },

  getCachedAccount(accountId: string): CachedAccount | undefined {
    return getStorage().cachedAccounts.find((a) => a.accountId === accountId);
  },

  // User Preferences
  setPreference(key: keyof UserPreferences, value: any): void {
    const data = getStorage();
    data.userPreferences[key] = value;
    saveStorage(data);
  },

  getPreference(key: keyof UserPreferences): any {
    return getStorage().userPreferences[key];
  },

  // Storage Management
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  exportData(): string {
    return JSON.stringify(getStorage(), null, 2);
  },

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.bookmarks && data.cachedAccounts && data.userPreferences) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
};

export type { Bookmark, CachedAccount, UserPreferences };
