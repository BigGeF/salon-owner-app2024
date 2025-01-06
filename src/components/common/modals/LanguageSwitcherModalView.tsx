import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styled } from 'nativewind';
import ThemedText from "@/components/themed/ThemedText";
import { useTranslation } from 'react-i18next';
import { changeLanguage } from "i18next";
import { getLanguageName } from "@/utils/languageHelpers";
import {useUserConfig} from "@/context/UserConfigContext";

interface LanguageSwitcherViewProps {
    onClose: () => void;
}

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

const LanguageSwitcherModalView: React.FC<LanguageSwitcherViewProps> = ({
                                                                            onClose,
                                                                        }) => {
    const { t } = useTranslation();
    const { updateUserConfig } = useUserConfig();

    const handleLanguageSelected = useCallback((language: string) => {
        void changeLanguage(language);
        updateUserConfig({language: language})
        onClose();
    }, [onClose]);

    const languageNames = useMemo(() => ({
        zh: getLanguageName('zh'),
        en: getLanguageName('en'),
        vi: getLanguageName('vi'),
        es: getLanguageName('es'),
    }), []);

    return (
        <StyledView className='px-2 pb-5'>
            <ThemedText type='title-2x'>{t('language.chooseLanguage')}</ThemedText>

            <StyledTouchableOpacity
                className="flex-row items-center p-2 mb-2 rounded-lg bg-blue-500"
                onPress={() => handleLanguageSelected('zh')}
            >
                <ThemedText className="text-white text-center ml-2">{languageNames.zh}</ThemedText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
                className="flex-row items-center p-2 mb-2 rounded-lg bg-green-500"
                onPress={() => handleLanguageSelected('en')}
            >
                <ThemedText className="text-white text-center ml-2">{languageNames.en}</ThemedText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
                className="flex-row items-center p-2 mb-2 rounded-lg bg-red-500"
                onPress={() => handleLanguageSelected('vi')}
            >
                <ThemedText className="text-white text-center ml-2">{languageNames.vi}</ThemedText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
                className="flex-row items-center p-2 rounded-lg bg-orange-500"
                onPress={() => handleLanguageSelected('es')}
            >
                <ThemedText className="text-white text-center ml-2">{languageNames.es}</ThemedText>
            </StyledTouchableOpacity>
        </StyledView>
    );
};

export default React.memo(LanguageSwitcherModalView);
