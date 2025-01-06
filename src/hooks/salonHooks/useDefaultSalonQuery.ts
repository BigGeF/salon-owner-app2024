import { useQuery } from '@tanstack/react-query';
import { getDefaultSalonId, getOwnerId } from '@/utils/auth';
import { useAuth } from "@/context/AuthContext";

export const useDefaultSalonQuery = () => {
    const { isAuthenticated , owner} = useAuth();
    
    const fetchDefaultSalon = async (): Promise<string | null> => {
        const { ownerId } = await getOwnerId();
        console.log("DefaultID",ownerId);
        
        if (ownerId) {
            const { defaultSalonId } = await getDefaultSalonId(ownerId);
            return defaultSalonId;
        }
        return null;
    };

    return useQuery({
        queryKey: ['defaultSalon',owner, isAuthenticated],
        queryFn: fetchDefaultSalon,
        enabled: isAuthenticated,
        staleTime: 60000,
        gcTime: 120000,
    });
};
