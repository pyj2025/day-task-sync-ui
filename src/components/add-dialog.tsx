import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Task } from '@/lib/store/task-store';

interface AddDialogProps {
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

export const AddDialog: React.FC<AddDialogProps> = ({ onAddTask }) => {
  const [newTask, setNewTask] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (newTask.trim()) {
      onAddTask({
        content: newTask.trim(),
        startDate,
      });
      setNewTask('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          <Plus size={20} /> Add
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white shadow-md rounded-lg p-4">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label
              htmlFor="task"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Input
              id="task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter Todo."
            />
          </div>
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
