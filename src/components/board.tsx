import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AddDialog } from './add-dialog';
import { Button } from '@/components/ui/button';

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
      { id: '3', content: 'Study React Hooks', startDate: '2025-01-22' },
      { id: '4', content: 'Create UI Components', startDate: '2025-01-22' },
      { id: '5', content: 'Optimize Performance', startDate: '2025-01-23' },
      { id: '6', content: 'Write Documentation', startDate: '2025-01-23' },
      { id: '7', content: 'Design Database Schema', startDate: '2025-01-24' },
      { id: '8', content: 'Implement Authentication', startDate: '2025-01-24' },
      { id: '9', content: 'Setup CI/CD Pipeline', startDate: '2025-01-25' },
      { id: '10', content: 'Create Test Cases', startDate: '2025-01-25' },
      { id: '11', content: 'Review Code', startDate: '2025-01-26' },
      { id: '12', content: 'Refactor Legacy Code', startDate: '2025-01-26' },
    ],
    inProgress: [],
    done: [],
  });

  const [visibleTasks, setVisibleTasks] = useState<{
    [key in keyof TaskList]: number;
  }>({
    todo: 7,
    inProgress: 7,
    done: 7,
  });

  const handleAddTask = (taskContent: string, startDate: string) => {
    const task: Task = {
      id: Date.now().toString(),
      content: taskContent,
      startDate: startDate,
    };

    setTasks((prev) => ({
      ...prev,
      todo: [...prev.todo, task],
    }));
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

  const handleShowMore = (listName: keyof TaskList) => {
    setVisibleTasks((prev) => ({
      ...prev,
      [listName]: prev[listName] + 7,
    }));
  };

  return (
    <div className="h-[90vh] bg-gray-100 p-6">
      <div className="h-full max-w-7xl mx-auto flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Board</h2>
          <AddDialog onAddTask={handleAddTask} />
        </div>

        <div className="flex gap-6 justify-center flex-1">
          {(Object.entries(tasks) as [keyof TaskList, Task[]][]).map(
            ([listName, listTasks]) => {
              const displayedTasks = listTasks.slice(0, visibleTasks[listName]);
              const hasMoreTasks = listTasks.length > visibleTasks[listName];

              return (
                <div
                  key={listName}
                  className="w-96 h-full"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, listName)}
                >
                  <Card className="bg-gray-50 h-full">
                    <CardContent className="p-4 h-full flex flex-col">
                      <h3 className="text-lg font-bold text-gray-700 capitalize mb-4">
                        {listName} ({listTasks.length})
                      </h3>
                      <div className="flex-grow overflow-y-auto mb-4">
                        <div className="flex flex-col gap-2">
                          {displayedTasks.map((task) => (
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
                                {listName === 'done' && task.endDate && (
                                  <span className="ml-2">
                                    End: {task.endDate}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {hasMoreTasks && (
                        <Button
                          variant="outline"
                          onClick={() => handleShowMore(listName)}
                          className="w-full"
                        >
                          Show More
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
