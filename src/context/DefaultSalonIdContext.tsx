import React, { createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { useDefaultSalonQuery } from '@/hooks/salonHooks/useDefaultSalonQuery';

interface DefaultSalonContextType {
    defaultSalonId: string | null;
    isDefaultSalonIdLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

const DefaultSalonIdContext = createContext<DefaultSalonContextType | undefined>(undefined);

export const DefaultSalonIdProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { data: defaultSalonId = '', isLoading, isError, error, refetch: refetchDefaultSalon } = useDefaultSalonQuery();

    // Memoize the refetch function
    const refetch = useCallback(async (): Promise<void> => {
        await refetchDefaultSalon();
        // Optionally, refetch other related data if needed
    }, [refetchDefaultSalon]);

    // Memoize the context value
    const contextValue = useMemo(() => ({
        defaultSalonId,
        isDefaultSalonIdLoading: isLoading,
        isError,
        error,
        refetch,
    }), [defaultSalonId, isLoading, isError, error, refetch]);

    return (
        <DefaultSalonIdContext.Provider value={contextValue}>
            {children}
        </DefaultSalonIdContext.Provider>
    );
};

export const useDefaultSalonIdContext = () => {
    const context = useContext(DefaultSalonIdContext);
    if (context === undefined) {
        throw new Error('useDefaultSalonContext must be used within a DefaultSalonProvider');
    }
    return context;
};
