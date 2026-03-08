// src/api/todoApi.ts

export interface ApiTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

/**
 * Simple fetch wrapper with timeout and single retry.
 */
async function fetchWithTimeoutAndRetry(url: string, options: RequestInit = {}, timeoutMs: number = 5000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if ((error as Error).name === 'AbortError') {
      throw new Error('Request timed out');
    }
    // Retry once
    try {
      const retryController = new AbortController();
      const retryTimeoutId = setTimeout(() => retryController.abort(), timeoutMs);
      const response = await fetch(url, { ...options, signal: retryController.signal });
      clearTimeout(retryTimeoutId);
      return response;
    } catch (retryError) {
      throw retryError;
    }
  }
}

/**
 * Fetches the first 10 todos from dummyjson.com, maps to internal Task model.
 */
export async function fetchInitialTasks(): Promise<Task[]> {
  const url = 'https://dummyjson.com/todos?limit=10';
  const response = await fetchWithTimeoutAndRetry(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch todos: ${response.statusText}`);
  }

  const data: { todos: ApiTodo[] } = await response.json();

  return data.todos.map((apiTodo) => ({
    id: apiTodo.id.toString(),
    title: apiTodo.todo,
    description: undefined,
    completed: apiTodo.completed,
    createdAt: new Date().toISOString(),
  }));
}