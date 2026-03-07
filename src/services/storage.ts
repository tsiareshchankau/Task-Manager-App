// src/services/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../api/todoApi';

const STORAGE_KEY = 'tasks';
const SCHEMA_VERSION = 1;

interface StoredData {
  schemaVersion: number;
  tasks: Task[];
}

/**
 * Saves tasks to AsyncStorage.
 */
export async function saveTasks(tasks: Task[]): Promise<void> {
  const data: StoredData = {
    schemaVersion: SCHEMA_VERSION,
    tasks,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Loads tasks from AsyncStorage. Returns null if no data or error.
 */
export async function loadTasks(): Promise<Task[] | null> {
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
}

/**
 * Clears tasks from AsyncStorage.
 */
export async function clearTasks(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}