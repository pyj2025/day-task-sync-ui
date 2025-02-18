import React from 'react';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { supabase } from '@/lib/supabase';
import useTaskStore from '@/lib/store/task-store';
import { Task, TaskFormSchemaType, TaskListType } from '@/types/task';
import { Button } from '@/components/ui/button';
import UpdateTaskDialog from './update-task-dialog';
import CreateTaskDialog from './create-task-dialog';
import TaskList from './task-list';

const Board: React.FC = () => {
  const { tasks, fetchTasks, addTask, deleteTask, updateTask } = useTaskStore();
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    fetchTasks();
  }, []);

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
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
            {(Object.entries(tasks) as [keyof TaskListType, Task[]][]).map(
              ([listName, listTasks]) => (
                <TaskList
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
