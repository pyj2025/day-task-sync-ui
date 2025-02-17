import React, { useRef } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { supabase } from '@/lib/supabase';
import useTaskStore from '@/lib/store/task-store';
import { Task, TaskFormSchemaType, TaskList } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UpdateTaskDialog from './update-task-dialog';
import CreateTaskDialog from './create-task-dialog';

const ItemTypes = {
  TASK: 'task',
};

interface DraggableTaskProps {
  task: Task;
  index: number;
  listName: string;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (
    dragIndex: number,
    hoverIndex: number,
    sourceList: string,
    targetList: string
  ) => void;
}

const DraggableTask: React.FC<DraggableTaskProps> = ({
  task,
  index,
  listName,
  onEdit,
  onDelete,
  onMove,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { type: ItemTypes.TASK, id: task.id, index, listName },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover: (item: any, monitor) => {
      if (!ref.current) return;
      if (!monitor.isOver({ shallow: true })) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      const sourceList = item.listName;
      const targetList = listName;

      if (dragIndex === hoverIndex && sourceList === targetList) return;

      onMove(dragIndex, hoverIndex, sourceList, targetList);
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

interface TaskListProps {
  listName: keyof TaskList;
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

const TaskList2: React.FC<TaskListProps> = ({
  listName,
  tasks,
  onEdit,
  onDelete,
  onMove,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item: any) => {
      if (item.listName !== listName) {
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
                <DraggableTask
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

const Board: React.FC = () => {
  const { tasks, fetchTasks, addTask, deleteTask, updateTask } = useTaskStore();
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [taskContent, setTaskContent] = React.useState('');

  React.useEffect(() => {
    fetchTasks();
  }, []);

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setTaskContent(task.content);
    setIsDialogOpen(true);
  };

  const handleAddTask = async (item: TaskFormSchemaType) => {
    toast.loading('Creating task...');

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw new Error('Failed to authenticate');
      }

      const userId = data.session?.user.id;

      const formattedTask = {
        id: uuidv4(),
        content: item.content,
        start_date: item.startDate,
        end_date: item.endDate === '' ? undefined : item.endDate,
        status: item.status,
        user_id: userId,
      };

      addTask(formattedTask as Task);
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task');
    } finally {
      toast.dismiss();
      setIsCreateDialogOpen(false);
    }
  };

  const handleDeleteTask = async (item: Task) => {
    toast.loading('Deleting task...');

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw new Error('Failed to authenticate');
      }

      const userId = data.session?.user.id;

      if (!userId || !item.user_id || item.user_id !== userId) {
        throw new Error('Failed to authenticate');
      }

      deleteTask(item.id);
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    } finally {
      toast.dismiss();
    }
  };

  const handleUpdateTask = async (item: Task) => {
    toast.loading('Updating task...');

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw new Error('Failed to authenticate');
      }

      const userId = data.session?.user.id;

      if (!userId || !item.user_id || item.user_id !== userId) {
        throw new Error('Failed to authenticate');
      }

      updateTask(item);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    } finally {
      toast.dismiss();
    }
  };

  const handleMoveTask = (
    dragIndex: number,
    hoverIndex: number,
    sourceList: string,
    targetList: string
  ) => {
    console.log('Moving task:', {
      dragIndex,
      hoverIndex,
      sourceList,
      targetList,
    });
  };

  return (
    <div className="h-[90vh] bg-gray-100 p-6">
      <div className="h-full max-w-7xl mx-auto flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Board</h2>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Task
          </Button>
        </div>

        <DndProvider backend={HTML5Backend}>
          <div className="flex gap-6 justify-center flex-1 h-full">
            {(Object.entries(tasks) as [keyof TaskList, Task[]][]).map(
              ([listName, listTasks]) => (
                <TaskList2
                  key={listName}
                  listName={listName}
                  tasks={listTasks}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteTask}
                  onMove={handleMoveTask}
                />
              )
            )}
          </div>
        </DndProvider>
      </div>

      <CreateTaskDialog
        isDialogOpen={isCreateDialogOpen}
        setIsDialogOpen={setIsCreateDialogOpen}
        onSubmit={handleAddTask}
      />

      <UpdateTaskDialog
        editingTask={editingTask}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        onSubmit={handleUpdateTask}
      />
    </div>
  );
};

export default Board;
