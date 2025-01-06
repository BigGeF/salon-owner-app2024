import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAppointment } from '@/api/AppointmentAPI';
import { Appointment } from '@/types';

export const useCreateAppointment = () => {
    const queryClient = useQueryClient();

    
    return useMutation({
        mutationFn: (newAppointment: Partial<Appointment>) => createAppointment(newAppointment),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['appointments'] });
        },
        onError: (error: Error) => {
            console.error('Error creating appointment:', error);
        },
    });
};
