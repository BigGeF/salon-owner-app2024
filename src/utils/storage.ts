import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js'; // For encryption on web

// Encryption key for web storage
const ENCRYPTION_KEY : string = process.env.ENCRYPTION_KEY || '';

// Helper functions for encryption/decryption on web
const encryptData = (data: string): string => {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

const decryptData = (ciphertext: string | null): string | null => {
    if (!ciphertext) return null;
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

// Define platform-specific storage functions upfront based on platform
let Storage: {
    setItem: (key: string, value: string) => Promise<void>;
    getItem: (key: string) => Promise<string | null>;
    deleteItem: (key: string) => Promise<void>;
};

// Initialize platform-specific storage methods only once
if (Platform.OS === 'web') {
    // Use localStorage for web with encryption
    Storage = {
        setItem: async (key: string, value: string) => {
            localStorage.setItem(key, encryptData(value));
        },
        getItem: async (key: string): Promise<string | null> => {
            const encryptedValue = localStorage.getItem(key);
            return decryptData(encryptedValue);
        },
        deleteItem: async (key: string) => {
            localStorage.removeItem(key);
        },
    };
} else {
    // Use SecureStore for mobile (iOS/Android)
    Storage = {
        setItem: async (key: string, value: string) => {
            await SecureStore.setItemAsync(key, value);
        },
        getItem: async (key: string): Promise<string | null> => {
            return await SecureStore.getItemAsync(key);
        },
        deleteItem: async (key: string) => {
            await SecureStore.deleteItemAsync(key);
        },
    };
}

export default Storage;
