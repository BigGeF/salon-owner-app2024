import { useQuery } from '@tanstack/react-query';
import { getClientsBySalonId } from '@/api/ClientAPI';
import { Client } from '@/types';
import {useAuth} from "@/context/AuthContext";
import {useDefaultSalonIdContext} from "@/context/DefaultSalonIdContext";

export const useClientsQuery = () => {
    const {isAuthenticated} = useAuth();
    const {defaultSalonId} = useDefaultSalonIdContext();
    const fetchClients = async (): Promise<Client[]> => {
        if (!defaultSalonId){
            throw new Error('Salon ID is missing. Cannot fetch services');
        }

        return await getClientsBySalonId(defaultSalonId);
    };

    return useQuery({
        queryKey: ['clients', defaultSalonId, isAuthenticated],
        queryFn: fetchClients,
        enabled: isAuthenticated && !!defaultSalonId,
        staleTime: 60000, // 1 minute
        gcTime: 120000, // 2 minutes
    });
};
