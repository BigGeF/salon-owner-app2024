import { useMutation } from '@tanstack/react-query';
import { updateServiceById } from '@/api/ServicesAPI';
import { Service } from '@/types';

interface EditServiceParams {
    salonId: string;
    serviceId: string;
    serviceData: Partial<Service>;
}

export const useEditService = () => {
    //const queryClient = useQueryClient();

    const editService = async ({ salonId, serviceId, serviceData }: EditServiceParams): Promise<Service> => {

        return await updateServiceById(salonId, serviceId, serviceData);
    };

    return useMutation({
        mutationFn: editService,
        onSuccess: async () => {
            console.log("Service Update Success");
            //await queryClient.invalidateQueries({ queryKey: ['services'] });
            //await queryClient.refetchQueries({ queryKey: ['services'] });
        },
        onError: (error: Error) => {
            // Handle the error (e.g., show a notification)
            console.error('Error updating service:', error);
        },
    });
};
// salon-owner-app/src/hooks/serviceHooks/useEditService.ts