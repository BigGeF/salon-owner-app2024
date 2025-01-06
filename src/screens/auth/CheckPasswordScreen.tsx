// CheckPasswordScreen.tsx

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { useRegistration } from '@/context/RegistrationContext';
import { useAuth } from "@/context/AuthContext";
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextInput from "@/components/themed/ThemedTextInput";
import ThemedButton from "@/components/themed/ThemedButton";
import ThemedScreen from "@/components/themed/ThemedScreen";
import { validatePassword } from "@/utils/validationHelpers";
import { MutationStatus } from "@tanstack/react-query";
import { useTranslation } from 'react-i18next';
import { useValidationManager } from "@/utils/validationManager";

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CheckPasswordScreen: React.FC = () => {
    const { t } = useTranslation();
    const [password, setPassword] = useState('');
    const [checkingPassword, setCheckingPassword] = useState<MutationStatus>('idle');

    const { registrationData } = useRegistration();
    const router = useRouter();
    const { loginUser, isAuthenticated } = useAuth();

    const { errors, handleBlur, validateAllFields, configureValidation, resetErrors } = useValidationManager();

    const validationConfig = useMemo(() => ({
        password: {
            validate: validatePassword,
            errorMessage: t('common.errors.password'),
        }
    }), [t]);

    useEffect(() => {
        resetErrors();
        configureValidation(validationConfig);
    }, [validationConfig, resetErrors, configureValidation]);

    const handleLogin = useCallback(async () => {
        const formData = { password };

        if (registrationData.email && validateAllFields(formData)) {
            console.log('Email:', registrationData.email);
            console.log('Password:', password);

            try {
                // setCheckingPassword('pending');
                await loginUser(registrationData.email, password);
                setCheckingPassword('idle');
                router.replace('home/salon-home');
            } catch (error) {
                console.error('Login error:', error);
                Alert.alert(t('password.checkPasswordScreen.errors.loginFailed'), t('password.checkPasswordScreen.errors.checkCredentials'));
            }
        }
    }, [registrationData.email, password, validateAllFields, t, loginUser, router]);

    return (
        <ThemedScreen
            showHeaderNavButton={true}
            showHeaderNavOptionButton={false}
        >
            <StyledView className="justify-center p-5">
                <ThemedText type='title-2x' textAlign='center'>{t('password.checkPasswordScreen.welcomeBack')} {registrationData.email}</ThemedText>
                <ThemedText className='mt-2 mb-4' textAlign='center'>{t('password.checkPasswordScreen.enterPassword')} {registrationData.email}</ThemedText>
                <ThemedText type='label' colorName='accent'>{t('common.password.password')}</ThemedText>
                <ThemedTextInput
                    type='password'
                    placeholder={t('common.password.passwordPlaceholder')}
                    value={password}
                    onBlur={() => handleBlur('password', password)}
                    onChangeText={setPassword}
                />
                <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.password}>{errors.password}</ThemedText>
                <StyledTouchableOpacity className="my-2" onPress={() => alert('Navigate to forgot password screen')}>
                    <ThemedText type='link' colorName='link' textAlign='center'>{t('common.password.forgotPassword')}</ThemedText>
                </StyledTouchableOpacity>
                <StyledView className='mt-4'>
                    <ThemedButton
                        text={t('common.login')}
                        handleOnPress={handleLogin}
                        status={checkingPassword}
                    />
                </StyledView>
            </StyledView>
        </ThemedScreen>
    );
};

export default CheckPasswordScreen;
