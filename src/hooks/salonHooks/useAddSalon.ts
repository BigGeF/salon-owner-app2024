import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addSalonByOwnerId } from '@/api/SalonsAPI';
import { Salon } from '@/types';
import { setDefaultSalonId } from '@/utils/auth';
import { useSalonContext } from '@/context/SalonContext';

interface AddSalonParams {
    salonData: Partial<Salon>;
}

export const useAddSalon = () => {
    const queryClient = useQueryClient();
    const { salons } = useSalonContext();

    const addNewSalon = async ({ salonData }: AddSalonParams): Promise<Salon> => {
        return await addSalonByOwnerId(salonData);
    };

    return useMutation({
        mutationFn: addNewSalon,
        onSuccess: async (data) => {
            // 设置第一个美容院为默认美容院
            if (!salons || salons.length === 0) {
                if (data.ownerUid && data._id) {
                    await setDefaultSalonId(data.ownerUid, data._id);
                    await queryClient.invalidateQueries({ queryKey: ['defaultSalon'] });
                    await queryClient.refetchQueries({ queryKey: ['defaultSalon'] });
                }
            }
            console.log("useAddSalon - onSuccess data: ", data);
            await queryClient.invalidateQueries({ queryKey: ['salons'] });
            await queryClient.refetchQueries({ queryKey: ['salons'] });
        },
        onError: (error: Error) => {
            console.error('Error adding salon:', error);
        },
    });
};
