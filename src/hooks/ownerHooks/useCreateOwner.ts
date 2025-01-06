// src/hooks/ownerHooks/useCreateOwner.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOwner } from '@/api/OwnersAPI';
import { Owner } from '@/types';

export const useCreateOwner = () => {
  const queryClient = useQueryClient();

  return useMutation<Owner, Error, Partial<Owner>>({
    mutationFn: (ownerData: Partial<Owner>) => createOwner(ownerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner'] });
    },
    onError: (error: Error) => {
      console.error('Error creating owner:', error);
    },
  });
};
