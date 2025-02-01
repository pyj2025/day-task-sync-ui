import React from 'react';
import { AiOutlineClose, AiOutlineEdit } from 'react-icons/ai';
import { Task } from '@/lib/store/task-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

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

interface TaskListDialogProps {
  isTaskListDialogOpen: boolean;
  setIsTaskListDialogOpen: (open: boolean) => void;
  selectedDayTasks: SelectedDayTasks;
  setSelectedDayTasks: (tasks: SelectedDayTasks) => void;
  handleEditTask: (task: Task) => void;
}

const TaskListDialog: React.FC<TaskListDialogProps> = ({
  isTaskListDialogOpen,
  setIsTaskListDialogOpen,
  selectedDayTasks,
  setSelectedDayTasks,
  handleEditTask,
}: TaskListDialogProps) => {
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
        <div className="space-y-3 mt-4">
          {selectedDayTasks?.tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No tasks for this day
            </p>
          ) : (
            selectedDayTasks?.tasks.map((task) => (
              <div
                key={task.id}
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
                    onClick={() => {
                      setSelectedDayTasks((prev) =>
                        prev
                          ? {
                              ...prev,
                              tasks: prev.tasks.filter((t) => t.id !== task.id),
                            }
                          : null
                      );
                    }}
                    className="hover:text-red-600 p-1 rounded-md hover:bg-gray-100"
                  >
                    <AiOutlineClose className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskListDialog;
