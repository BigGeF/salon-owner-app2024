import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { updateSalonById } from '@/api/SalonsAPI';
import { Salon } from '@/types';

interface EditSalonParams {
    salonId: string;
    salonData: Partial<Salon>;
}

export const useEditSalon = (): UseMutationResult<Salon, Error, EditSalonParams, Salon> => {
    const queryClient = useQueryClient();

    const editSalon = async ({ salonId, salonData }: EditSalonParams): Promise<Salon> => {
        return await updateSalonById(salonId, salonData);
    };

    return useMutation({
        mutationFn: editSalon,
        onSuccess: async () => {
            console.log("Salon Update Success");
            await queryClient.refetchQueries({ queryKey: ['salons'] });
        },
        onError: (error: Error) => {
            console.error('Error updating salon:', error);
        },
    });
};
