// salon-owner-app/src/context/SalonContext.tsx
import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useSalonQuery } from '@/hooks/salonHooks/useSalonQuery';
import { Salon } from '@/types';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
// import {useOwnerIdContext} from "./OwnerIdContext"; // Assuming you have this utility for fetching ownerId
import { useAuth } from './AuthContext';
interface SalonContextType {
    salons: Salon[] | null;
    isSalonsLoading: boolean;
    isSalonsError: boolean;
    salonsError: Error | null;
    refetchSalons: (options?: RefetchOptions) => Promise<QueryObserverResult<Salon[] | null, Error>>;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

export const SalonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { owner} = useAuth();
 
    // Call the useSalonQuery with ownerId when available
    const {
        data: salons = null,
        isLoading: isSalonsLoading,
        isError: isSalonsError,
        error: salonsError,
        refetch: refetchSalons
    } = useSalonQuery(); // Pass ownerId here

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo<SalonContextType>(() => ({
        salons,
        isSalonsLoading,
        isSalonsError,
        salonsError: salonsError as Error | null,
        refetchSalons,
    }), [salons, isSalonsLoading, isSalonsError, salonsError, refetchSalons]);

    // Render loading state only after all hooks have been initialized
    // if (isOwnerIdLoading) {
    //     return <>{/* You can return a loading spinner here */}</>;
    // }

    return (
        <SalonContext.Provider value={contextValue}>
            {children}
        </SalonContext.Provider>
    );
};

export const useSalonContext = () => {
    const context = useContext(SalonContext);
    if (!context) {
        throw new Error('useSalonContext must be used within a SalonProvider');
    }
    return context;
};
