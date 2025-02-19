import React from 'react';
import { AiOutlineClose, AiOutlineEdit } from 'react-icons/ai';
import { Task, TaskListType } from '@/types/task';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

type SelectedDayTasks = {
  date: Date;
  tasks: Task[];
} | null;

interface DisplayTaskListDialogProps {
  isTaskListDialogOpen: boolean;
  setIsTaskListDialogOpen: (open: boolean) => void;
  selectedDayTasks: SelectedDayTasks;
  setSelectedDayTasks: React.Dispatch<React.SetStateAction<SelectedDayTasks>>;
  handleEditTask: (task: Task) => void;
  taskList: TaskListType;
}

const DisplayTaskListDialog: React.FC<DisplayTaskListDialogProps> = ({
  isTaskListDialogOpen,
  setIsTaskListDialogOpen,
  selectedDayTasks,
  setSelectedDayTasks,
  handleEditTask,
  taskList,
}: DisplayTaskListDialogProps) => {
  const currentDate = selectedDayTasks?.date.toISOString().split('T')[0];

  const groupedTasks = {
    todo: taskList.todo.filter((task) => task.start_date === currentDate),
    inProgress: taskList.inProgress.filter(
      (task) => task.start_date === currentDate
    ),
    done: taskList.done.filter((task) => task.start_date === currentDate),
  };

  const handleDeleteTask = (taskId: string) => {
    setSelectedDayTasks((prev) =>
      prev
        ? {
            ...prev,
            tasks: prev.tasks.filter((t) => t.id !== taskId),
          }
        : null
    );
  };

  const TaskItem = ({ task }: { task: Task }) => (
    <div
      className="p-3 rounded-lg border shadow-sm flex justify-between items-center"
      style={{
        backgroundColor: '#F3F4F6',
        borderColor: '#E5E7EB',
      }}
    >
      <span className="text-gray-700">{task.content}</span>
      <div className="flex gap-2">
        <button
          onClick={() => {
            setIsTaskListDialogOpen(false);
            handleEditTask(task);
          }}
          className="hover:text-blue-600 p-1 rounded-md hover:bg-gray-100"
        >
          <AiOutlineEdit className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleDeleteTask(task.id)}
          className="hover:text-red-600 p-1 rounded-md hover:bg-gray-100"
        >
          <AiOutlineClose className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const TaskGroup = ({ title, tasks }: { title: string; tasks: Task[] }) => {
    if (tasks.length === 0) return null;

    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </div>
    );
  };

  const hasAnyTasks =
    groupedTasks.todo.length > 0 ||
    groupedTasks.inProgress.length > 0 ||
    groupedTasks.done.length > 0;

  return (
    <Dialog open={isTaskListDialogOpen} onOpenChange={setIsTaskListDialogOpen}>
      <DialogContent className="bg-gray-50 border-0">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-gray-800">
            {selectedDayTasks && formatDate(selectedDayTasks.date)}
          </DialogTitle>
          <button
            onClick={() => setIsTaskListDialogOpen(false)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <AiOutlineClose className="h-5 w-5 text-gray-600" />
          </button>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {!hasAnyTasks ? (
            <p className="text-gray-500 text-center py-4">
              No tasks for this day
            </p>
          ) : (
            <>
              <TaskGroup title="Todo" tasks={groupedTasks.todo} />
              <TaskGroup title="In Progress" tasks={groupedTasks.inProgress} />
              <TaskGroup title="Done" tasks={groupedTasks.done} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisplayTaskListDialog;
