import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';

interface Task {
  id: string;
  content: string;
  startDate: string;
  endDate?: string;
}

const initialData = {
  todo: [
    { id: '1', content: 'Learn TypeScript', startDate: '2025-01-21' },
    { id: '2', content: 'Build Drag & Drop', startDate: '2025-01-21' },
  ],
  inProgress: [],
  done: [],
};

const Board: React.FC = () => {
  const [tasks, setTasks] = useState(initialData);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(tasks[source.droppableId as keyof typeof tasks]);
      const [movedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, movedItem);

      setTasks({
        ...tasks,
        [source.droppableId]: items,
      });
    } else {
      const sourceItems = Array.from(
        tasks[source.droppableId as keyof typeof tasks]
      );
      const destinationItems = Array.from(
        tasks[destination.droppableId as keyof typeof tasks]
      );

      const [movedItem] = sourceItems.splice(source.index, 1) as [Task];
      if (destination.droppableId === 'done') {
        movedItem.endDate = new Date().toISOString().split('T')[0];
      }
      destinationItems.splice(destination.index, 0, movedItem);

      setTasks({
        ...tasks,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destinationItems,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-4">
        {Object.keys(tasks).map((key) => (
          <Droppable droppableId={key} key={key}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col gap-2 p-4 w-80 min-h-[300px] bg-gray-100 border border-gray-300 rounded"
              >
                <h3 className="text-lg font-bold text-gray-700 capitalize">
                  {key}
                </h3>
                {tasks[key as keyof typeof tasks].map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-4 bg-white border border-gray-300 rounded shadow-sm"
                      >
                        <p className="text-sm font-medium text-gray-800">
                          {task.content}
                        </p>
                        <small className="text-xs text-gray-500">
                          Start: {task.startDate}
                          {(task as { endDate?: string }).endDate &&
                            ` | End: ${(task as { endDate?: string }).endDate}`}
                        </small>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;
