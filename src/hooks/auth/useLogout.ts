// src/hooks/useLogout.ts

import { useCallback } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

export const useLogout = () => {
  const auth = getAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      await queryClient.resetQueries();
      router.replace('auth');
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error('Logout failed');
    }
  }, [auth, queryClient, router]);

  return logout;
};
