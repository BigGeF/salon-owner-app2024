import Storage from './storage';
import {UserConfig} from "@/types"; // Import your optimized storage module
import { User } from 'firebase/auth';

export const refreshIdToken = async (user: User) => {
    try {
      const idTokenResult = await user.getIdTokenResult(true); // 强制刷新
      console.log("ID Token refreshed:", idTokenResult);
      return idTokenResult;
    } catch (error) {
      console.error("Error refreshing ID token:", error);
      throw error;
    }
  };

// Token Storage Functions
export const setTokens = async (accessToken: string, refreshToken: string) => {
    await Storage.setItem('accessToken', accessToken);
    await Storage.setItem('refreshToken', refreshToken);
};

export const getAccessToken = async (): Promise<string | null> => {
    return await Storage.getItem('accessToken');
};

export const getRefreshToken = async (): Promise<string | null> => {
    return await Storage.getItem('refreshToken');
};

export const clearTokens = async () => {
    await Storage.deleteItem('accessToken');
    await Storage.deleteItem('refreshToken');
};

// Owner Storage Functions
export const getOwnerId = async (): Promise<{ ownerId: string | null }> => {
    try {
        const ownerId = await Storage.getItem('ownerId');
        console.log("Owner ID retrieved:", ownerId);
        return { ownerId };
    } catch (error) {
        console.error('Error retrieving owner ID:', error);
        return { ownerId: null };
    }
};

export const setOwnerId = async (ownerId: string): Promise<void> => {
    try {
        await Storage.setItem('ownerId', ownerId);
        console.log('Owner ID saved:', ownerId);
    } catch (error) {
        console.error('Error saving owner ID:', error);
    }
};

export const removeOwnerId = async (): Promise<void> => {
    await Storage.deleteItem('ownerId');
};

export const getDefaultSalonId = async (ownerId: string): Promise<{ defaultSalonId: string | null }> => {
    const defaultSalonId = await Storage.getItem(`${ownerId}-defaultSalonId`);
    return { defaultSalonId };
};

export const setDefaultSalonId = async (ownerId: string, defaultSalonId: string): Promise<void> => {
    await Storage.setItem(`${ownerId}-defaultSalonId`, defaultSalonId);
};

// Save user configuration settings
export const getUserConfig = async (ownerId: string): Promise<UserConfig> => {
    const config = await Storage.getItem(`${ownerId}-userConfig`);

    if (config) {
        return JSON.parse(config) as UserConfig;
    }

    // Default config if none exists
    const defaultConfig: UserConfig = { language: 'en', theme: 'light' };
    await setUserConfig(ownerId, defaultConfig); // Save the default config
    return defaultConfig; // Return the default config
};

export const setUserConfig = async (ownerId: string, config: UserConfig): Promise<void> => {
    await Storage.setItem(`${ownerId}-userConfig`, JSON.stringify(config));
};


