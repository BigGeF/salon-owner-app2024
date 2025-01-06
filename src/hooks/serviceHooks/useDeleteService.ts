import { useMutation } from '@tanstack/react-query';
import { deleteServiceById } from '@/api/ServicesAPI';

interface DeleteServiceParams {
    salonId: string;
    serviceId: string;
}

export const useDeleteService = () => {
    //const queryClient = useQueryClient();

    const deleteService = async ({ salonId, serviceId }: DeleteServiceParams): Promise<void> => {
        console.log("useDeleteService: - salonId: ", salonId);
        console.log("useDeleteService: - serviceId: ", serviceId);
        return await deleteServiceById(salonId, serviceId);
    };

    return useMutation({
        mutationFn: deleteService,
        onSuccess: async () => {
            console.log("Service Deletion Success");
            //await queryClient.invalidateQueries({ queryKey: ['services'] });
            //await queryClient.refetchQueries({ queryKey: ['services'] });
        },
        onError: (error: Error) => {
            // Handle the error (e.g., show a notification)
            console.error('Error deleting service:', error);
        },
    });
};
