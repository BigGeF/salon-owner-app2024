// src/api/OwnersAPI.ts

import { getAuth, updatePassword } from 'firebase/auth';
import api from './api';
import { Owner } from '@/types';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL


// 创建业主函数（注册）
// Function to create a new owner (registration)
export const createOwner = async (ownerData: Partial<Owner>): Promise<Owner> => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error('用户未登录 / User is not logged in');
  }

  try {
    // 获取 Firebase ID 令牌
    const idToken = await user.getIdToken();

    // 将业主数据与 ID 令牌一起发送到后端
    const response = await axios.post(`${API_BASE_URL}/auth/social-login`, {
      idToken,
      ...ownerData,
    });


    const owner = response.data.owner;
    return owner;
  } catch (error) {
    console.error('Failed to create owner: ', error);
    throw error;
  }
};

// export const getOwnerByOwnerId = async (ownerId: string): Promise<Owner | null> => {
//   try {
//     // 从后端获取业主数据
//     // Get owner data from backend
//     const response = await api.get<Owner>(`/owners/${ownerId}`);

//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response?.status === 404) {
//       console.warn('Owner not found in the database.');
//       return null; // 返回 null 表示未找到

//     } else {
//       console.error('Failed to fetch owner data:', error);
//       throw new Error('获取业主数据失败 / Failed to fetch owner data');
//     }
//   }
// };

// 获取当前业主数据函数（通过 Firebase UID）
// Function to get current owner data by Firebase UID
export const getOwnerByFirebaseUid = async (firebaseUid?: string): Promise<Owner | null> => {
  const auth = getAuth();
  const owner = auth.currentUser;
  console.log("from Owner api getOwnerByFirebaseUid", owner);

  if (!owner) {
    throw new Error('用户未登录 / User is not logged in');
  }

  try {
    // 从后端获取业主数据
    // Get owner data from backend

    const response = await api.get<Owner>(`/owners/${owner.uid}`);
    
    return response.data;
  } 
  catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn('Owner not found in the database.');
      return null; // 返回 null 表示未找到

    } else {
      console.error('Failed to fetch owner data:', error);
      throw new Error('Failed to fetch owner data');
    }
  }
};

// Function to update owner data
export const updateOwner = async (ownerId: string, ownerData: Partial<Owner>): Promise<Owner> => {
  try {
    const response = await api.put<Owner>(`/owners/${ownerId}`, ownerData);
    return response.data;
  } catch (error) {
    console.error('Failed to update owner data: ', error);
    throw new Error('更新业主数据失败 / Failed to update owner data');
  }
};

// 更新业主密码函数
// Function to update owner's password
export const updateOwnerPassword = async (newPassword: string): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    try {
      // 使用 Firebase Authentication 更新密码
      // Update password using Firebase Authentication
      await updatePassword(user, newPassword);
    } catch (error: any) {
      console.error('更新密码失败: ', error);
      console.error('Failed to update password: ', error);
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('请重新登录再试 / Please re-login and try again');
      }
      throw new Error('更新密码失败 / Failed to update password');
    }
  } else {
    throw new Error('用户未登录 / User is not logged in');
  }
};
