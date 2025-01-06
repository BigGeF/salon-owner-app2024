// src/services/authLogout.ts

import { getAuth, signOut } from 'firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

// Define the logout function
export const logout = async () => {
  console.log("logged out--------------------------------")
  
  const queryClient = useQueryClient(); // Get Query Client instance
  const router = useRouter(); // Get Router instance

  try {
    const auth = getAuth(); // Get Firebase Auth instance

    // Use Firebase's signOut function to log out
    console.log("auth----",auth);
    
    await signOut(auth);

    // Reset React Query's cache
    await queryClient.resetQueries();

    // Redirect to the login page
    router.replace('auth'); 

    console.log('User logged out successfully');
  } catch (error) {
    console.error('Logout failed:', error);
    throw new Error('Logout failed');
  }
};
