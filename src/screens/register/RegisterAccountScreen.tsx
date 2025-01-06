import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useValidationManager } from '@/utils/validationManager';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import ThemedText from '@/components/themed/ThemedText';
import ThemedTextInput from '@/components/themed/ThemedTextInput';
import ThemedButton from '@/components/themed/ThemedButton';
import ThemedScreen from '@/components/themed/ThemedScreen';
import { validateString, validatePassword, validateMobileNumber } from '@/utils/validationHelpers';
import { useRegistration } from '@/context/RegistrationContext'; // 导入新的 RegistrationContext

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

const RegisterAccountScreen: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [termsNotChecked, setTermsNotChecked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { errors, handleBlur, validateAllFields, configureValidation, resetErrors } = useValidationManager();

  const { registrationData, setRegistrationData } = useRegistration(); // 使用 RegistrationContext

  // 配置验证规则
  const validationConfig = useMemo(
    () => ({
      firstName: {
        validate: validateString,
        errorMessage: t('common.errors.firstName'),
      },
      lastName: {
        validate: validateString,
        errorMessage: t('common.errors.lastName'),
      },
      password: {
        validate: validatePassword,
        errorMessage: t('common.errors.password'),
      },
      phone: {
        validate: validateMobileNumber,
        errorMessage: t('common.errors.phone'),
      },
      termsNotChecked: {
        validate: (checked: boolean) => !checked,
        errorMessage: t('registerAccountScreen.errors.mustAgree'),
      },
    }),
    [t]
  );

  useEffect(() => {
    resetErrors();
    configureValidation(validationConfig);
  }, [validationConfig]);

  const handleCheckboxChange = useCallback(() => {
    setTermsNotChecked(!termsNotChecked);
    handleBlur('termsNotChecked', !termsNotChecked);
  }, [termsNotChecked, handleBlur]);

  const handleCreateAccount = useCallback(async () => {
    const formData = { firstName, lastName, password, phone, termsNotChecked };

    if (validateAllFields(formData) && !termsNotChecked) {
      if (!registrationData.email) {
        Alert.alert(t('common.error'), t('registerAccountScreen.errors.accountEmailMissing'));
        return;
      }

      try {
        setIsSubmitting(true);
        const auth = getAuth();
        // 创建 Firebase 用户
        await createUserWithEmailAndPassword(auth, registrationData.email, password);
        // 导航到主页或其他页面
        router.replace(`home`);
      } catch (error: any) {
        console.error('Error during registration:', error);
        Alert.alert(t('common.error'), error.message || t('registerAccountScreen.errors.registrationFailed'));
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [
    firstName,
    lastName,
    password,
    phone,
    termsNotChecked,
    validateAllFields,
    registrationData.email,
    router,
    t,
  ]);

  return (
    <ThemedScreen showHeaderNavButton={true} showHeaderNavOptionButton={false}>
      <StyledView className="justify-center p-5">
        <ThemedText type="title-2x" textAlign="center">
          {t('registerAccountScreen.createBusinessAccount')}
        </ThemedText>
        <ThemedText textAlign="center">
          {t('registerAccountScreen.almostThere')}{' '}
          <ThemedText className="font-bold">{registrationData.email}</ThemedText>{' '}
          {t('registerAccountScreen.completeDetails')}
        </ThemedText>

        {/* First Name */}
        <ThemedText type="label" colorName="accent">
          {t('common.contactInfo.firstName')}*
        </ThemedText>
        <ThemedTextInput
          placeholder={t('registerAccountScreen.firstNamePlaceholder')}
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            setRegistrationData({ firstName: text });
          }}
          onBlur={() => handleBlur('firstName', firstName)}
        />
        <ThemedText type="input-error" colorName="errorText" isVisible={!!errors.firstName}>
          {errors.firstName}
        </ThemedText>

        {/* Last Name */}
        <ThemedText type="label" colorName="accent">
          {t('common.contactInfo.lastName')}*
        </ThemedText>
        <ThemedTextInput
          placeholder={t('registerAccountScreen.lastNamePlaceholder')}
          value={lastName}
          onChangeText={(text) => {
            setLastName(text);
            setRegistrationData({ lastName: text });
          }}
          onBlur={() => handleBlur('lastName', lastName)}
        />
        <ThemedText type="input-error" colorName="errorText" isVisible={!!errors.lastName}>
          {errors.lastName}
        </ThemedText>

        {/* Password */}
        <ThemedText type="label" colorName="accent">
          {t('common.password.password')}*
        </ThemedText>
        <ThemedTextInput
          type="password"
          placeholder={t('registerAccountScreen.passwordPlaceholder')}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setRegistrationData({ password: text });
          }}
          onBlur={() => handleBlur('password', password)}
          secureTextEntry
        />
        <ThemedText type="input-error" colorName="errorText" isVisible={!!errors.password}>
          {errors.password}
        </ThemedText>

        {/* Phone */}
        <ThemedText type="label" colorName="accent">
          {t('common.contactInfo.mobile')}*
        </ThemedText>
        <ThemedTextInput
          placeholder={t('registerAccountScreen.mobileNumberPlaceholder')}
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            setRegistrationData({ phone: text });
          }}
          keyboardType="phone-pad"
          onBlur={() => handleBlur('phone', phone)}
        />
        <ThemedText type="input-error" colorName="errorText" isVisible={!!errors.phone}>
          {errors.phone}
        </ThemedText>

        {/* Terms and Conditions */}
        <StyledTouchableOpacity className="flex-row items-center my-2" onPress={handleCheckboxChange}>
          <StyledView
            className={`h-6 w-6 border rounded ${
              termsNotChecked ? 'bg-white' : 'bg-blue-500'
            } mr-2`}
          />
          <ThemedText className="text-center" type="text-sm">
            {t('registerAccountScreen.iAgree')}{' '}
            <ThemedText type="link" colorName="link">
              {t('registerAccountScreen.privacyPolicy')}
            </ThemedText>
          </ThemedText>
        </StyledTouchableOpacity>
        <ThemedText type="input-error" colorName="errorText" isVisible={!!errors.termsNotChecked}>
          {errors.termsNotChecked}
        </ThemedText>

        {/* Submit Button */}
        <StyledView className="mt-4">
          <ThemedButton
            text={t('registerAccountScreen.createAccount')}
            type="primary"
            flexWidth="full"
            handleOnPress={handleCreateAccount}
            status={isSubmitting ? 'pending' : 'idle'}
            disabled={isSubmitting}
          />
        </StyledView>
      </StyledView>
    </ThemedScreen>
  );
};

export default RegisterAccountScreen;
