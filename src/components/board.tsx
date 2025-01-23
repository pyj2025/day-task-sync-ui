import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AddDialog } from './add-dialog';

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

  // 나머지 코드는 이전과 동일
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

  // 나머지 렌더링 코드는 동일하지만 AddDialog로 변경
  return (
    <div className="h-[90vh] bg-gray-100 p-6">
      <div className="h-full max-w-7xl mx-auto flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Board</h2>
          <AddDialog onAddTask={handleAddTask} />
        </div>

        {/* 나머지 코드는 이전과 동일 */}
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
                            {listName === 'done' && task.endDate && (
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
