// src/hooks/useFirebaseAuthListener.ts

import { useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getOwnerByFirebaseUid } from '@/api/OwnersAPI';
import { setOwnerId } from '@/utils/auth';

interface UseFirebaseAuthListenerProps {
  setIsAuthenticated: (value: boolean) => void;
  setIsAuthenticating: (value: boolean) => void;
  setOwner: (owner: any) => void;
  setOwnerIdState: (value: string | null) => void;
  refreshIdToken: (user: User) => Promise<any>;
}

export const useFirebaseAuthListener = ({
  setIsAuthenticated,
  setIsAuthenticating,
  setOwner,
  setOwnerIdState,
  refreshIdToken,
}: UseFirebaseAuthListenerProps) => {
  const auth = getAuth();

  useEffect(() => {
    console.log("AuthProvider mounted");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("AuthProvider: onAuthStateChanged triggered", user);
      
      if (user) {
        console.log("AuthProvider: User is signed in", user.uid);
        const idTokenResult = await refreshIdToken(user);

        try {
          // Get custom claims
          const customClaims = idTokenResult.claims;
          console.log("Custom Claims:", customClaims);
          console.log("---------------------------- will show owner after refresh ", customClaims.role);
          
          // Fetch owner data from the backend
          const ownerData = await getOwnerByFirebaseUid(user.uid);
          if ( ownerData && customClaims.role) {
            ownerData.role = customClaims.role.toString().toLowerCase();
          }
          console.log("AuthProvider: Fetched owner data", ownerData);
          setOwner(ownerData);
          setOwnerIdState(user.uid);
          await setOwnerId(user.uid); // Assuming setOwnerId is a utility function to store ownerId
          console.log("user.uid",user.uid);
          
          setIsAuthenticated(true);
        } catch (error) {
          console.error('AuthProvider: Failed to fetch owner data:', error);
          setOwner(null);
          setOwnerIdState(null);
        }
      } else {
        console.log("AuthProvider: User is signed out");
        setIsAuthenticated(false);
        setOwner(null);
        setOwnerIdState(null);
      }
      setIsAuthenticating(false);
    });

    return () => {
      console.log("AuthProvider: Unsubscribing from auth state listener");
      unsubscribe();
    };
  }, [
    auth,
    setIsAuthenticated,
    setIsAuthenticating,
    setOwner,
    setOwnerIdState,
    refreshIdToken,
  ]);
};
