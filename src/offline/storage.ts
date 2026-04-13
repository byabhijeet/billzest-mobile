import AsyncStorage from '@react-native-async-storage/async-storage';
import { OfflineMutation, OfflineCacheKey } from './types';
import { logger } from '../utils/logger';

const MUTATION_QUEUE_KEY = 'offline:mutations:v1';

export const offlineStorage = {
  async getCache<T = any>(key: OfflineCacheKey): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(`offline:cache:${key}`);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (error) {
      logger.error('[Offline] Failed to read cache', { key, error });
      return null;
    }
  },

  async setCache(key: OfflineCacheKey, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(`offline:cache:${key}`, JSON.stringify(value));
    } catch (error) {
      logger.error('[Offline] Failed to write cache', { key, error });
    }
  },

  async appendMutation(mutation: OfflineMutation): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(MUTATION_QUEUE_KEY);
      const existing: OfflineMutation[] = raw ? JSON.parse(raw) : [];
      existing.push(mutation);
      await AsyncStorage.setItem(MUTATION_QUEUE_KEY, JSON.stringify(existing));
    } catch (error) {
      logger.error('[Offline] Failed to append mutation', { mutation, error });
    }
  },

  async readMutations(): Promise<OfflineMutation[]> {
    try {
      const raw = await AsyncStorage.getItem(MUTATION_QUEUE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as OfflineMutation[];
    } catch (error) {
      logger.error('[Offline] Failed to read mutations', error);
      return [];
    }
  },

  async overwriteMutations(mutations: OfflineMutation[]): Promise<void> {
    try {
      await AsyncStorage.setItem(MUTATION_QUEUE_KEY, JSON.stringify(mutations));
    } catch (error) {
      logger.error('[Offline] Failed to write mutations', error);
    }
  },
};
