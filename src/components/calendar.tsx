import React, { useState, useEffect } from 'react';
import {
  AiOutlineCalendar,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlinePlus,
} from 'react-icons/ai';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  subMonths,
  addMonths,
  isSameMonth,
} from 'date-fns';
import useTaskStore from '@/lib/store/task-store';
import { WEEK_DAYS } from '@/lib/constants';
import { Task } from '@/types/task';
import { Button } from './ui/button';
import DayCell from './day-cell';
import UpdateTaskDialog from './dialog/update-task-dialog';
import DisplayTaskListDialog from './dialog/display-task-list-dialog';

const Calendar: React.FC = () => {
  const { tasks, addTask } = useTaskStore();

  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDisplayTaskListDialogOpen, setIsDisplayTaskListDialogOpen] =
    useState<boolean>(false);
  const [taskContent, setTaskContent] = useState('');
  const [selectedDayTasks, setSelectedDayTasks] = useState<{
    date: Date;
    tasks: Task[];
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const start = startOfWeek(startOfMonth(date));
    const end = endOfWeek(endOfMonth(date));
    return eachDayOfInterval({ start, end });
  };

  if (!mounted) {
    return null;
  }

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleAddTask = (date: string) => {
    setSelectedDate(date);
    setEditingTask(null);
    setTaskContent('');
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskContent(task.content);
    setIsDialogOpen(true);
  };

  const handleDayClick = (date: Date, tasks: Task[]) => {
    setSelectedDayTasks({ date, tasks });
    setIsDisplayTaskListDialogOpen(true);
  };

  const handleAddTaskButton = () => {
    const today = new Date();
    const formattedDate = format(today, 'yyyy-MM-dd');
    setSelectedDate(formattedDate);
    setEditingTask(null);
    setTaskContent('');
    setIsDialogOpen(true);
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-50 rounded-xl shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AiOutlineCalendar className="h-6 w-6 text-gray-700" />
          <h2 className="text-2xl font-semibold text-gray-800">
            {format(currentDate, 'MMMM yyyy')}
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
          const taskDate = format(date, 'yyyy-MM-dd');
          const tasks = useTaskStore.getState().getTasksByDate(taskDate);

          return (
            <DayCell
              key={index}
              date={date}
              tasks={tasks}
              isCurrentMonth={isSameMonth(date, currentDate)}
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
        onSubmit={(taskData: Task) => console.log(taskData)}
      />
      <DisplayTaskListDialog
        isTaskListDialogOpen={isDisplayTaskListDialogOpen}
        setIsTaskListDialogOpen={setIsDisplayTaskListDialogOpen}
        selectedDayTasks={selectedDayTasks}
        setSelectedDayTasks={setSelectedDayTasks}
        handleEditTask={handleEditTask}
        taskList={tasks}
      />
    </div>
  );
};

export default Calendar;
