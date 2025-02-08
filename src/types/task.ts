export type Task = {
  id: string;
  content: string;
  start_date: string;
  end_date?: string;
};

export type TaskList = {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
};
