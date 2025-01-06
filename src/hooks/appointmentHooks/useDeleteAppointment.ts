import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAppointment } from '@/api/AppointmentAPI';

export const useDeleteAppointment = () => {
    const queryClient = useQueryClient();

    
    return useMutation({
        mutationFn: deleteAppointment,
        onSuccess: () => {
            console.log("Appointment deleted");
            
            void queryClient.invalidateQueries({ queryKey: ['appointments'] });
        },
        onError: (error: Error) => {
            console.error('Error creating appointment:', error);
        },
    });
};
