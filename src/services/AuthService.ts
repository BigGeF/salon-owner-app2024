// src/services/authGoogleSignIn.ts

import { getAuth, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import axios from 'axios';
import app from '@/config/firebase'; // 导入已初始化的 Firebase 应用
import { refreshIdToken } from '@/utils/auth'; // 如果您有这个函数
const API_BASE_URL = process.env.API_BASE_URL
// 定义 signInWithGoogle 函数
export const signInWithGoogle = async (): Promise<User> => {
  const auth = getAuth(app); // 使用已初始化的 Firebase 应用
  const provider = new GoogleAuthProvider();

  console.log("Signing in with Google from authGoogleSignIn.ts");

  // 启动 Google 登录弹窗
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const initialIdToken = await user.getIdToken();

  console.log("User info: " + user.uid);
  console.log("User initial idToken " + initialIdToken);
  console.log("signInWithPopup from authGoogleSignIn.ts", result);
  await refreshIdToken(user);

  // 将初始 ID 令牌发送到后端
  const response = await axios.post(`${API_BASE_URL}/auth/social-login`, { idToken: initialIdToken });
  console.log("Backend response data: ", response.data);

  return user;
};
