import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import Login from '@/components/login';
import Calendar from '@/components/calendar';
import Board from '@/components/board';

interface HomeProps {
  activeComponent: string;
  setActiveComponent: (component: string) => void;
}

export default function Home({
  activeComponent,
  setActiveComponent,
}: HomeProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push('/');
      } else {
        router.push('/login');
      }
    };

    checkUser();
  }, [router]);

  if (!user) {
    return <Login />;
  }

  return (
    <>
      {activeComponent === 'calendar' && <Calendar />}
      {activeComponent === 'board' && <Board />}
    </>
  );
}
