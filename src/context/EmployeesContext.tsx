import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback } from 'react';
import useEmployeesQuery from '@/hooks/employeeHooks/useEmployeesQuery';
import { Employee } from '@/types';

interface EmployeesContextType {
    employees: Employee[];
    refetch: () => void;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    setSalonId: (id: string) => void;
}

const EmployeesContext = createContext<EmployeesContextType | undefined>(undefined);

export const EmployeesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [salonId, setSalonIdRaw] = useState<string>('');
    const { data: employees = [], refetch: refetchEmployeesRaw, isLoading, isError, error } = useEmployeesQuery(salonId);

    // Memoize the refetch function
    const refetch = useCallback(() => {
        refetchEmployeesRaw();
    }, [refetchEmployeesRaw]);

    // Memoize the setSalonId function
    const setSalonId = useCallback((id: string) => {
        setSalonIdRaw(id);
    }, []);

    useEffect(() => {
        if (salonId) {
            void refetch();
        }
    }, [salonId, refetch]);

    // Memoize the context value
    const contextValue = useMemo(() => ({
        employees,
        refetch,
        isLoading,
        isError,
        error,
        setSalonId,
    }), [employees, refetch, isLoading, isError, error, setSalonId]);

    return (
        <EmployeesContext.Provider value={contextValue}>
            {children}
        </EmployeesContext.Provider>
    );
};

export const useEmployeesContext = () => {
    const context = useContext(EmployeesContext);
    if (context === undefined) {
        throw new Error('useEmployeesContext must be used within an EmployeesProvider');
    }
    return context;
};
