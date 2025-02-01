import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Login from '@/components/login';
import Calendar from '@/components/calendar';
import Board from '@/components/board';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const { user, isLoading } = useAuth();
  const [activeComponent, setActiveComponent] = useState('calendar');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push('/calendar');
      } else {
        router.push('/login');
      }
    };

    checkUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto">
          <Tabs
            value={activeComponent}
            onValueChange={setActiveComponent}
            className="w-full flex justify-center"
          >
            <TabsList className="h-16">
              <TabsTrigger
                value="calendar"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-8"
              >
                Calendar
              </TabsTrigger>
              <TabsTrigger
                value="board"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-8"
              >
                Board
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <main className="flex-1 min-h-0 w-full max-w-6xl mx-auto">
        <div className="h-full">
          {activeComponent === 'calendar' && (
            <div className="h-full">
              <Calendar />
            </div>
          )}
          {activeComponent === 'board' && (
            <div className="h-full">
              <Board />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
