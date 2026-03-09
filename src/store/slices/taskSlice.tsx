import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types';

export interface TaskState {
  tasks: Task[];
  seeded: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  seeded: false,
  loading: false,
  error: null,
};

export const loadDummyTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  'tasks/loadDummyTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://dummyjson.com/todos?limit=10');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      return data.todos.map((todo: any) => ({
        id: todo.id.toString(),
        title: todo.todo,
        completed: todo.completed,
        createdAt: new Date().toISOString(),
      }));
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt'>>) => {
      const newTask: Task = {
        id: Date.now().toString(),
        title: action.payload.title,
        description: action.payload.description,
        completed: action.payload.completed || false,
        createdAt: new Date().toISOString(),
      };
      state.tasks.unshift(newTask);
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<Pick<Task, 'title' | 'description' | 'completed'>> }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        Object.assign(task, action.payload.changes);
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDummyTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadDummyTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.seeded = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadDummyTasks.rejected, (state, action) => {
        state.loading = false;
        state.seeded = true; // Mark as seeded to prevent retrying on every load
        state.error = action.payload || 'Failed to load dummy tasks';
      });
  },
});

export const { addTask, toggleTask, updateTask, deleteTask } = taskSlice.actions;

export default taskSlice.reducer;
