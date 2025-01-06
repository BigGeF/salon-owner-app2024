import {useQuery, UseQueryResult} from '@tanstack/react-query';
import { getOwnerByFirebaseUid } from '@/api/OwnersAPI';
import { Owner } from '@/types';
import { useAuth } from '@/context/AuthContext';

export const useOwnerQuery = (ownerId: string | null): UseQueryResult<Owner | null, Error> => {
    const { isAuthenticated } = useAuth();

    return useQuery<Owner | null, Error>({
        queryKey: ['owner'],
        queryFn: async () => {
            if (!ownerId || !isAuthenticated) return null;
            return await getOwnerByFirebaseUid();
        },
        enabled: isAuthenticated,
        staleTime: 60000, // 1 minute
        gcTime: 120000, // 2 minutes (renamed from cacheTime)
    });
};
