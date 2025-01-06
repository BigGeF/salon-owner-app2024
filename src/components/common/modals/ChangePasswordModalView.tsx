import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { validatePassword } from "@/utils/validationHelpers";
import { useEditOwnerPassword } from "@/hooks/ownerHooks/useEditOwnerPassword";
import { useTranslation } from 'react-i18next';
import { useValidationManager } from "@/utils/validationManager";
import { getCombinedStatus } from '@/utils/statusHelpers';

import { styled } from 'nativewind';
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextInput from "@/components/themed/ThemedTextInput";
import ThemedButton from "@/components/themed/ThemedButton";

interface ChangePasswordModalViewProps {
    visible: boolean;
    onClose: () => void;
    ownerId: string | null;
}

const StyledView = styled(View);

const ChangePasswordModalView: React.FC<ChangePasswordModalViewProps> = ({
                                                                         visible,
                                                                         onClose,
                                                                         ownerId,
                                                                     }) => {
    const { t } = useTranslation();
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [verifyPassword, setVerifyPassword] = useState<string>('');

    const editOwnerPasswordMutation = useEditOwnerPassword(ownerId);

    const { errors, handleBlur, validateAllFields, configureValidation, resetErrors } = useValidationManager();

    const passwordMutationStatus = useMemo(
        () => getCombinedStatus([editOwnerPasswordMutation.status]),
        [editOwnerPasswordMutation.status]
    );

    const passwordsMatch = useMemo(
        () => newPassword === verifyPassword,
        [newPassword, verifyPassword]
    );

    const validationConfig = useMemo(() => ({
        currentPassword: {
            validate: validatePassword,
            errorMessage: t('common.errors.password'),
        },
        newPassword: {
            validate: validatePassword,
            errorMessage: t('common.errors.password'),
        },
        verifyPassword: {
            validate: validatePassword,
            errorMessage: t('common.errors.password'),
        }
    }), [t]);

    useEffect(() => {
        configureValidation(validationConfig);
    }, [validationConfig]);

    useEffect(() => {
        if (visible) {
            setCurrentPassword('');
            setNewPassword('');
            setVerifyPassword('');
            resetErrors();
        }
    }, [visible]);

    const handleSavePassword = useCallback(() => {
        const formData = { currentPassword, newPassword, verifyPassword };

        if (validateAllFields(formData) && passwordsMatch) {
            editOwnerPasswordMutation.mutate(
                { currentPassword, newPassword },
                {
                    onSuccess: () => {
                        console.log("Password Changed");
                        onClose();
                    },
                    onError: () => {
                        console.log("Error changing password");
                    },
                }
            );
        }
    }, [currentPassword, newPassword, verifyPassword, validateAllFields, passwordsMatch, editOwnerPasswordMutation, onClose]);

    return (
        <StyledView>
            <ThemedText type='title-2x'>{t('password.changeModal.changePassword')}</ThemedText>
            <ThemedText type='label' colorName='accent'>{t('password.changeModal.currentPassword')}</ThemedText>
            <ThemedTextInput
                type='password'
                value={currentPassword}
                placeholder={t('password.changeModal.currentPasswordPlaceholder')}
                onBlur={() => handleBlur('currentPassword', currentPassword)}
                onChangeText={setCurrentPassword}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.currentPassword}>{errors.currentPassword}</ThemedText>
            <StyledView className="border-b border-gray-300 mb-4" />
            <ThemedText type='label' colorName='accent'>{t('password.changeModal.newPassword')}</ThemedText>
            <ThemedTextInput
                type='password'
                value={newPassword}
                placeholder={t('password.changeModal.newPasswordPlaceholder')}
                onChangeText={setNewPassword}
                onBlur={() => handleBlur('newPassword', newPassword)}
                hasError={!passwordsMatch}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.newPassword}>{errors.newPassword}</ThemedText>
            <ThemedText type='label' colorName='accent'>{t('password.changeModal.verifyPassword')}</ThemedText>
            <ThemedTextInput
                type='password'
                value={verifyPassword}
                placeholder={t('password.changeModal.verifyPasswordPlaceholder')}
                onChangeText={setVerifyPassword}
                onBlur={() => handleBlur('verifyPassword', verifyPassword)}
                hasError={!passwordsMatch}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.verifyPassword}>{errors.verifyPassword}</ThemedText>
            <ThemedText type='input-error' colorName='errorText' isVisible={!passwordsMatch}>{t('password.changeModal.errors.passwordMatch')}</ThemedText>
            <StyledView className="flex-row justify-between mt-4">
                <ThemedButton
                    text={t('common.cancel')}
                    type='cancel'
                    flexWidth='full'
                    textColorName='cancelButtonText'
                    bgColorName='cancelButtonBG'
                    handleOnPress={onClose}
                />
                <ThemedButton
                    text={t('common.save')}
                    type='primary'
                    flexWidth='full'
                    handleOnPress={handleSavePassword}
                    status={passwordMutationStatus}
                />
            </StyledView>
        </StyledView>
    );
};

export default React.memo(ChangePasswordModalView);
