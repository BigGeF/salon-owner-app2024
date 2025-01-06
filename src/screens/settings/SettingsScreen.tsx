import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, useColorScheme } from 'react-native';
import { styled, useColorScheme as useColorSchemeNative } from 'nativewind';
import { useAuth } from '@/context/AuthContext';
// import { useOwnerContext } from '@/context/OwnerContext';
import { useRouter } from 'expo-router';
import ThemedText from "@/components/themed/ThemedText";
import ThemedIcon from "@/components/themed/ThemedIcon";
import ThemedScreen from "@/components/themed/ThemedScreen";
import { useTranslation } from 'react-i18next';
import LanguageSwitcherModalView from "@/components/common/modals/LanguageSwitcherModalView";
import { getLanguageName } from '@/utils/languageHelpers';
import SelectThemeModalView from "@/components/common/modals/SelectThemeModalView";
import OptionModalView from "@/components/common/modals/OptionModalView";
import ThemedDynamicModal from "@/components/themed/ThemedDynamicModal";
import {useUserConfig} from "@/context/UserConfigContext";
import {applyTheme} from "@/utils/themeHelpers";

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

const SettingsScreen = () => {
    const { userConfig, updateUserConfig } = useUserConfig();
    const { t, i18n } = useTranslation();
    const { logout, owner } = useAuth();
    const router = useRouter();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentModalView, setCurrentModalView] = useState('');

    const { setColorScheme } = useColorSchemeNative();
    const phoneTheme = useColorScheme();
    const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'automatic'>('automatic');

    useEffect(() => {
        setSelectedTheme(userConfig.theme);
        console.log(userConfig);
    }, []);

    /*useEffect(() => {
        if (colorScheme === 'light') {
            setSelectedTheme('light');
        } else if (colorScheme === 'dark') {
            setSelectedTheme('dark');
        }
    }, [colorScheme]);*/


    // Memoized event handlers
    const handleThemeChange = useCallback(async(itemValue: 'light' | 'dark' | 'automatic') => {
        setSelectedTheme(itemValue);
        // Perform actions based on the selected theme
        applyTheme(itemValue, phoneTheme, (theme) => {setColorScheme(theme)});
        await updateUserConfig({theme: itemValue});
    }, [phoneTheme, setColorScheme]);

    const handleCloseModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const handleShowLogoutOption = useCallback(() => {
        setCurrentModalView('logoutOption');
        setIsModalVisible(true);
    }, []);

    const handleLogout = useCallback(async () => {
        logout();
        router.replace('auth/splash'); // Redirect to log in screen
    }, [logout, router]);

    const handleLogoutOptionSelected = useCallback(() => {
        setIsModalVisible(false);
        handleLogout();
    }, [handleLogout]);

    const handleShowLanguageSwitcher = useCallback(() => {
        setCurrentModalView('languageSwitcher');
        setIsModalVisible(true);
    }, []);

    const handleShowThemePicker = useCallback(() => {
        setCurrentModalView('themePicker');
        setIsModalVisible(true);
    }, []);

    const handleProfilePress = useCallback(() => {
        router.push('settings/owner-profile');
    }, [router]);

    const handleSalonsPress = useCallback(() => {
        router.push('settings/my-salons');
    }, [router]);

    // Memoized computed values
    const getUserFullName = useMemo(() => {
        if (owner) {
            return `${owner.firstName} ${owner.lastName.charAt(0)}`;
        }
        return ''; // Default if owner's name is not available
    }, [owner]);

    const getUserInitials = useMemo(() => {
        if (owner) {
            return `${owner.firstName.charAt(0)}${owner.lastName.charAt(0)}`;
        }
        return ''; // Default if owner's name is not available
    }, [owner]);

    const getThemeInfo = useMemo(() => {
        console.log("Selected THeme: ", selectedTheme);
        switch (selectedTheme) {
            case 'light':
                return (
                    <StyledView className='flex-row'>
                        <ThemedText type='text-sm' colorName='textGrey' className='pr-2'>Light</ThemedText>
                        <ThemedIcon iconType='entypo' name='light-up' size={20} />
                    </StyledView>
                );
            case 'dark':
                return (
                    <StyledView className='flex-row'>
                        <ThemedText type='text-sm' colorName='textGrey' className='pr-2'>Dark</ThemedText>
                        <ThemedIcon iconType='entypo' name='moon' size={20} />
                    </StyledView>
                );
            case 'automatic':
            default:
                return (
                    <StyledView className='flex-row'>
                        <ThemedText type='text-sm' colorName='textGrey' className='pr-2'>Automatic</ThemedText>
                        <ThemedIcon iconType='entypo' name='mobile' size={20} />
                    </StyledView>
                );
        }
    }, [selectedTheme]);

    // Memoized modal views
    const modalViews = useMemo(() => [
        {
            key: 'logoutOption',
            component: (
                <OptionModalView
                    onClose={handleCloseModal}
                    option1Text={t('common.logout')}
                    option2Text={t('common.cancel')}
                    onOption1Press={handleLogoutOptionSelected}
                    onOption2Press={handleCloseModal}
                />
            )
        },
        {
            key: 'languageSwitcher',
            component: (
                <LanguageSwitcherModalView
                    onClose={handleCloseModal}
                />
            )
        },
        {
            key: 'themePicker',
            component: (
                <SelectThemeModalView
                    selectedTheme={selectedTheme}
                    onSelected={handleThemeChange}
                    onClose={handleCloseModal}
                />
            )
        }
    ], [handleCloseModal, handleLogoutOptionSelected, t, selectedTheme, handleThemeChange]);

    return (
        <ThemedScreen
            showHeaderNavButton={false}
            showHeaderNavOptionButton={false}
        >
            <StyledView className="flex-row justify-between items-center mb-2 mx-4">
                <ThemedText type='title-2x' className='my-0'>{getUserFullName}</ThemedText>
                <StyledView className="w-12 h-12 bg-gray-300 rounded-full flex justify-center items-center">
                    <ThemedText className='my-0 text-white'>{getUserInitials}</ThemedText>
                </StyledView>
            </StyledView>

            <StyledView className="border-t border-gray-200 mt-4 p-4">
                <ThemedText type='label' colorName='accent' className='pt-4'>{t('settings.settingsScreen.accountSettings')}</ThemedText>
                <StyledTouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-200" onPress={handleProfilePress}>
                    <ThemedText>{t('settings.settingsScreen.profile')}</ThemedText>
                    <ThemedIcon iconType='ant' name='user' size={20} />
                </StyledTouchableOpacity>
                <StyledTouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-200" onPress={handleSalonsPress}>
                    <ThemedText>{t('settings.settingsScreen.salons')}</ThemedText>
                    <ThemedIcon iconType='ant' name='isv' size={20} />
                </StyledTouchableOpacity>
                <StyledTouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-200" onPress={handleShowLogoutOption}>
                    <ThemedText>{t('common.logout')}</ThemedText>
                    <ThemedIcon iconType='ant' name='logout' size={20} />
                </StyledTouchableOpacity>
            </StyledView>
            <StyledView className="mt-4 p-4 ">
                <ThemedText type='label' colorName='accent' className='pt-4'>{t('settings.settingsScreen.appSettings')}</ThemedText>
                <StyledTouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-200" onPress={handleShowThemePicker}>
                    <ThemedText>{t('theme.theme')}</ThemedText>
                    {getThemeInfo}
                </StyledTouchableOpacity>
                <StyledTouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-200" onPress={handleShowLanguageSwitcher}>
                    <ThemedText>{t('language.language')}</ThemedText>
                    <StyledView className='flex-row'>
                        <ThemedText type='text-sm' colorName='textGrey' className='pr-2'>{getLanguageName(i18n.language)}</ThemedText>
                        <ThemedIcon iconType='fontawesome' name='language' size={20} />
                    </StyledView>
                </StyledTouchableOpacity>
            </StyledView>

            <ThemedDynamicModal
                type='bottom'
                animationType='slide'
                visible={isModalVisible}
                onClose={handleCloseModal}
                views={modalViews}
                currentView={currentModalView}
            />
        </ThemedScreen>
    );
};

export default SettingsScreen;
