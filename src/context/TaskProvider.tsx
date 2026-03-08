// src/context/TaskProvider.tsx

import React, { createContext, ReactNode, useCallback, useContext, useEffect, useReducer } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Task } from '../api/todoApi';
import TaskStorageService from '../services/TaskStorageService';
import { initialState, TaskAction, taskReducer, TaskState } from './taskReducer';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (taskData: { title: string; description?: string }) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, changes: { title?: string; description?: string }) => void;
  deleteTask: (id: string) => void;
  refresh: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function useTaskContext(): TaskContextType {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
}

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    const init = async () => {
      dispatch({ type: 'INIT_START' });
      try {
        const tasks = await TaskStorageService.hydrate();
        await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate loading delay
        dispatch({ type: 'INIT_SUCCESS', payload: tasks });
      } catch (error) {
        dispatch({ type: 'INIT_ERROR', payload: (error as Error).message });
      }
    };
    init();
  }, []);
  
  // Debounced save
  const debouncedSave = useCallback((tasksToSave: typeof state.tasks) => {
    TaskStorageService.scheduleUpdate(tasksToSave);
  }, []);

  useEffect(() => {
    if (state.loading) return; // Don't save while loading
    debouncedSave(state.tasks);
  }, [state.loading, state.tasks, debouncedSave]);

  // Listen to app state changes and flush tasks when app goes to background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (appState: AppStateStatus) => {
      console.log('AppState changed to', appState);
      if (appState === 'background' || appState === 'inactive') {
        TaskStorageService.flush();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const addTask = useCallback((taskData: { title: string; description?: string }) => {
    dispatch({
      type: 'ADD_TASK',
      payload: {
        title: taskData.title,
        description: taskData.description,
        completed: false
      },
    });
  }, [dispatch]);

  const toggleTask = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  }, [dispatch]);

  const updateTask = useCallback((id: string, changes: { title?: string; description?: string }) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, changes } });
  }, [dispatch]);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, [dispatch]);

  const refresh = useCallback(async () => {
    dispatch({ type: 'INIT_START' });
    try {
      const initialTasks = await TaskStorageService.refresh();
      dispatch({ type: 'INIT_SUCCESS', payload: initialTasks });
    } catch (err) {
      dispatch({ type: 'INIT_ERROR', payload: (err as Error).message });
    }
  }, [dispatch]);

  return (
    <TaskContext.Provider value={{ ...state, addTask, toggleTask, updateTask, deleteTask, refresh }}>
      {children}
    </TaskContext.Provider>
  );
}