import React from 'react';
import { format, isToday } from 'date-fns';
import { Task } from '@/types/task';

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
  onDayClick,
}) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const isTodayDate = isToday(date);

  const hasMultipleTasks = tasks.length > 1;
  const firstTask = tasks.length > 0 ? tasks[0] : null;
  const remainingTasksCount = tasks.length - 1;

  const taskText = remainingTasksCount === 1 ? 'task' : 'tasks';

  return (
    <div
      className={`min-h-[140px] border-[0.5px] border-gray-200 p-2 transition-colors cursor-pointer ${
        isCurrentMonth ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-100'
      } flex flex-col`}
      onClick={() => onDayClick(date, tasks)}
    >
      <div className="flex justify-between items-center">
        <span
          className={`${
            isTodayDate
              ? 'bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium'
              : 'text-sm text-gray-600'
          }`}
        >
          {date.getDate()}
        </span>
      </div>

      <div className="mt-2 space-y-1 flex-grow">
        {firstTask && (
          <div
            key={firstTask.id}
            className="text-xs p-1.5 rounded-md border shadow-sm 
                    flex justify-between items-center group hover:border-gray-300 transition-all"
            style={{
              backgroundColor: '#F3F4F6',
              borderColor: '#E5E7EB',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="truncate text-gray-700">{firstTask.content}</span>
          </div>
        )}
      </div>

      {hasMultipleTasks && (
        <div className="w-full text-right mt-auto">
          <span
            className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full inline-block italic cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDayClick(date, tasks);
            }}
          >
            +{remainingTasksCount} more {taskText}
          </span>
        </div>
      )}
    </div>
  );
};

export default DayCell;
