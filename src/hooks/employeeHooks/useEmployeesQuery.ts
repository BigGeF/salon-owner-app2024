import { useQuery } from '@tanstack/react-query';
import { getEmployeesBySalonId } from '@/api/employeeAPI';
import { Employee } from '@/types';
import {useDefaultSalonIdContext} from "@/context/DefaultSalonIdContext";
import {useAuth} from "@/context/AuthContext";

export const useEmployeesQuery = (salonId: string) => {
    const {isAuthenticated} = useAuth();
    const {defaultSalonId} = useDefaultSalonIdContext();
    const fetchEmployees = async (): Promise<Employee[]> => {
        if (!defaultSalonId){
            throw new Error('Salon ID is missing. Cannot fetch employees');
        }

        return await getEmployeesBySalonId(defaultSalonId);
    };

    return useQuery<Employee[], Error>({
        queryKey: ['employees', defaultSalonId, isAuthenticated],
        queryFn: fetchEmployees,
        enabled: isAuthenticated && !!salonId,
        staleTime: 60000, // 1 minute
        gcTime: 120000, // 2 minutes
    });
};

export default useEmployeesQuery;
