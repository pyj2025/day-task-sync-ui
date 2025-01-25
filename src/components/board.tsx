import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddDialog } from './add-dialog';
import useTaskStore, { Task, TaskList } from '@/lib/store/task-store';

const Board: React.FC = () => {
  const { tasks, visibleTasks, moveTask, showMoreTasks } = useTaskStore();

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

  return (
    <div className="h-[90vh] bg-gray-100 p-6">
      <div className="h-full max-w-7xl mx-auto flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Board</h2>
          <AddDialog onAddTask={useTaskStore.getState().addTask} />
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
                          onClick={() => showMoreTasks(listName)}
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
