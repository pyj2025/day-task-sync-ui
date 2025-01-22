import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Task {
  id: string;
  content: string;
  startDate: string;
  endDate?: string;
}

type TaskList = {
  [key in 'todo' | 'inProgress' | 'done']: Task[];
};

interface DragEvent<T = Element> extends React.DragEvent<T> {
  dataTransfer: DataTransfer;
}

const Board: React.FC = () => {
  const [tasks, setTasks] = useState<TaskList>({
    todo: [
      { id: '1', content: 'Learn TypeScript', startDate: '2025-01-21' },
      { id: '2', content: 'Build Drag & Drop', startDate: '2025-01-21' },
    ],
    inProgress: [],
    done: [],
  });

  const [newTask, setNewTask] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        content: newTask.trim(),
        startDate: new Date().toISOString().split('T')[0],
      };

      setTasks((prev) => ({
        ...prev,
        todo: [...prev.todo, task],
      }));
      setNewTask('');
      setIsDialogOpen(false);
    }
  };

  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    id: string,
    sourceList: keyof TaskList
  ) => {
    e.dataTransfer.setData('taskId', id);
    e.dataTransfer.setData('sourceList', sourceList);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    targetList: keyof TaskList
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceList = e.dataTransfer.getData('sourceList') as keyof TaskList;

    if (sourceList === targetList) return;

    const sourceTasks = [...tasks[sourceList]];
    const targetTasks = [...tasks[targetList]];

    const taskToMove = sourceTasks.find((task) => task.id === taskId);
    if (!taskToMove) return;

    const updatedTask = { ...taskToMove };
    if (targetList === 'done') {
      updatedTask.endDate = new Date().toISOString().split('T')[0];
    }

    setTasks({
      ...tasks,
      [sourceList]: sourceTasks.filter((task) => task.id !== taskId),
      [targetList]: [...targetTasks, updatedTask],
    });
  };

  return (
    <div className="h-[90vh] bg-gray-100 p-6">
      <div className="h-full max-w-7xl mx-auto flex flex-col">
        {/* Header with Add Task Button */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Kanban Board</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={20} /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <div>Task Description</div>
                  <input
                    id="task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter task description"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Task</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-6 justify-center flex-1">
          {(Object.entries(tasks) as [keyof TaskList, Task[]][]).map(
            ([listName, listTasks]) => (
              <div
                key={listName}
                className="w-96 h-full"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, listName)}
              >
                <Card className="bg-gray-50 h-full">
                  <CardContent className="p-4 h-full">
                    <h3 className="text-lg font-bold text-gray-700 capitalize mb-4">
                      {listName} ({listTasks.length})
                    </h3>
                    <div className="flex flex-col gap-2 h-[calc(100%-2rem)] overflow-y-auto">
                      {listTasks.map((task) => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, task.id, listName)
                          }
                          className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow"
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {task.content}
                          </p>
                          <div className="mt-2 text-xs text-gray-500">
                            <span>Start: {task.startDate}</span>
                            {task.endDate && (
                              <span className="ml-2">End: {task.endDate}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
