import React, { useState } from 'react';
import {
  AiOutlineCalendar,
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlineLeft,
  AiOutlineRight,
} from 'react-icons/ai';
import useTaskStore, { Task, TaskList } from '@/lib/store/task-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

interface Note {
  id: string;
  date: string;
  content: string;
  color?: string;
}

interface DayProps {
  date: Date;
  tasks: Task[];
  isCurrentMonth: boolean;
  onAddTask: (date: string) => void;
  onEditTask: (task: Task) => void;
}

const DayCell: React.FC<DayProps> = ({
  date,
  tasks,
  isCurrentMonth,
  onAddTask,
  onEditTask,
}) => {
  const { deleteTask } = useTaskStore();
  const formattedDate = date.toISOString().split('T')[0];
  const isToday = new Date().toISOString().split('T')[0] === formattedDate;

  return (
    <div
      className={`min-h-[120px] border-[0.5px] border-gray-200 p-2 transition-colors ${
        isCurrentMonth ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-100'
      }`}
    >
      <div className="flex justify-between items-center">
        <span
          className={`${
            isToday
              ? 'bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium'
              : 'text-sm text-gray-600'
          }`}
        >
          {date.getDate()}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-gray-200"
          onClick={() => onAddTask(formattedDate)}
        >
          <AiOutlinePlus className="h-3 w-3 text-gray-600" />
        </Button>
      </div>
      <div className="mt-2 space-y-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="text-xs p-1.5 rounded-md border shadow-sm 
                     flex justify-between items-center group hover:border-gray-300 transition-all"
            style={{
              backgroundColor: task.color || '#F3F4F6',
              borderColor: task.color || '#E5E7EB',
            }}
          >
            <span className="truncate text-gray-700">{task.content}</span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEditTask(task)}
                className="hover:text-blue-600 p-1 rounded-md hover:bg-gray-100"
              >
                <AiOutlineEdit className="h-3 w-3" />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="hover:text-red-600 p-1 rounded-md hover:bg-gray-100"
              >
                <AiOutlineClose className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Calendar: React.FC = () => {
  const { addTask, editTask } = useTaskStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskContent, setTaskContent] = useState('');
  const [taskColor, setTaskColor] = useState('#3B82F6');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: Date[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(new Date(year, month, -i));
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

  // const handleDeleteNote = (noteId: string) => {
  //   setNotes(notes.filter((note) => note.id !== noteId));
  // };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
        {weekDays.map((day) => (
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
    </div>
  );
};

export default Calendar;
