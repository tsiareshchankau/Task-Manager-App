// src/services/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchInitialTasks, Task } from '../api/todoApi';

const STORAGE_KEY = 'tasks';
const SCHEMA_VERSION = 1;
const DEBOUNCE_DELAY = 800;

interface StoredData {
  schemaVersion: number;
  tasks: Task[];
}

class TaskStorageService {
  private saveTimeout: number | null = null;
  private pendingChanges: Task[] | null = null;

  /**
   * Hydrates tasks: loads from storage, or fetches initial and saves if none.
   * Can throw if fetchInitialTasks fails.
   */
  hydrate = async (): Promise<Task[]> => {
    const loaded = await this.loadTasks();
    if (loaded) {
      return loaded;
    } else {
      const initial = await fetchInitialTasks();
      await this.saveTasks(initial);
      return initial;
    }
  };

  /**
   * Schedules an update to save tasks after 800ms. Cancels previous timer if called again.
   * Stores the tasks as pending changes to be saved.
   */
  scheduleUpdate = (tasks: Task[]): void => {
    console.log('Scheduling update with tasks:', tasks);
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.pendingChanges = tasks;
    this.saveTimeout = setTimeout(() => {
      this.saveTasks(tasks);
      this.saveTimeout = null;
      this.pendingChanges = null;
    }, DEBOUNCE_DELAY);
  };

  /**
   * Cancels any scheduled update and immediately saves pending changes to storage.
   */
  flush = (): void => {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    if (this.pendingChanges) {
      this.saveTasks(this.pendingChanges);
    }
    this.pendingChanges = null;
  };

  /**
   * Cancels any scheduled update, fetches initial tasks, saves them, and returns them.
   */
  refresh = async (): Promise<Task[]> => {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    this.pendingChanges = null;
    const tasks = await fetchInitialTasks();
    await this.saveTasks(tasks);
    return tasks;
  };

  /**
   * Internal function to save tasks to AsyncStorage.
   */
  private saveTasks = async (tasks: Task[]): Promise<void> => {
    console.log('Saving tasks to storage:', tasks);
    const data: StoredData = {
      schemaVersion: SCHEMA_VERSION,
      tasks,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  /**
   * Internal function to load tasks from AsyncStorage. Returns null if no data or error.
   */
  private loadTasks = async (): Promise<Task[] | null> => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (!json) return null;

      const data: StoredData = JSON.parse(json);
      if (data.schemaVersion !== SCHEMA_VERSION) {
        // Handle version mismatch, for now return null
        return null;
      }
      return data.tasks;
    } catch (error) {
      console.error('Error loading tasks:', error);
      return null;
    }
  };
}

export default new TaskStorageService();
