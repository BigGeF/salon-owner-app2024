import { useMutation } from '@tanstack/react-query';
import { updateClientBySalonId} from '@/api/ClientAPI';
import { Client } from '@/types';

interface EditClientParams {
    salonId: string;
    clientId: string;
    clientData: Partial<Client>;
}

export const useEditClient = () => {
    //const queryClient = useQueryClient();

    const editNewClient = async ({ salonId, clientId, clientData }: EditClientParams): Promise<Client> => {

        return await updateClientBySalonId(salonId, clientId, clientData);
    };

    // Mutations
    return useMutation({
        mutationFn: editNewClient,
        onSuccess: async () => {
            // Optionally refetch or invalidate queries related to clients
            // await queryClient.invalidateQueries({ queryKey: ['clients'] });
            // await queryClient.refetchQueries({ queryKey: ['clients'] });
        },
        onError: (error: Error) => {
            // Handle the error (e.g., show a notification)
            console.error('Error editing client:', error);
        },
    });
};
