import React from 'react';
import { Task } from '@/lib/store/task-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

interface UpdateTaskDialogProps {
  editingTask: Task | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  taskContent: string;
  setTaskContent: (content: string) => void;
  saveTask: () => void;
}

const UpdateTaskDialog: React.FC<UpdateTaskDialogProps> = ({
  editingTask,
  isDialogOpen,
  setIsDialogOpen,
  taskContent,
  setTaskContent,
  saveTask,
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="bg-gray-50 border-0">
        <DialogHeader>
          <DialogTitle className="text-gray-800">
            {editingTask ? 'Edit Task' : 'Add Task'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <textarea
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
            className="w-full min-h-[120px] p-3 border border-gray-200 rounded-lg 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      placeholder:text-gray-400 text-gray-700 bg-white"
            placeholder="Enter your task..."
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={saveTask}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={!taskContent.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTaskDialog;
