import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';

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
    <div className="flex gap-4 p-4">
      {(Object.entries(tasks) as [keyof TaskList, Task[]][]).map(
        ([listName, listTasks]) => (
          <div
            key={listName}
            className="w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, listName)}
          >
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-gray-700 capitalize mb-4">
                  {listName}
                </h3>
                <div className="flex flex-col gap-2 min-h-64">
                  {listTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id, listName)}
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
  );
};

export default Board;
