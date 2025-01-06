import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback } from 'react';
import { useClientsQuery } from '@/hooks/clientHooks/useClientsQuery';
import { Client } from '@/types';

interface ClientContextType {
    clients: Client[];
    refetchClients: () => void;
    clientsIsLoading: boolean;
    isClientsError: boolean;
    clientsError: Error | null;
    setSalonIdInClients: (id: string) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [salonId, setSalonIdInClients] = useState<string>('');
    const { data: clients = [], refetch: refetchClientsRaw, isLoading: clientsIsLoading, isError: isClientsError, error: clientsError } = useClientsQuery();

    // Memoize the refetchClients function
    const refetchClients = useCallback(() => {
        refetchClientsRaw();
    }, [refetchClientsRaw]);

    // Memoize the setSalonIdInClients function
    const setSalonId = useCallback((id: string) => {
        setSalonIdInClients(id);
    }, []);

    useEffect(() => {
        if (salonId) {
            void refetchClients();
        }
    }, [salonId, refetchClients]);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        clients,
        refetchClients,
        clientsIsLoading,
        isClientsError,
        clientsError,
        setSalonIdInClients: setSalonId,
    }), [clients, refetchClients, clientsIsLoading, isClientsError, clientsError, setSalonId]);

    return (
        <ClientContext.Provider value={contextValue}>
            {children}
        </ClientContext.Provider>
    );
};

export const useClientContext = () => {
    const context = useContext(ClientContext);
    if (context === undefined) {
        throw new Error('useClientContext must be used within a ClientProvider');
    }
    return context;
};
