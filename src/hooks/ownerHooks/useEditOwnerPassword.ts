import { useMutation, useQueryClient } from '@tanstack/react-query';
import {Owner} from '@/types';
import {updateOwnerPassword} from "@/api/OwnersAPI";

interface EditOwnerPasswordParams {
    currentPassword: string;
    newPassword: string;
}

export const useEditOwnerPassword = (ownerId: string | null) => {
    const queryClient = useQueryClient();

    const editOwnerPassword = async ({ currentPassword, newPassword }: EditOwnerPasswordParams): Promise<Owner> => {
        if (!ownerId ) {
            throw new Error('Owner ID is not available');
        }

        return await updateOwnerPassword(ownerId, currentPassword, newPassword);
    };

    return useMutation({
        mutationFn: editOwnerPassword,
        onSuccess: async () => {
            console.log("Password Update Success");
            await queryClient.invalidateQueries({ queryKey: ['owner'] });
            await queryClient.refetchQueries({ queryKey: ['owner'] });
        },
        onError: (error: Error) => {
            console.error('Error updating owner password:', error);
        },
    });
};
