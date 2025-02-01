import AuthGuard from '@/components/AuthGuard';
import Board from '@/components/board';

export default function BoardPage() {
  return (
    <AuthGuard>
      <Board />
    </AuthGuard>
  );
}
