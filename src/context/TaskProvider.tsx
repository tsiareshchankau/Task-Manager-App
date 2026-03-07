// src/context/TaskProvider.tsx

import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { fetchInitialTodos } from '../api/todoApi';
import { loadTasks, saveTasks } from '../services/storage';
import { initialState, TaskAction, taskReducer, TaskState } from './taskReducer';

interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
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
        const storedTasks = await loadTasks();
        if (storedTasks && storedTasks.length > 0) {
          dispatch({ type: 'LOAD_FROM_STORAGE', payload: storedTasks });
        } else {
          const initialTasks = await fetchInitialTodos();
          dispatch({ type: 'INIT_SUCCESS', payload: initialTasks });
          await saveTasks(initialTasks);
        }
      } catch (error) {
        dispatch({ type: 'INIT_ERROR', payload: error.message });
      }
    };
    init();
  }, []);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}