// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Owner } from '@/types';
import { getAuth, onAuthStateChanged,signInWithPopup, signOut, User, GoogleAuthProvider } from 'firebase/auth';
import { createOwner, getOwnerByFirebaseUid } from '@/api/OwnersAPI';
import { login } from '@/api/AuthAPI';
import { removeOwnerId, setOwnerId } from '@/utils/auth';
import app from '@/config/firebase';  // Ensure Firebase is already initialized

import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri, ResponseType } from 'expo-auth-session';
import { initializeApp } from 'firebase/app';
import { useRegistration } from './RegistrationContext';
const API_BASE_URL = process.env.API_BASE_URL
import { signInWithGoogle as signInWithGoogleService } from '@/services/AuthService';

interface AuthContextProps {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  owner: Owner | null;
  ownerId: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  refreshOwner: (owner:Owner) => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const auth = getAuth(app); // Memoize so it doesn't change on input updates

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [ownerId, setOwnerIdState] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { registrationData, setRegistrationData } = useRegistration();

  // 获取 Firebase Authentication 实例
  // const auth = getAuth();
  console.log('Firebase Auth Instance:', auth);


  // **刷新 ID 令牌的辅助函数**
  //  const refreshIdToken = async (user: User) => {
  //   try {
  //     const idTokenResult = await user.getIdTokenResult(true); // 强制刷新
  //     console.log("ID Token refreshed:", idTokenResult);
  //     return idTokenResult;
  //   } catch (error) {
  //     console.error("Error refreshing ID token:", error);
  //     throw error;
  //   }
  // };
  const refreshOwner = (owner: Owner) => {
    setOwner(owner);
    setOwnerId(owner.firebaseUid);
}

  // 设置监听器以检测用户的身份验证状态变化
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticating(true);

        try {
          await user.getIdToken(true);
          let ownerData = await getOwnerByFirebaseUid(user.uid);

          if (!ownerData) {
            if (registrationData) {
              // 使用注册数据创建 Owner
              //Create
              await createOwner({
                firebaseUid: user.uid,
                email: registrationData.email,
                ...registrationData,
              });
              // 清空注册数据
              setRegistrationData({});
              // 再次获取 Owner 数据
              ownerData = await getOwnerByFirebaseUid(user.uid);
              console.log("ownerData",ownerData);
              
            } else {
              console.error('No registration data available.');
              // 处理没有注册数据的情况
            }
          }

          if (ownerData) {
            setOwner(ownerData);
            await setOwnerIdState(user.uid);
            await setOwnerId(user.uid); 
            setIsAuthenticated(true);
          } else {
            throw new Error('Failed to retrieve or create owner data');
          }
        } catch (error) {
          // 错误处理
        } finally {
          setIsAuthenticating(false);
        }
      } else {
        // 用户已注销
        setIsAuthenticated(false);
        setOwner(null);
        removeOwnerId();
        setIsAuthenticating(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [registrationData]);

// 在 AuthProvider 组件内部
const signInWithGoogle = useCallback(async () => {
  setIsAuthenticating(true);
  const provider = new GoogleAuthProvider();

  try {
    console.log("Signing in with Google from AuthContext.tsx");

    // 启动 Google 登录弹窗
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const initialIdToken = await user.getIdToken(); // 获取初始 ID 令牌



    // 将初始 ID 令牌发送到后端
    const response = await axios.post(`${API_BASE_URL}/auth/social-login`, { idToken: initialIdToken });
    const data = response.data;
    const uid= data.uid;
    console.log("User info------------------------: ",uid);
    
    console.log("Backend response data: ", data);

    // 后端设置自定义声明后，强制刷新 ID 令牌
    const idTokenResult = await user.getIdTokenResult(true); // 强制刷新
    console.log("Refreshed ID Token Result:", idTokenResult);

    // refreshOwner(data);

  } catch (error) {
    console.error("Google login failed: ", error);
    setIsAuthenticated(false);
    setOwner(null);
    setOwnerIdState(null);
    throw error;
  } finally {
    setIsAuthenticating(false);
  }
}, [auth]);



  
  // 登录函数，使用 Firebase Authentication
  const loginUser = useCallback(
    async (email: string, password: string) => {
      setIsAuthenticating(true);

      try {
        // 使用 Firebase Authentication 登录
        await login(email, password);
        // 身份验证状态将在 onAuthStateChanged 中处理
      } catch (error) {
        console.error('AuthProvider: 登录错误:', error);
        setIsAuthenticated(false);
        setOwner(null);
        setOwnerIdState(null);
        throw error;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [auth]
  );

  // 注销函数，使用 Firebase Authentication
  const logout = useCallback(async () => {
    setIsAuthenticating(true);
    try {
      // 使用 Firebase Authentication 注销
      await signOut(auth);
      // 身份验证状态将在 onAuthStateChanged 中处理
      await queryClient.resetQueries(); // 重置 React Query 缓存
      router.replace('auth'); // 重定向到登录页面
    } catch (error) {
      console.error('AuthProvider: 注销错误:', error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  }, [auth, queryClient, router]);

  // 备忘录化上下文值，避免不必要的重新渲染
  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      isAuthenticating,
      owner,
      ownerId,
      loginUser,
      logout,
      signInWithGoogle,
      refreshOwner,
    }),
    [isAuthenticated, isAuthenticating, owner, ownerId, loginUser, logout,refreshOwner]);
  ;

  console.log("AuthContext Provider Value:", contextValue);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  // console.log("useAuth context:", context); 

  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内使用');
  }
  return context;
};
