// import React, {createContext, useContext, ReactNode, useCallback, useMemo} from 'react';
// import { useOwnerQuery } from '@/hooks/ownerHooks/useOwnerQuery';
// import {Owner} from '@/types';
// import {QueryObserverResult, RefetchOptions} from "@tanstack/react-query";
// import {useOwnerIdContext} from "./OwnerIdContext";

// interface OwnerContextType {
//     owner: Owner | null;
//     isOwnerLoading: boolean;
//     isOwnerError: boolean;
//     ownerError: Error | null;
//     refetchOwner: (options?: RefetchOptions) => Promise<QueryObserverResult<Owner | null, Error>>;
// }

// const OwnerContext = createContext<OwnerContextType | undefined>(undefined);

// export const OwnerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//     const { ownerId, isOwnerIdLoading } = useOwnerIdContext();
//     console.log('OwnerId-------',ownerId);
    
//     const {
//         data: owner = null,
//         isLoading: isOwnerLoading,
//         isError: isOwnerError,
//         error: ownerError,
//         refetch: refetchOwner
//     } = useOwnerQuery(ownerId);

//     // Memoize the refetch function
//     const refetch = useCallback(async (): Promise<void> => {
//         await refetchOwner();
//     }, [refetchOwner]);

//     // Memoize the context value
//     const contextValue = useMemo<OwnerContextType>(() => ({
//         owner,
//         isOwnerLoading,
//         isOwnerError,
//         ownerError,
//         refetchOwner,
//     }), [owner, isOwnerLoading, isOwnerError, ownerError, refetchOwner]);

//     // Render loading state only after all hooks have been initialized
//     if (isOwnerIdLoading) {
//         return <>{/* You can return a loading spinner here */}</>;
//     }

//     return (
//         <OwnerContext.Provider value={contextValue}>
//             {children}
//         </OwnerContext.Provider>
//     );
// };

// export const useOwnerContext = () => {
//     const context = useContext(OwnerContext);
//     if (context === undefined) {
//         throw new Error('useOwnerContext must be used within an OwnerProvider');
//     }
//     return context;
// };
