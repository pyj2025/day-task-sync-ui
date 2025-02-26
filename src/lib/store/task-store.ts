import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { Task, TaskListType } from '@/types/task';
import { UserState } from '@/types/user';

interface TaskStore extends UserState {
  tasks: TaskListType;
  visibleTasks: {
    [key in keyof TaskListType]: number;
  };
  fetchTasks: () => Promise<void>;
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskId: string) => void;
  getTasksByDate: (date: string) => Task[];
}

const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      userId: null,
      setUserId: (id: string | null) => set({ userId: id }),
      tasks: {
        todo: [],
        inProgress: [],
        done: [],
      },
      visibleTasks: {
        todo: 7,
        inProgress: 7,
        done: 7,
      },
      fetchTasks: async () => {
        const { data, error } = await supabase
          .from('TasksList')
          .select('*')
          .eq('user_id', get().userId);

        if (error) {
          console.error('Failed to fetchTasks:', error);
          set({ tasks: { todo: [], inProgress: [], done: [] } });
          return;
        }

        const fetchedTasks = data.reduce(
          (acc, task) => {
            acc[task.status].push(task);
            return acc;
          },
          { todo: [], inProgress: [], done: [] } as TaskListType
        );

        set({ tasks: fetchedTasks });
      },

      addTask: async (task) => {
        const { error } = await supabase.from('TasksList').insert([
          {
            id: task.id,
            user_id: task.user_id,
            content: task.content,
            start_date: task.start_date,
            end_date: task.end_date,
            status: task.status,
          },
        ]);

        if (error) {
          console.error('Failed to add Task:', error);
          return;
        }

        get().fetchTasks();
      },
      deleteTask: async (taskId) => {
        const { error } = await supabase
          .from('TasksList')
          .delete()
          .match({ id: taskId });

        if (error) {
          console.error('Failed to delete Task:', error);
          return;
        }

        get().fetchTasks();
      },
      updateTask: async (updatedTask) => {
        const { id, ...rest } = updatedTask;

        const { error } = await supabase
          .from('TasksList')
          .update(rest)
          .eq('id', id);

        if (error) {
          console.error('Failed to update Task:', error);
          return;
        }

        get().fetchTasks();
      },
      getTasksByDate: (date) => {
        const allTasks = [
          ...get().tasks.todo,
          ...get().tasks.inProgress,
          ...get().tasks.done,
        ];
        return allTasks.filter((task) => task.start_date === date);
      },
    }),
    {
      name: 'task-storage',
    }
  )
);

export default useTaskStore;
