import { useMutation } from '@tanstack/react-query';
import {deleteClientBySalonId} from '@/api/ClientAPI';

interface DeleteClientParams {
    salonId: string;
    clientId: string;
}

export const useDeleteClient = () => {
    //const queryClient = useQueryClient();

    const deleteNewClient = async ({ salonId, clientId }: DeleteClientParams): Promise<void> => {

        return await deleteClientBySalonId(salonId, clientId);
    };

    // Mutations
    return useMutation({
        mutationFn: deleteNewClient,
        onSuccess: async () => {
            // Optionally refetch or invalidate queries related to clients
            // await queryClient.invalidateQueries({ queryKey: ['clients'] });
            // await queryClient.refetchQueries({ queryKey: ['clients'] });
        },
        onError: (error: Error) => {
            // Handle the error (e.g., show a notification)
            console.error('Error deleting client:', error);
        },
    });
};
