import React, { useState } from 'react';
import {
  AiOutlineCalendar,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlinePlus,
} from 'react-icons/ai';
import useTaskStore, { Task } from '@/lib/store/task-store';
import { WEEK_DAYS } from '@/lib/constants';
import { Button } from './ui/button';
import DayCell from './day-cell';
import TaskListDialog from './task-list-dialog';
import UpdateTaskDialog from './update-task-dialog';

const Calendar: React.FC = () => {
  const { addTask, editTask } = useTaskStore();

  const [mounted, setMounted] = useState(false);
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

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return null;
  }

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

  const handleAddTaskButton = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    setEditingTask(null);
    setTaskContent('');
    setTaskColor('#3B82F6');
    setIsDialogOpen(true);
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
            onClick={handleAddTaskButton}
            className="bg-blue-500 hover:bg-blue-600 text-white gap-2"
          >
            <AiOutlinePlus className="h-4 w-4" />
            Add Task
          </Button>
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
      <UpdateTaskDialog
        editingTask={editingTask}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        taskContent={taskContent}
        setTaskContent={setTaskContent}
        saveTask={handleSaveTask}
      />
      <TaskListDialog
        isTaskListDialogOpen={isTaskListDialogOpen}
        setIsTaskListDialogOpen={setIsTaskListDialogOpen}
        selectedDayTasks={selectedDayTasks}
        setSelectedDayTasks={setSelectedDayTasks}
        handleEditTask={handleEditTask}
      />
    </div>
  );
};

export default Calendar;
