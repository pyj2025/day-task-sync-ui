import React from 'react';
import { AiOutlinePlus, AiOutlineClose, AiOutlineEdit } from 'react-icons/ai';
import useTaskStore, { Task } from '@/lib/store/task-store';
import { Button } from './ui/button';

interface DayProps {
  date: Date;
  tasks: Task[];
  isCurrentMonth: boolean;
  onAddTask: (date: string) => void;
  onEditTask: (task: Task) => void;
  onDayClick: (date: Date, tasks: Task[]) => void;
}

const DayCell: React.FC<DayProps> = ({
  date,
  tasks,
  isCurrentMonth,
  onAddTask,
  onEditTask,
  onDayClick,
}) => {
  const { deleteTask } = useTaskStore();
  const formattedDate = date.toISOString().split('T')[0];
  const isToday = new Date().toISOString().split('T')[0] === formattedDate;

  return (
    <div
      className={`min-h-[120px] border-[0.5px] border-gray-200 p-2 transition-colors cursor-pointer ${
        isCurrentMonth ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-100'
      }`}
      onClick={() => onDayClick(date, tasks)}
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
          onClick={(e) => {
            e.stopPropagation();
            onAddTask(formattedDate);
          }}
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
              backgroundColor: '#F3F4F6',
              borderColor: '#E5E7EB',
            }}
            onClick={(e) => e.stopPropagation()}
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

export default DayCell;
