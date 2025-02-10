import React, { useState } from 'react';
import { Task } from '@/types/task';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface UpdateTaskDialogProps {
  editingTask: Task | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  taskContent: string;
  setTaskContent: (content: string) => void;
  taskStartDate: string;
  setTaskStartDate: (date: string) => void;
  taskEndDate: string;
  setTaskEndDate: (date: string) => void;
  taskStatus: string;
  setTaskStatus: (status: string) => void;
  saveTask: () => void;
}

const UpdateTaskDialog: React.FC<UpdateTaskDialogProps> = ({
  editingTask,
  isDialogOpen,
  setIsDialogOpen,
  taskContent,
  setTaskContent,
  taskStartDate,
  setTaskStartDate,
  taskEndDate,
  setTaskEndDate,
  taskStatus,
  setTaskStatus,
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
          <div>
            <label className="block text-gray-700">Task Description</label>
            <textarea
              value={taskContent}
              onChange={(e) => setTaskContent(e.target.value)}
              className="w-full min-h-[120px] p-3 border border-gray-200 rounded-lg 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      placeholder:text-gray-400 text-gray-700 bg-white"
              placeholder="Enter your task..."
            />
          </div>
          <div>
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              value={taskStartDate}
              onChange={(e) => setTaskStartDate(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Start Date"
            />
          </div>
          <div>
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              value={taskEndDate}
              onChange={(e) => setTaskEndDate(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="End Date"
            />
          </div>
          <div>
            <label className="block text-gray-700">Status</label>
            <Select value={taskStatus} onValueChange={setTaskStatus}>
              <SelectTrigger className="w-full bg-white p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="inProgress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
              disabled={!taskContent.trim() || !taskStartDate.trim()}
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
