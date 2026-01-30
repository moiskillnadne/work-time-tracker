/**
 * Unique identifier for a task
 */
export type TaskId = string;

/**
 * Core task data structure
 */
export interface Task {
  /** Unique identifier (UUID) */
  id: TaskId;
  /** Task title (max 120 characters) */
  title: string;
  /** Accumulated time spent on task in milliseconds */
  elapsedTime: number;
  /** ISO timestamp when task was created */
  createdAt: string;
  /** ISO timestamp when task was last updated */
  updatedAt: string;
}

/**
 * Data required to create a new task
 */
export interface CreateTaskInput {
  title: string;
}

/**
 * Data for updating an existing task
 */
export interface UpdateTaskInput {
  id: TaskId;
  title?: string;
  elapsedTime?: number;
}
