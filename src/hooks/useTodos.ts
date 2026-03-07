// src/hooks/useTodos.ts

import { useCallback, useEffect, useRef } from 'react';
import { fetchInitialTodos } from '../api/todoApi';
import { useTaskContext } from '../context/TaskProvider';
import { saveTasks } from '../services/storage';

export function useTodos() {
  const { state, dispatch } = useTaskContext();
  const { tasks, loading, error } = state;

  // Debounced save
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedSave = useCallback((tasksToSave: typeof tasks) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveTasks(tasksToSave);
    }, 300);
  }, []);

  useEffect(() => {
    debouncedSave(tasks);
  }, [tasks, debouncedSave]);

  const addTask = useCallback((taskData: { title: string; description?: string }) => {
    dispatch({
      type: 'ADD_TASK',
      payload: {
        title: taskData.title,
        description: taskData.description,
        completed: false,
        createdAt: new Date().toISOString(),
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
    if (tasks.length === 0) {
      dispatch({ type: 'INIT_START' });
      try {
        const initialTasks = await fetchInitialTodos();
        dispatch({ type: 'INIT_SUCCESS', payload: initialTasks });
      } catch (err) {
        dispatch({ type: 'INIT_ERROR', payload: err.message });
      }
    }
  }, [tasks.length, dispatch]);

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    refresh,
  };
}