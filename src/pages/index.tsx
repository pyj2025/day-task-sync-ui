import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import useTaskStore from '@/lib/store/task-store';
import Login from '@/components/login';
import Calendar from '@/components/calendar';
import Board from '@/components/board';

interface HomeProps {
  activeComponent: string;
}

export default function Home({ activeComponent }: HomeProps) {
  const { userId } = useTaskStore();
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

  if (!userId) {
    return <Login />;
  }

  return (
    <>
      {activeComponent === 'calendar' && <Calendar />}
      {activeComponent === 'board' && <Board />}
    </>
  );
}
