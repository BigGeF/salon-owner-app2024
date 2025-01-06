import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback } from 'react';
import { useServicesQuery } from '@/hooks/serviceHooks/useServicesQuery';
import { ServiceAndCat } from '@/types';

interface ServiceContextType {
    services: ServiceAndCat[];
    refetchServices: () => void;
    servicesIsLoading: boolean;
    isServicesError: boolean;
    servicesError: Error | null;
    setSalonIdInServices: (id: string) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [salonId, setSalonIdInServicesRaw] = useState<string>('');
    const { data: services = [], refetch: refetchServicesRaw, isLoading: servicesIsLoading, isError: isServicesError, error: servicesError } = useServicesQuery();

    // Memoize the refetchServices function
    const refetchServices = useCallback(() => {
        refetchServicesRaw();
    }, [refetchServicesRaw]);

    // Memoize the setSalonIdInServices function
    const setSalonIdInServices = useCallback((id: string) => {
        setSalonIdInServicesRaw(id);
    }, []);

    useEffect(() => {
        if (salonId) {
            void refetchServices();
        }
    }, [salonId, refetchServices]);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        services,
        refetchServices,
        servicesIsLoading,
        isServicesError,
        servicesError,
        setSalonIdInServices,
    }), [services, refetchServices, servicesIsLoading, isServicesError, servicesError, setSalonIdInServices]);

    return (
        <ServiceContext.Provider value={contextValue}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useServiceContext = () => {
    const context = useContext(ServiceContext);
    if (context === undefined) {
        throw new Error('useServiceContext must be used within a ServiceProvider');
    }
    return context;
};
