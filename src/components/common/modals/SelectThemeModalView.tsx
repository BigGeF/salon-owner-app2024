import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styled } from 'nativewind';
import ThemedText from "@/components/themed/ThemedText";
import { useTranslation } from 'react-i18next';
import ThemedIcon from "@/components/themed/ThemedIcon";

interface CategoryModalProps {
    selectedTheme: 'light' | 'dark' | 'automatic';
    onClose: () => void;
    onSelected: (value: 'light' | 'dark' | 'automatic') => void;
}

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

const SelectThemeModalView: React.FC<CategoryModalProps> = ({
                                                                selectedTheme,
                                                                onClose,
                                                                onSelected,
                                                            }) => {
    const { t } = useTranslation();

    const handleSelectionPressed = useCallback((selectedTheme: 'light' | 'dark' | 'automatic') => {
        onSelected(selectedTheme);
        onClose();
    }, [onSelected, onClose]);

    return (
        <StyledView className='px-2 pb-5'>
            <ThemedText type='title-2x'>{t('theme.selectTheme')}</ThemedText>
            <StyledTouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-200" onPress={() => handleSelectionPressed('automatic')}>
                <ThemedText colorName={selectedTheme === 'automatic' ? 'textGrey' : 'text'}>{t('theme.automatic')}</ThemedText>
                <ThemedIcon
                    iconType='entypo'
                    name='mobile'
                    size={20}
                    colorName={selectedTheme === 'automatic' ? 'iconGrey' : 'icon'}
                />
            </StyledTouchableOpacity>
            <StyledTouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-200" onPress={() => handleSelectionPressed('light')}>
                <ThemedText colorName={selectedTheme === 'light' ? 'textGrey' : 'text'}>{t('theme.lightMode')}</ThemedText>
                <ThemedIcon
                    iconType='entypo'
                    name='light-up'
                    size={20}
                    colorName={selectedTheme === 'light' ? 'iconGrey' : 'icon'}
                />
            </StyledTouchableOpacity>
            <StyledTouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-200" onPress={() => handleSelectionPressed('dark')}>
                <ThemedText colorName={selectedTheme === 'dark' ? 'textGrey' : 'text'}>{t('theme.darkMode')}</ThemedText>
                <ThemedIcon
                    iconType='entypo'
                    name='moon'
                    size={20}
                    colorName={selectedTheme === 'dark' ? 'iconGrey' : 'icon'}
                />
            </StyledTouchableOpacity>
        </StyledView>
    );
};

export default React.memo(SelectThemeModalView);
