import AuthGuard from '@/components/auth-guard';
import Calendar from '@/components/calendar';

export default function CalendarPage() {
  return (
    <AuthGuard>
      <Calendar />
    </AuthGuard>
  );
}
