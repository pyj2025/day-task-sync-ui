import AuthGuard from '@/components/auth-guard';
import Board from '@/components/board';

export default function BoardPage() {
  return (
    <AuthGuard>
      <Board />
    </AuthGuard>
  );
}
