import { useQuery } from '@tanstack/react-query';
import { getCategoriesBySalonId } from '@/api/CategoriesAPI';
import { Category } from '@/types';
import {useAuth} from "@/context/AuthContext";
import {useDefaultSalonIdContext} from "@/context/DefaultSalonIdContext";

export const useCategoriesQuery = () => {
    const { isAuthenticated } = useAuth();
    const {defaultSalonId} = useDefaultSalonIdContext();
    const fetchCategories = async (): Promise<Category[]> => {
        if (!defaultSalonId){
            throw new Error('Salon ID is missing. Cannot fetch services');
        }
        return await getCategoriesBySalonId(defaultSalonId);
    };

    return useQuery({
        queryKey: ['categories', defaultSalonId, isAuthenticated],
        queryFn: fetchCategories,
        enabled: isAuthenticated && !!defaultSalonId,
        staleTime: 60000, // 1 minute
        gcTime: 300000, // 5 minutes
    });
};
