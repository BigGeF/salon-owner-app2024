import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getSalonsByOwnerId } from '@/api/SalonsAPI';
import { Salon } from '@/types';
import { useAuth } from "@/context/AuthContext";

export const useSalonQuery = (): UseQueryResult<Salon[] | null, Error> => {
    const { isAuthenticated, owner } = useAuth(); // ==
    const ownerId = owner?._id || null;
    
    console.log("Use SalonQuery - ownerId: ", ownerId);

    return useQuery<Salon[] | null, Error>({
        queryKey: ['salons', owner, isAuthenticated],
        queryFn: async () => {
            if (!owner?._id ) return null;
            return await getSalonsByOwnerId(owner?._id);
        },
        enabled: !!ownerId && isAuthenticated, // 仅在 ownerId 和已验证时启用查询
        staleTime: 60000, // 1 分钟
        gcTime: 120000, // 2 分钟（React Query 缓存时间）
    });
};

