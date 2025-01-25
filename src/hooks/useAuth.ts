import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUser({});
    setIsLoading(false);
  }, []);

  return { user, isLoading };
}
