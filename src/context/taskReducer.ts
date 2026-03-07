// src/context/taskReducer.ts

import { Task } from '../api/todoApi';

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export type TaskAction =
  | { type: 'INIT_START' }
  | { type: 'INIT_SUCCESS'; payload: Task[] }
  | { type: 'INIT_ERROR'; payload: string }
  | { type: 'LOAD_FROM_STORAGE'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt'> & { id?: string } }
  | { type: 'TOGGLE_TASK'; payload: string } // id
  | { type: 'UPDATE_TASK'; payload: { id: string; changes: Partial<Pick<Task, 'title' | 'description'>> } }
  | { type: 'DELETE_TASK'; payload: string }; // id

export const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'INIT_START':
      return { ...state, loading: true, error: null };
    case 'INIT_SUCCESS':
      return { ...state, tasks: action.payload, loading: false, error: null };
    case 'INIT_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOAD_FROM_STORAGE':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      const newTask: Task = {
        id: action.payload.id || Date.now().toString(),
        title: action.payload.title,
        description: action.payload.description,
        completed: action.payload.completed || false,
        createdAt: action.payload.createdAt || new Date().toISOString(),
      };
      return { ...state, tasks: [...state.tasks, newTask] };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        ),
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload.changes } : task
        ),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((task) => task.id !== action.payload) };
    default:
      return state;
  }
}