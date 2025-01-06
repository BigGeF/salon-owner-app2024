import { useMutation } from '@tanstack/react-query';
import { addServiceByOwnerId } from '@/api/ServicesAPI';
import { Service } from '@/types';

interface AddServiceParams {
    salonId: string;
    serviceData: Partial<Service>;
}

export const useAddService = () => {
    //const queryClient = useQueryClient();

    const addNewService = async ({ salonId, serviceData }: AddServiceParams): Promise<Service> => {
        return await addServiceByOwnerId(salonId, serviceData);
    };

    // Mutations
    return useMutation({
        mutationFn: addNewService,
        onSuccess: async () => {
            //await queryClient.invalidateQueries({ queryKey: ['services'] });
            //await queryClient.refetchQueries({ queryKey: ['services'] });
        },
        onError: (error: Error) => {
            // Handle the error (e.g., show a notification)
            console.error('Error adding service:', error);
        },
    });
};
