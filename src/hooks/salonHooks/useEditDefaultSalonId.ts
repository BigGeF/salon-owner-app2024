import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setDefaultSalonId } from '@/utils/auth';

interface EditDefaultSalonIdParams {
    defaultSalonId: string;
}

export const useEditDefaultSalonId = (ownerId: string | null) => {
    const queryClient = useQueryClient();

    const editDefaultSalonId = async ({ defaultSalonId }: EditDefaultSalonIdParams): Promise<void> => {
        if (!ownerId) {
            throw new Error('Owner ID is not available');
        }

        await setDefaultSalonId(ownerId, defaultSalonId);
    };

    return useMutation({
        mutationFn: editDefaultSalonId,
        onSuccess: async () => {
            console.log("Default Salon ID Update Success");
            await queryClient.invalidateQueries({ queryKey: ['defaultSalon'] });
            await queryClient.refetchQueries({ queryKey: ['defaultSalon'] });
        },
        onError: (error: Error) => {
            console.error('Error updating default salon ID:', error);
        },
    });
};
