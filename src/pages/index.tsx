import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Login from '@/components/login';
import Calendar from '@/components/calendar';
import Board from '@/components/board';

export default function Home() {
  const { user, isLoading } = useAuth();

  const [activeComponent, setActiveComponent] = useState('calendar');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div>
      <nav className="flex justify-center gap-4 bg-gray-100 p-4 border-b border-gray-300">
        <button
          className={`px-6 py-2 rounded-md transition-all duration-300 ${
            activeComponent === 'calendar'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-200'
          }`}
          onClick={() => setActiveComponent('calendar')}
        >
          Calendar
        </button>
        <button
          className={`px-6 py-2 rounded-md transition-all duration-300 ${
            activeComponent === 'board'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-200'
          }`}
          onClick={() => setActiveComponent('board')}
        >
          Board
        </button>
      </nav>
      <div className="mt-4 p-4">
        <div className="grid grid-cols-1 gap-4">
          {activeComponent === 'calendar' && <Calendar />}
          {activeComponent === 'board' && <Board />}
        </div>
      </div>
    </div>
  );
}
