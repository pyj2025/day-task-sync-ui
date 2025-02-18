import React, { useRef } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { TaskItemTypes } from '@/lib/constants';

interface TaskItemProps {
  task: Task;
  index: number;
  listName: string;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (id: string, sourceList: string, targetList: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index,
  listName,
  onEdit,
  onDelete,
  onMove,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: TaskItemTypes.TASK,
    item: { type: TaskItemTypes.TASK, id: task.id, index, listName },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: TaskItemTypes.TASK,
    hover: (item: any, monitor) => {
      if (!ref.current) return;
      if (!monitor.isOver({ shallow: true })) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      const sourceList = item.listName;
      const targetList = listName;

      if (dragIndex === hoverIndex && sourceList === targetList) return;

      onMove(item.id, sourceList, targetList);
      item.index = hoverIndex;
      item.listName = targetList;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`p-4 bg-white border rounded-lg shadow-sm hover:shadow-md ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-gray-800">{task.content}</p>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onEdit(task)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            onClick={() => onDelete(task)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
