import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAppointment } from '@/api/AppointmentAPI';
import { Appointment } from '@/types';

export const useUpdateAppointment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newAppointment: Partial<Appointment>) => updateAppointment(newAppointment),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['appointments'] });
        },
        onError: (error: Error) => {
            console.error('Error updating appointment:', error);
        },
    });
};
