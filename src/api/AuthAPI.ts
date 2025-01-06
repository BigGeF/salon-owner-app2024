// src/api/AuthAPI.ts
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import api from './api';
import { Owner } from '@/types';
import axios from 'axios';
import { setOwnerId } from '@/utils/auth';

const API_BASE_URL = process.env.API_BASE_URL;

// 接口：用于返回业主数据
// Interface for the Owner data
export interface OwnerResponse {
  owner: Owner;
}

// 登录函数：处理用户登录
// Function to log in the user
export const login = async (email: string, password: string) => {
  const auth = getAuth();

  try {
    // 使用 Firebase Authentication 登录用户
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 获取 Firebase ID 令牌
    const idToken = await user.getIdToken();

    // 将 idToken 发送到后端
    const response = await axios.post(`${API_BASE_URL}/auth/social-login`, {
      idToken,
    });

    // 处理登录成功后的逻辑
    const owner = response.data.owner;
    
    console.log('User logged in and retrieved:', owner);
    await setOwnerId(owner._id);
    return owner;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }};
// 注册函数：注册新用户
// Function to register a new user
// export const register = async (email: string, password: string, otherData: any) => {
//   const auth = getAuth();
//   console.log("AuthAPI");
  
//   try {
//     // 使用 Firebase Authentication 创建新用户
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // 获取 Firebase ID 令牌
//     const idToken = await user.getIdToken();

//     // 将用户其他数据与 idToken 一起发送到后端
//     const response = await axios.post(`${API_BASE_URL}/auth/social-login`, {
//       idToken,
//       ...otherData, // 包含 firstName、lastName、phone 等
//     });

//     // 处理注册成功后的逻辑
//     const owner = response.data.owner;
//     await setOwnerId(owner._id)
//     console.log('User registered and saved:', owner);

//     return owner;
//   } catch (error) {
//     console.error('Error registering user:', error);
//     throw error;
//   }
// };

// 检查邮箱是否已存在
// Function to check if an email already exists
export const checkIfEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await api.post('/auth/email', {
      email: email,
    });
    console.log("AuthAPI------------",response);
    
    return response.data.exists;
  } catch (error) {
    console.error('检查邮箱时发生网络错误: ', error);
    console.error('Network error while checking email: ', error);
    throw new Error('网络错误 / Network error');
  }
};
