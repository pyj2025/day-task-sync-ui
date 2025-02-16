import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { Task, TaskList } from '@/types/task';
import { UserState } from '@/types/user';

interface TaskStore extends UserState {
  tasks: TaskList;
  visibleTasks: {
    [key in keyof TaskList]: number;
  };
  fetchTasks: () => Promise<void>;
  addTask: (task: Task) => void;
  // moveTask: (
  //   taskId: string,
  //   sourceList: keyof TaskList,
  //   targetList: keyof TaskList
  // ) => void;
  // showMoreTasks: (listName: keyof TaskList) => void;
  editTask: (taskId: string, updatedTask: Partial<Task>) => void;
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
        const { data, error } = await supabase.from('TasksList').select('*');

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
          { todo: [], inProgress: [], done: [] } as TaskList
        );

        set({ tasks: fetchedTasks });
      },

      addTask: async (task) => {
        console.log('task', task);

        const { data, error } = await supabase.from('TasksList').insert([
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
      // moveTask: (
      //   taskId: string,
      //   sourceList: keyof TaskList,
      //   targetList: keyof TaskList
      // ) =>
      //   set((state) => {
      //     const sourceTasks = [...state.tasks[sourceList]];
      //     const targetTasks = [...state.tasks[targetList]];

      //     const taskToMove = sourceTasks.find((task) => task.id === taskId);
      //     if (!taskToMove) return state;

      //     const updatedTask = { ...taskToMove };
      //     if (targetList === 'done') {
      //       updatedTask.end_date = new Date().toISOString().split('T')[0];
      //     }

      //     return {
      //       tasks: {
      //         ...state.tasks,
      //         [sourceList]: sourceTasks.filter((task) => task.id !== taskId),
      //         [targetList]: [...targetTasks, updatedTask],
      //       },
      //     };
      //   }),
      // showMoreTasks: (listName: keyof TaskList) =>
      //   set((state) => ({
      //     visibleTasks: {
      //       ...state.visibleTasks,
      //       [listName]: state.visibleTasks[listName] + 7,
      //     },
      //   })),
      editTask: (taskId, updatedTask) =>
        set((state) => {
          const updatedTasks = Object.keys(state.tasks).reduce(
            (acc, listKey) => {
              const list = listKey as keyof TaskList;
              const taskIndex = state.tasks[list].findIndex(
                (t) => t.id === taskId
              );

              if (taskIndex !== -1) {
                const newList = [...state.tasks[list]];
                newList[taskIndex] = { ...newList[taskIndex], ...updatedTask };
                acc[list] = newList;
              } else {
                acc[list] = state.tasks[list];
              }

              return acc;
            },
            {} as TaskList
          );

          return { tasks: updatedTasks };
        }),
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
