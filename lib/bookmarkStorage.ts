// lib/bookmarkStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
export interface BookmarkedVideo {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  creator: {
    username: string;
    avatar: string;
  };
  bookmarkedAt: string;
}

const BOOKMARK_STORAGE_KEY = '@bookmarked_videos';

export const BookmarkStorage = {
  // Get all bookmarked videos
  async getBookmarkedVideos(): Promise<BookmarkedVideo[]> {
    try {
      const bookmarksJson = await AsyncStorage.getItem(BOOKMARK_STORAGE_KEY);
      return bookmarksJson ? JSON.parse(bookmarksJson) : [];
    } catch (error) {
      console.error('Error getting bookmarked videos:', error);
      return [];
    }
  },

  // Add a video to bookmarks
  async addBookmark(video: Omit<BookmarkedVideo, 'bookmarkedAt'>): Promise<boolean> {
    try {
      const existingBookmarks = await this.getBookmarkedVideos();
      
      // Check if already bookmarked
      if (existingBookmarks.some(bookmark => bookmark.$id === video.$id)) {
        return false; // Already bookmarked
      }

      const newBookmark: BookmarkedVideo = {
        ...video,
        bookmarkedAt: new Date().toISOString(),
      };

      const updatedBookmarks = [newBookmark, ...existingBookmarks];
      await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(updatedBookmarks));
      return true;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      return false;
    }
  },

  // Remove a video from bookmarks
  async removeBookmark(videoId: string): Promise<boolean> {
    try {
      const existingBookmarks = await this.getBookmarkedVideos();
      const updatedBookmarks = existingBookmarks.filter(bookmark => bookmark.$id !== videoId);
      await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(updatedBookmarks));
      return true;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      return false;
    }
  },

  // Check if a video is bookmarked
  async isBookmarked(videoId: string): Promise<boolean> {
    try {
      const bookmarks = await this.getBookmarkedVideos();
      return bookmarks.some(bookmark => bookmark.$id === videoId);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }
  },

  // Clear all bookmarks
  async clearAllBookmarks(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(BOOKMARK_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      return false;
    }
  },

  // Get bookmarked video IDs only (for quick lookup)
  async getBookmarkedVideoIds(): Promise<string[]> {
    try {
      const bookmarks = await this.getBookmarkedVideos();
      return bookmarks.map(bookmark => bookmark.$id);
    } catch (error) {
      console.error('Error getting bookmarked video IDs:', error);
      return [];
    }
  },

  // Search bookmarked videos
  async searchBookmarkedVideos(query: string): Promise<BookmarkedVideo[]> {
    try {
      const bookmarks = await this.getBookmarkedVideos();
      const lowercaseQuery = query.toLowerCase();
      
      return bookmarks.filter(bookmark =>
        bookmark.title.toLowerCase().includes(lowercaseQuery) ||
        bookmark.creator.username.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error searching bookmarked videos:', error);
      return [];
    }
  },

  // Get bookmarks count
  async getBookmarksCount(): Promise<number> {
    try {
      const bookmarks = await this.getBookmarkedVideos();
      return bookmarks.length;
    } catch (error) {
      console.error('Error getting bookmarks count:', error);
      return 0;
    }
  },

  // Sort bookmarks by different criteria
  async getSortedBookmarks(sortBy: 'recent' | 'title' | 'creator'): Promise<BookmarkedVideo[]> {
    try {
      const bookmarks = await this.getBookmarkedVideos();
      
      return bookmarks.sort((a, b) => {
        switch (sortBy) {
          case 'recent':
            return new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime();
          case 'title':
            return a.title.localeCompare(b.title);
          case 'creator':
            return a.creator.username.localeCompare(b.creator.username);
          default:
            return 0;
        }
      });
    } catch (error) {
      console.error('Error sorting bookmarks:', error);
      return [];
    }
  }
};

// Hook for managing bookmark state


export const useBookmarks = () => {
  const [bookmarkedVideos, setBookmarkedVideos] = useState<BookmarkedVideo[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const bookmarks = await BookmarkStorage.getBookmarkedVideos();
      const ids = await BookmarkStorage.getBookmarkedVideoIds();
      setBookmarkedVideos(bookmarks);
      setBookmarkedIds(ids);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (video: Omit<BookmarkedVideo, 'bookmarkedAt'>) => {
    const success = await BookmarkStorage.addBookmark(video);
    if (success) {
      await loadBookmarks(); // Refresh the list
    }
    return success;
  };

  const removeBookmark = async (videoId: string) => {
    const success = await BookmarkStorage.removeBookmark(videoId);
    if (success) {
      await loadBookmarks(); // Refresh the list
    }
    return success;
  };

  const isBookmarked = (videoId: string) => {
    return bookmarkedIds.includes(videoId);
  };

  const toggleBookmark = async (video: Omit<BookmarkedVideo, 'bookmarkedAt'>) => {
    if (isBookmarked(video.$id)) {
      return await removeBookmark(video.$id);
    } else {
      return await addBookmark(video);
    }
  };

  const clearAllBookmarks = async () => {
    const success = await BookmarkStorage.clearAllBookmarks();
    if (success) {
      setBookmarkedVideos([]);
      setBookmarkedIds([]);
    }
    return success;
  };

  return {
    bookmarkedVideos,
    bookmarkedIds,
    loading,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
    clearAllBookmarks,
    refreshBookmarks: loadBookmarks,
  };
};