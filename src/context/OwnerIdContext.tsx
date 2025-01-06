// import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

// interface OwnerIdContextType {
//   ownerId: string | null;
//   isOwnerIdLoading: boolean;
//   ownerError: Error | null;
// }

// const OwnerIdContext = createContext<OwnerIdContextType | undefined>(undefined);

// export const OwnerIdProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [ownerId, setOwnerId] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     const auth = getAuth();

//     // 设置身份验证状态监听器
//     // Set up authentication state listener
//     const unsubscribe = onAuthStateChanged(
//       auth,
//       (user) => {
//         if (user) {
//           // 用户已登录，获取 UID
//           // User is signed in, get UID
//           setOwnerId(user.uid);
//           console.log("from owneridcontext",user.uid);
          
//         } else {
//           // 用户未登录
//           // User is not logged in
//           setOwnerId(null);
//         }
//         setIsLoading(false);
//       },
//       (err) => {
//         console.error('Auth state change error:', err);
//         setError(err);
//         setIsLoading(false);
//       }
//     );

//     // 组件卸载时取消订阅
//     // Unsubscribe on component unmount
//     return () => unsubscribe();
//   }, []);

//   return (
//     <OwnerIdContext.Provider value={{ ownerId, isOwnerIdLoading: isLoading, ownerError: error }}>
//       {children}
//     </OwnerIdContext.Provider>
//   );
// };

// export const useOwnerIdContext = () => {
//   const context = useContext(OwnerIdContext);
//   console.log("useOwnerIdContext ",context);
  
//   if (!context) {
//     throw new Error('useOwnerIdContext must be used within an OwnerIdProvider');
//   }
//   return context;
// };
