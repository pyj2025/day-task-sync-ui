import AuthGuard from '@/components/AuthGuard';
import Calendar from '@/components/calendar';

export default function CalendarPage() {
  return (
    <AuthGuard>
      <Calendar />
    </AuthGuard>
  );
}
