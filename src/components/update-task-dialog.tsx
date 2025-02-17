import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskFormSchema, TaskFormSchemaType } from '@/types/task';
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
  onSubmit: (taskData: Task) => void;
}

const UpdateTaskDialog: React.FC<UpdateTaskDialogProps> = ({
  editingTask,
  isDialogOpen,
  setIsDialogOpen,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TaskFormSchemaType>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: {
      content: '',
      startDate: '',
      endDate: '',
      status: 'todo',
    },
  });

  const status = watch('status');

  React.useEffect(() => {
    if (editingTask) {
      setValue('content', editingTask.content);
      setValue('startDate', editingTask.start_date);
      setValue('endDate', editingTask.end_date || '');
      setValue('status', editingTask.status);
    }
  }, [editingTask, setValue]);

  const onSubmitForm = handleSubmit((data: TaskFormSchemaType) => {
    const formattedData = {
      id: editingTask?.id || '',
      user_id: editingTask?.user_id || '',
      content: data.content,
      start_date: data.startDate,
      end_date: data.endDate === '' ? undefined : data.endDate,
      status: data.status,
    };

    console.log('formattedData', formattedData);

    onSubmit(formattedData);
    reset();
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="bg-gray-50 border-0">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmitForm} className="space-y-4">
          <div>
            <label className="block text-gray-700">Task Description</label>
            <textarea
              {...register('content')}
              className="w-full min-h-[120px] p-3 border border-gray-200 rounded-lg 
                              focus:ring-2 focus:ring-blue-500 focus:border-transparent
                              placeholder:text-gray-400 text-gray-700 bg-white"
              placeholder="Enter your task..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">
                {errors.content.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              {...register('endDate')}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700">Status</label>
            <Select
              value={status}
              onValueChange={(value) =>
                setValue('status', value as 'todo' | 'inProgress' | 'done')
              }
            >
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
              type="button"
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                reset();
              }}
              className="hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Update Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTaskDialog;
