import { useMutation } from '@tanstack/react-query';
import { addClientBySalonId } from '@/api/ClientAPI';
import { Client } from '@/types';

interface AddClientParams {
    salonId: string;
    clientData: Partial<Client>;
}

export const useAddClient = () => {
    //const queryClient = useQueryClient();

    const addNewClient = async ({ salonId, clientData }: AddClientParams): Promise<Client> => {

        return await addClientBySalonId(salonId, clientData);
    };

    // Mutations
    return useMutation({
        mutationFn: addNewClient,
        onSuccess: async () => {
            // Optionally refetch or invalidate queries related to clients
            // await queryClient.invalidateQueries({ queryKey: ['clients'] });
            // await queryClient.refetchQueries({ queryKey: ['clients'] });
        },
        onError: (error: Error) => {
            // Handle the error (e.g., show a notification)
            console.error('Error adding client:', error);
        },
    });
};
