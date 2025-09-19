import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { getCookie } from '@/lib/utils';

export function useAuth() {
  const { isAuthenticated, setAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = getCookie('access_token');
    if (token && !isAuthenticated) {
      setAuthenticated(true);
    } else if (!token && isAuthenticated) {
      setAuthenticated(false);
    }
  }, [isAuthenticated, setAuthenticated]);

  return useAuthStore();
}
