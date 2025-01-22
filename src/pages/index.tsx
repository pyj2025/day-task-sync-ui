import React from 'react';
import Calendar from '@/components/calendar';
import Board from '@/components/board';

export default function Home() {
  const [activeComponent, setActiveComponent] = React.useState('calendar');

  return (
    <div>
      <nav className="flex justify-center gap-4 bg-gray-100 p-4 border-b border-gray-300">
        <button
          className={`px-4 py-2 rounded ${
            activeComponent === 'calendar'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
          onClick={() => setActiveComponent('calendar')}
        >
          Calendar
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeComponent === 'board'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
          onClick={() => setActiveComponent('board')}
        >
          Board
        </button>
      </nav>
      <div className="mt-4">
        {activeComponent === 'calendar' && <Calendar />}
        {activeComponent === 'board' && <Board />}
      </div>
    </div>
  );
}
