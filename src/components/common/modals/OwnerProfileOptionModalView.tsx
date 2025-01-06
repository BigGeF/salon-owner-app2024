import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import ThemedText from "@/components/themed/ThemedText";
import { useTranslation } from 'react-i18next';

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface OwnerProfileOptionModalProps {
    onClose: () => void;
    onEditContactInfo: () => void;
    onChangePassword: () => void;
}

const OwnerProfileOptionModalView: React.FC<OwnerProfileOptionModalProps> = ({
                                                                                 onClose,
                                                                                 onEditContactInfo,
                                                                                 onChangePassword,
                                                                                 ...rest
                                                                             }) => {
    const { t } = useTranslation();

    return (
        <StyledView className='px-2 pb-5' {...rest}>
            <StyledTouchableOpacity
                onPress={onEditContactInfo}
                className="py-4 w-full items-center"
            >
                <ThemedText className="text-lg">{t('owner.profileOptionModal.editContactInfo')}</ThemedText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
                onPress={onChangePassword}
                className="py-4 w-full items-center"
            >
                <ThemedText className="text-lg">{t('owner.profileOptionModal.changePassword')}</ThemedText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity onPress={onClose} className="py-4 w-full items-center">
                <ThemedText className="text-lg">{t('common.cancel')}</ThemedText>
            </StyledTouchableOpacity>
        </StyledView>
    );
};

export default React.memo(OwnerProfileOptionModalView);
