import React, { useState } from 'react';
import {
  AiOutlineCalendar,
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlineLeft,
  AiOutlineRight,
} from 'react-icons/ai';
import useTaskStore, { Task } from '@/lib/store/task-store';
import { WEEK_DAYS } from '@/lib/constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import DayCell from './day-cell';

const Calendar: React.FC = () => {
  const { addTask, editTask } = useTaskStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTaskListDialogOpen, setIsTaskListDialogOpen] = useState(false);
  const [taskContent, setTaskContent] = useState('');
  const [taskColor, setTaskColor] = useState('#3B82F6');
  const [selectedDayTasks, setSelectedDayTasks] = useState<{
    date: Date;
    tasks: Task[];
  } | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: Date[] = [];

    const prevMonthLastDate = new Date(year, month, 0);
    const prevMonthLastDay = prevMonthLastDate.getDate();

    for (let i = firstDay.getDay(); i > 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i + 1));
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleAddTask = (date: string) => {
    setSelectedDate(date);
    setEditingTask(null);
    setTaskContent('');
    setTaskColor('#3B82F6');
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskContent(task.content);
    setTaskColor(task.color || '#3B82F6');
    setIsDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (editingTask) {
      editTask(editingTask.id, {
        content: taskContent,
        color: taskColor,
      });
    } else {
      addTask({
        content: taskContent,
        startDate: selectedDate,
        color: taskColor,
      });
    }
    setIsDialogOpen(false);
    setTaskContent('');
    setEditingTask(null);
  };

  const handleDayClick = (date: Date, tasks: Task[]) => {
    setSelectedDayTasks({ date, tasks });
    setIsTaskListDialogOpen(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AiOutlineCalendar className="h-6 w-6 text-gray-700" />
          <h2 className="text-2xl font-semibold text-gray-800">
            {currentDate.toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePreviousMonth}
            className="hover:bg-gray-100"
          >
            <AiOutlineLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={handleNextMonth}
            className="hover:bg-gray-100"
          >
            Next
            <AiOutlineRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-white rounded-lg shadow-sm overflow-hidden">
        {WEEK_DAYS.map((day: string) => (
          <div
            key={day}
            className="p-3 text-center font-medium text-gray-600 bg-gray-100 border-b border-gray-200"
          >
            {day}
          </div>
        ))}
        {days.map((date, index) => {
          const tasks = useTaskStore
            .getState()
            .getTasksByDate(date.toISOString().split('T')[0]);

          return (
            <DayCell
              key={index}
              date={date}
              tasks={tasks}
              isCurrentMonth={date.getMonth() === currentDate.getMonth()}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDayClick={handleDayClick}
            />
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-50 border-0">
          <DialogHeader>
            <DialogTitle className="text-gray-800">
              {editingTask ? 'Edit Task' : 'Add Task'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              value={taskContent}
              onChange={(e) => setTaskContent(e.target.value)}
              className="w-full min-h-[120px] p-3 border border-gray-200 rounded-lg 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      placeholder:text-gray-400 text-gray-700 bg-white"
              placeholder="Enter your task..."
            />
            <div className="flex items-center gap-2">
              <span>Color:</span>
              {['#3B82F6', '#10B981', '#F43F5E', '#F59E0B', '#6366F1'].map(
                (color) => (
                  <button
                    key={color}
                    onClick={() => setTaskColor(color)}
                    className={`w-6 h-6 rounded-full ${
                      taskColor === color
                        ? 'ring-2 ring-offset-2 ring-gray-400'
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                )
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveTask}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={!taskContent.trim()}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isTaskListDialogOpen}
        onOpenChange={setIsTaskListDialogOpen}
      >
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
                    backgroundColor: task.color || '#F3F4F6',
                    borderColor: task.color || '#E5E7EB',
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
                        // deleteTask(task.id);
                        setSelectedDayTasks((prev) =>
                          prev
                            ? {
                                ...prev,
                                tasks: prev.tasks.filter(
                                  (t) => t.id !== task.id
                                ),
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
    </div>
  );
};

export default Calendar;
