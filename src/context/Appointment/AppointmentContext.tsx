import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback } from 'react';
import { useAppointmentsQuery } from '@/hooks/appointmentHooks/useAppointmentsQuery';
import { Appointment } from '@/types';

interface AppointmentContextType {
    appointments: Appointment[];
    refetchAppointments: () => void;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    setSalonId: (id: string) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [salonId, setSalonId] = useState<string>('');
    const { data: appointments = [], refetch: refetchAppointmentsRaw,  isLoading, isError, error } = useAppointmentsQuery(salonId,'2024-09-22',);
    // console.log('appointments:', appointments);  // 打印返回的预约数据

    // Memoize the refetch function
    const refetchAppointments = useCallback(() => {
        refetchAppointmentsRaw();
    }, [refetchAppointmentsRaw]);

    useEffect(() => {
        if (salonId) {
            void refetchAppointments();
        }
    }, [salonId, refetchAppointments]);

    // Memoize the context value
    const contextValue = useMemo(() => ({
        appointments,
        refetchAppointments,
        isLoading,
        isError,
        error,
        setSalonId,
    }), [appointments, refetchAppointments, isLoading, isError, error]);

    return (
        <AppointmentContext.Provider value={contextValue}>
            {children}
        </AppointmentContext.Provider>
    );
};

export const useAppointmentContext = () => {
    const context = useContext(AppointmentContext);
    if (context === undefined) {
        throw new Error('useAppointmentContext must be used within an AppointmentProvider');
    }
    return context;
};