import { useMutation, useQueryClient } from '@tanstack/react-query';
import {Owner} from '@/types';
import {updateOwner} from "@/api/OwnersAPI";

export const useEditOwner = (ownerId: string | null) => {
    const queryClient = useQueryClient();

    const editOwner = async (ownerData :Partial<Owner>): Promise<Owner> => {
        console.log("OwnerData: ", ownerData);

        if (!ownerId ) {
            throw new Error('Owner ID is not available');
        }

        return await updateOwner(ownerId, ownerData);
    };

    // Mutations
    return useMutation({
        mutationFn: editOwner,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['owner'] });
            await queryClient.refetchQueries({ queryKey: ['owner'] });
        },
        onError: (error: Error) => {
            // Handle the error (e.g., show a notification)
            console.error('Error editing owner:', error);
        },
    });
};
