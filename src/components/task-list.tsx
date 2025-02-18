import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Task, TaskListType } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import TaskItem from './task-item';
import { TaskItemTypes } from '@/lib/constants';

interface TaskListProps {
  listName: keyof TaskListType;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (
    dragIndex: number,
    hoverIndex: number,
    sourceList: string,
    targetList: string
  ) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  listName,
  tasks,
  onEdit,
  onDelete,
  onMove,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: TaskItemTypes.TASK,
    drop: (item: any) => {
      if (item.listName !== listName) {
        console.log('!!!!! item===== ', item);

        onMove(item.index, tasks.length, item.listName, listName);
      }
    },
  });

  drop(ref);

  return (
    <div ref={ref} className="w-96 h-full">
      <Card className="h-full flex flex-col bg-gray-50">
        <CardContent className="flex flex-col h-full p-4">
          <h3 className="text-lg font-bold text-gray-700 capitalize mb-4">
            {listName} ({tasks.length})
          </h3>
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2">
              {tasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  listName={listName}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onMove={onMove}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskList;
