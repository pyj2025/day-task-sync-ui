import React from 'react';
import Image from 'next/image';
import {
  Settings,
  LogOut,
  Calendar as CalendarIcon,
  LayoutGrid,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Toaster } from '@/components/ui/sonner';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  activeComponent: string;
  onComponentChange: (component: string) => void;
}

export default function Layout({
  children,
  user,
  activeComponent,
  onComponentChange,
}: LayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!user) return <>{children}</>;

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Image
                  src="/images/logo.svg"
                  alt="DayTaskSync Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <div className="text-xl font-semibold text-blue-600">
                  Day Task Sync
                </div>
              </div>
              <nav className="flex space-x-6">
                <button
                  onClick={() => onComponentChange('calendar')}
                  className={`flex items-center space-x-2 px-1 py-2 text-sm font-medium relative ${
                    activeComponent === 'calendar'
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span>Calendar</span>
                  {activeComponent === 'calendar' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => onComponentChange('board')}
                  className={`flex items-center space-x-2 px-1 py-2 text-sm font-medium relative ${
                    activeComponent === 'board'
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span>Board</span>
                  {activeComponent === 'board' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              </nav>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full bg-gray-100"
                >
                  <span className="sr-only">Open menu</span>
                  <Settings size={12} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-2 bg-white/60 backdrop-blur-lg border border-gray-100 shadow-lg rounded-lg"
              >
                <DropdownMenuItem className="py-2 focus:bg-transparent">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.email}
                    </p>
                    <p className="text-xs text-gray-500">Account settings</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="py-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto p-2">
        <div className="h-full">{children}</div>
      </main>
      <Toaster />
    </div>
  );
}
