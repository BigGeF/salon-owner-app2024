import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { UserConfig } from '@/types';
import { getUserConfig, setUserConfig } from '@/utils/auth';
// import { useOwnerIdContext } from "./OwnerIdContext";
import {useColorScheme as useColorSchemeNative} from "nativewind/dist/use-color-scheme";
import {applyTheme} from "@/utils/themeHelpers";
import {useColorScheme} from "react-native";
import { changeLanguage } from "i18next";
import { useAuth } from './AuthContext';
interface UserConfigContextType {
    userConfig: UserConfig;
    updateUserConfig: (newConfig: Partial<UserConfig>) => Promise<void>;
}

const UserConfigContext = createContext<UserConfigContextType | undefined>(undefined);

export const UserConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const {  setColorScheme } = useColorSchemeNative();
    const phoneTheme = useColorScheme();
    const { owner } = useAuth(); // Assuming you have access to the ownerId here
    const ownerId = owner?.firebaseUid; // Assuming ownerId is a Firebase uid
    const [userConfig, setUserConfigState] = useState<UserConfig>({ language: 'en', theme: 'automatic' });

    useEffect(() => {
        // Load user config at app start
        const loadConfig = async () => {
            if (ownerId) {
                const config = await getUserConfig(ownerId);
                setUserConfigState(config);

                applyTheme(config.theme, phoneTheme, (theme) => {setColorScheme(theme)});
                await changeLanguage(config.language);
            }
        };
        void loadConfig();
    }, [ownerId]);

    const updateUserConfig = async (newConfig: Partial<UserConfig>) => {
        if (!ownerId) {
            return;
        }
        const updatedConfig = { ...userConfig, ...newConfig };
        setUserConfigState(updatedConfig);
        await setUserConfig(ownerId, updatedConfig); // Save the updated config
    };

    return (
        <UserConfigContext.Provider value={{ userConfig, updateUserConfig }}>
            {children}
        </UserConfigContext.Provider>
    );
};

export const useUserConfig = () => {
    const context = React.useContext(UserConfigContext);
    if (!context) {
        throw new Error('useUserConfig must be used within a UserConfigProvider');
    }
    return context;
};
