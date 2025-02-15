import React from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import useTaskStore from '@/lib/store/task-store';
import { Task, TaskFormSchemaType, TaskList } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UpdateTaskDialog from './update-task-dialog';
import CreateTaskDialog from './create-task-dialog';
import { supabase } from '@/lib/supabase';

const Board: React.FC = () => {
  const { tasks, fetchTasks, addTask, deleteTask } = useTaskStore();
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

  const createTask = async (taskData: TaskFormSchemaType) => {
    const { data, error } = await supabase.auth.getSession();

    const userId = data.session?.user.id;

    const formattedTask = {
      id: uuidv4(),
      content: taskData.content,
      start_date: taskData.startDate,
      end_date: taskData.endDate === '' ? undefined : taskData.endDate,
      status: taskData.status,
      user_id: userId,
    };

    addTask(formattedTask as Task);
  };

  const handleSaveTask = () => {
    if (taskContent.trim()) {
      setIsDialogOpen(false);
      setEditingTask(null);
      setTaskContent('');
    }
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

        <div className="flex gap-6 justify-center flex-1 h-full">
          {(Object.entries(tasks) as [keyof TaskList, Task[]][]).map(
            ([listName, listTasks]) => (
              <div key={listName} className="w-96 h-full">
                <Card className="h-full flex flex-col bg-gray-50">
                  <CardContent className="flex flex-col h-full p-4">
                    <h3 className="text-lg font-bold text-gray-700 capitalize mb-4">
                      {listName} ({listTasks.length})
                    </h3>
                    <div className="flex-1 overflow-y-auto">
                      <div className="flex flex-col gap-2">
                        {listTasks.map((task) => (
                          <div
                            key={task.id}
                            className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md"
                          >
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium text-gray-800">
                                {task.content}
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleEditClick(task)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                  onClick={() => deleteTask(task.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          )}
        </div>
      </div>

      <CreateTaskDialog
        isDialogOpen={isCreateDialogOpen}
        setIsDialogOpen={setIsCreateDialogOpen}
        onSubmit={createTask}
      />

      <UpdateTaskDialog
        editingTask={editingTask}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default Board;
