import { useQuery } from '@tanstack/react-query';
import { getAppointmentsBySalonId } from '@/api/AppointmentAPI';
import { Appointment } from '@/types';
import {useAuth} from "@/context/AuthContext";
import {useDefaultSalonIdContext} from "@/context/DefaultSalonIdContext";

export const useAppointmentsQuery = (salonId: string,startDate?:string, endDate?:string) => {
    const {isAuthenticated} = useAuth();
    const {defaultSalonId} = useDefaultSalonIdContext();
        const fetchAppointments = async (): Promise<Appointment[]> => {
        return await getAppointmentsBySalonId(salonId, startDate, endDate);
    };

    return useQuery({
        queryKey: ['appointments', salonId, defaultSalonId, isAuthenticated],
        queryFn: fetchAppointments,
        enabled: isAuthenticated && !!salonId && !!defaultSalonId,
        staleTime: 60000, // 1 minute
        gcTime: 120000, // 2 minutes
    });
};
