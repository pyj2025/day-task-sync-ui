import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Task = {
  id: string;
  content: string;
  startDate: string;
  endDate?: string;
  color?: string;
};

export type TaskList = {
  [key in 'todo' | 'inProgress' | 'done']: Task[];
};

interface TaskStore {
  tasks: TaskList;
  visibleTasks: {
    [key in keyof TaskList]: number;
  };
  addTask: (task: Omit<Task, 'id'>) => void;
  moveTask: (
    taskId: string,
    sourceList: keyof TaskList,
    targetList: keyof TaskList
  ) => void;
  showMoreTasks: (listName: keyof TaskList) => void;
  editTask: (taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  getTasksByDate: (date: string) => Task[];
}

const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: {
        todo: [
          { id: '1', content: 'Learn TypeScript', startDate: '2025-01-21' },
          { id: '2', content: 'Build Drag & Drop', startDate: '2025-01-21' },
          { id: '3', content: 'Study React Hooks', startDate: '2025-01-22' },
          { id: '4', content: 'Create UI Components', startDate: '2025-01-22' },
          { id: '5', content: 'Optimize Performance', startDate: '2025-01-23' },
          { id: '6', content: 'Write Documentation', startDate: '2025-01-23' },
          {
            id: '7',
            content: 'Design Database Schema',
            startDate: '2025-01-24',
          },
          {
            id: '8',
            content: 'Implement Authentication',
            startDate: '2025-01-24',
          },
          { id: '9', content: 'Setup CI/CD Pipeline', startDate: '2025-01-25' },
          { id: '10', content: 'Create Test Cases', startDate: '2025-01-25' },
          { id: '11', content: 'Review Code', startDate: '2025-01-26' },
          {
            id: '12',
            content: 'Refactor Legacy Code',
            startDate: '2025-01-26',
          },
        ],
        inProgress: [],
        done: [],
      },
      visibleTasks: {
        todo: 7,
        inProgress: 7,
        done: 7,
      },
      addTask: (task) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            todo: [
              ...state.tasks.todo,
              {
                ...task,
                id: Date.now().toString(),
                color: task.color || '#3B82F6',
              },
            ],
          },
        })),
      moveTask: (
        taskId: string,
        sourceList: keyof TaskList,
        targetList: keyof TaskList
      ) =>
        set((state) => {
          const sourceTasks = [...state.tasks[sourceList]];
          const targetTasks = [...state.tasks[targetList]];

          const taskToMove = sourceTasks.find((task) => task.id === taskId);
          if (!taskToMove) return state;

          const updatedTask = { ...taskToMove };
          if (targetList === 'done') {
            updatedTask.endDate = new Date().toISOString().split('T')[0];
          }

          return {
            tasks: {
              ...state.tasks,
              [sourceList]: sourceTasks.filter((task) => task.id !== taskId),
              [targetList]: [...targetTasks, updatedTask],
            },
          };
        }),
      showMoreTasks: (listName: keyof TaskList) =>
        set((state) => ({
          visibleTasks: {
            ...state.visibleTasks,
            [listName]: state.visibleTasks[listName] + 7,
          },
        })),
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
      deleteTask: (taskId) =>
        set((state) => {
          const updatedTasks = Object.keys(state.tasks).reduce(
            (acc, listKey) => {
              const list = listKey as keyof TaskList;
              acc[list] = state.tasks[list].filter((t) => t.id !== taskId);
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
        return allTasks.filter((task) => task.startDate === date);
      },
    }),
    {
      name: 'task-storage',
    }
  )
);

export default useTaskStore;
