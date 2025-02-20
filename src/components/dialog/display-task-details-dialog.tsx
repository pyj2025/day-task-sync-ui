import { AiOutlineClose } from 'react-icons/ai';
import { Task } from '@/types/task';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface DisplayTaskDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const DisplayTaskDetailsDialog: React.FC<DisplayTaskDetailsDialogProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-0">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-gray-800">Task Details</DialogTitle>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <AiOutlineClose className="h-5 w-5 text-gray-600" />
          </button>
        </DialogHeader>
        {task && (
          <div className="space-y-2 p-4">
            <p>
              <strong>Content:</strong> {task.content}
            </p>
            <p>
              <strong>Start Date:</strong> {task.start_date}
            </p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DisplayTaskDetailsDialog;
