import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEmployee } from '@/api/employeeAPI';
import { Employee } from '@/types';

export const useEditEmployee = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newEmployee: Partial<Employee>) => {
            if (!newEmployee._id) {
                throw new Error('Employee ID is required');
            }
            return updateEmployee(newEmployee._id, newEmployee);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
        onError: (error: Error) => {
            console.error('Error updating employee:', error);
        },
        
    });
};
