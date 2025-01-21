import React, { useState } from 'react';
import {
  AiOutlineCalendar,
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlineLeft,
  AiOutlineRight,
} from 'react-icons/ai';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

interface Note {
  id: string;
  date: string;
  content: string;
  color?: string;
}

interface DayProps {
  date: Date;
  notes: Note[];
  isCurrentMonth: boolean;
  onAddNote: (date: string) => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
}

const DayCell: React.FC<DayProps> = ({
  date,
  notes,
  isCurrentMonth,
  onAddNote,
  onEditNote,
  onDeleteNote,
}) => {
  const formattedDate = date.toISOString().split('T')[0];
  const isToday = new Date().toISOString().split('T')[0] === formattedDate;

  return (
    <div
      className={`min-h-[120px] border-[0.5px] border-gray-200 p-2 transition-colors ${
        isCurrentMonth ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-100'
      }`}
    >
      <div className="flex justify-between items-center">
        <span
          className={`${
            isToday
              ? 'bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium'
              : 'text-sm text-gray-600'
          }`}
        >
          {date.getDate()}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-gray-200"
          onClick={() => onAddNote(formattedDate)}
        >
          <AiOutlinePlus className="h-3 w-3 text-gray-600" />
        </Button>
      </div>
      <div className="mt-2 space-y-1">
        {notes.map((note) => (
          <div
            key={note.id}
            className="text-xs p-1.5 rounded-md bg-white border border-gray-200 shadow-sm 
                     flex justify-between items-center group hover:border-gray-300 transition-all"
          >
            <span className="truncate text-gray-700">{note.content}</span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEditNote(note)}
                className="hover:text-blue-600 p-1 rounded-md hover:bg-gray-100"
              >
                <AiOutlineEdit className="h-3 w-3" />
              </button>
              <button
                onClick={() => onDeleteNote(note.id)}
                className="hover:text-red-600 p-1 rounded-md hover:bg-gray-100"
              >
                <AiOutlineClose className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: Date[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(new Date(year, month, -i));
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleAddNote = (date: string) => {
    setSelectedDate(date);
    setEditingNote(null);
    setNoteContent('');
    setIsDialogOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteContent(note.content);
    setIsDialogOpen(true);
  };

  const handleSaveNote = () => {
    if (editingNote) {
      setNotes(
        notes.map((note) =>
          note.id === editingNote.id ? { ...note, content: noteContent } : note
        )
      );
    } else {
      setNotes([
        ...notes,
        {
          id: Math.random().toString(36).substr(2, 9),
          date: selectedDate,
          content: noteContent,
        },
      ]);
    }
    setIsDialogOpen(false);
    setNoteContent('');
    setEditingNote(null);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AiOutlineCalendar className="h-6 w-6 text-gray-700" />
          <h2 className="text-2xl font-semibold text-gray-800">
            {currentDate.toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePreviousMonth}
            className="hover:bg-gray-100"
          >
            <AiOutlineLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={handleNextMonth}
            className="hover:bg-gray-100"
          >
            Next
            <AiOutlineRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-white rounded-lg shadow-sm overflow-hidden">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center font-medium text-gray-600 bg-gray-100 border-b border-gray-200"
          >
            {day}
          </div>
        ))}
        {days.map((date, index) => (
          <DayCell
            key={index}
            date={date}
            notes={notes.filter(
              (note) => note.date === date.toISOString().split('T')[0]
            )}
            isCurrentMonth={date.getMonth() === currentDate.getMonth()}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
          />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-50 border-0">
          <DialogHeader>
            <DialogTitle className="text-gray-800">
              {editingNote ? 'Edit Note' : 'Add Note'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full min-h-[120px] p-3 border border-gray-200 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder:text-gray-400 text-gray-700 bg-white"
              placeholder="Enter your note..."
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
                onClick={handleSaveNote}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
