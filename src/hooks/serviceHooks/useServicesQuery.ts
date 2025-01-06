import { useQuery } from '@tanstack/react-query';
import { getServicesBySalonId } from '@/api/ServicesAPI';
import { ServiceAndCat } from '@/types';
import {useAuth} from "@/context/AuthContext";
import {useDefaultSalonIdContext} from "@/context/DefaultSalonIdContext";

export const useServicesQuery = () => {
    const {isAuthenticated} = useAuth();
    const {defaultSalonId} = useDefaultSalonIdContext();
    const fetchServices = async (): Promise<ServiceAndCat[]> => {
        if (!defaultSalonId){
            throw new Error('Salon ID is missing. Cannot fetch services');
        }
        return await getServicesBySalonId(defaultSalonId);
    };

    return useQuery({
        queryKey: ['services', defaultSalonId, isAuthenticated],
        queryFn: fetchServices,
        enabled: isAuthenticated && !!defaultSalonId,
        staleTime: 60000, // 1 minute
        gcTime: 120000, // 2 minutes
    });
};
