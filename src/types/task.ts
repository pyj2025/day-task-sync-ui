import * as z from 'zod';

export type STATUS_TYPE = 'todo' | 'inProgress' | 'done';

export type Task = {
  id: string;
  content: string;
  start_date: string;
  end_date?: string;
  status: STATUS_TYPE;
  user_id: string;
};

export type TaskList = {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
};

export const TaskFormSchema = z.object({
  content: z.string().min(1, 'Task description is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  status: z.enum(['todo', 'inProgress', 'done']),
});

export type TaskFormSchemaType = z.infer<typeof TaskFormSchema>;
