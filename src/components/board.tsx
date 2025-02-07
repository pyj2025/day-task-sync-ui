import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import useTaskStore, { Task, TaskList } from '@/lib/store/task-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UpdateTaskDialog from './update-task-dialog';

const Board: React.FC = () => {
  const { tasks, fetchTasks, moveTask, deleteTask, editTask } = useTaskStore();
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
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

  const handleSaveTask = () => {
    if (editingTask && taskContent.trim()) {
      setIsDialogOpen(true);
      setEditingTask(null);
      setTaskContent('');
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    id: string,
    sourceList: keyof TaskList
  ) => {
    e.dataTransfer.setData('taskId', id);
    e.dataTransfer.setData('sourceList', sourceList);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetList: keyof TaskList
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceList = e.dataTransfer.getData('sourceList') as keyof TaskList;

    if (sourceList === targetList) return;

    moveTask(taskId, sourceList, targetList);
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  return (
    <div className="h-[90vh] bg-gray-100 p-6">
      <div className="h-full max-w-7xl mx-auto flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Board</h2>
        </div>

        <div className="flex gap-6 justify-center flex-1 h-full">
          {(Object.entries(tasks) as [keyof TaskList, Task[]][]).map(
            ([listName, listTasks]) => (
              <div
                key={listName}
                className="w-96 h-full"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, listName)}
              >
                <Card className="h-full flex flex-col bg-gray-50">
                  <CardContent className="flex flex-col h-full p-4">
                    <h3 className="text-lg font-bold text-gray-700 capitalize mb-4 flex-shrink-0">
                      {listName} ({listTasks.length})
                    </h3>
                    <div className="flex-1 min-h-0">
                      <div className="h-full overflow-y-auto">
                        <div className="flex flex-col gap-2">
                          {listTasks.map((task) => (
                            <div
                              key={task.id}
                              draggable
                              onDragStart={(e) =>
                                handleDragStart(e, task.id, listName)
                              }
                              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">
                                    {task.content}
                                  </p>
                                  <div className="mt-2 text-xs text-gray-500">
                                    <span>Start: {task.start_date}</span>
                                    {listName === 'done' && task.end_date && (
                                      <span className="ml-2">
                                        End: {task.end_date}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2 ml-4">
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
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDelete(task.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          )}
        </div>
      </div>

      <UpdateTaskDialog
        editingTask={editingTask}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        taskContent={taskContent}
        setTaskContent={setTaskContent}
        saveTask={handleSaveTask}
      />
    </div>
  );
};

export default Board;
