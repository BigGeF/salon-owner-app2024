// salon-owner-app/src/screens/auth/SplashScreen.tsx

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { checkIfEmailExists } from '@/api/AuthAPI';
import { useRegistration } from '@/context/RegistrationContext';
import ThemedTextInput from "@/components/themed/ThemedTextInput";
import ThemedText from "@/components/themed/ThemedText";
import ThemedButton from "@/components/themed/ThemedButton";
import ThemedScreen from "@/components/themed/ThemedScreen";
import { validateEmail } from "@/utils/validationHelpers";
import { useTranslation } from 'react-i18next';
import { useValidationManager } from "@/utils/validationManager";
import { MutationStatus } from "@tanstack/react-query";
import { styled } from "nativewind";
import { useAuth } from '@/context/AuthContext';  // 引入 AuthContext
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import app from '@/config/firebase';

WebBrowser.maybeCompleteAuthSession();

const StyledView = styled(View);

const SplashScreen: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [checkingEmail, setCheckingEmail] = useState<MutationStatus>('idle');
  const { setRegistrationData } = useRegistration();
  const router = useRouter();
  const { logout, handleGoogleSignIn } = useAuth();  // 从 useAuth 中提取 logout 和 handleGoogleSignIn 函数
  const auth = getAuth(app);

  const { errors, handleBlur, validateAllFields, configureValidation, resetErrors } = useValidationManager<{ email: string }>();

  // 配置输入验证函数和错误消息
  const validationConfig = useMemo(() => ({
    email: {
      validate: validateEmail,
      errorMessage: t('common.errors.email'),
    }
  }), [t]);

  useEffect(() => {
    resetErrors();
    configureValidation(validationConfig);
  }, [validationConfig, resetErrors, configureValidation]);

  const handleAuthError = (error: any, t: any) => {
    console.error('Authentication error:', error);
    Alert.alert(t('common.error'), t('authentication.errors.loginFailed'));
  };

  const navigateAfterAuth = (exists: boolean, router: any) => {
    if (exists) {
      router.push('auth/check-password');
    } else {
      router.push('register/register-account');
    }
  };

  // 将 handleContinueWithEmail 提前定义
  const handleContinueWithEmail = useCallback(async () => {
    try {
      setCheckingEmail('pending');
      const exists = await checkIfEmailExists(email);
      console.log('Email exists:', exists);
      setRegistrationData({ email });
      setCheckingEmail('idle');
      navigateAfterAuth(exists, router);
    } catch (error) {
      setCheckingEmail('idle');
      handleAuthError(error, t);
    }
  }, [email, setRegistrationData, router, t]);

  const handleContinue = useCallback(async () => {
    const formData = { email };

    if (validateAllFields(formData)) {
      try {
        await handleContinueWithEmail();
      } catch (error) {
        console.error('Email validation failed:', error);
        Alert.alert(t('common.error'), 'Email validation failed');
      }
    }
  }, [email, validateAllFields, handleContinueWithEmail]);

  // Google 登录逻辑
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '您的客户端 ID', // 使用 clientId 而不是 expoClientId
    iosClientId: '860563919816-t35ja4nv9rdkc5mggmgjd82q3gj5p6o1.apps.googleusercontent.com', // 对应 iOS 客户端
    androidClientId: '860563919816-22p65npc9l0j6pb64dinqlac9kdj1fmt.apps.googleusercontent.com', // 对应 Android 客户端
    webClientId: '860563919816-7dtpigr85922r7559fqnvq3hr440gd12.apps.googleusercontent.com', // 对应 Web 客户端
    scopes: ['profile', 'email'], // 请求用户基本信息和电子邮件
  });

  useEffect(() => {
    if (response?.type === 'success' && response.authentication) {
      const { authentication } = response;

      const credential = GoogleAuthProvider.credential(authentication.idToken, authentication.accessToken);

      signInWithCredential(auth, credential)
        .then(async (authResult) => {
          console.log('Firebase Authentication successful:', authResult);

          // 调用 AuthContext 中的处理函数
          await handleGoogleSignIn(authResult.user);

          // 导航到主页或其他页面
          router.replace('home/salon-home');
        })
        .catch((error) => {
          console.error('Firebase Authentication error:', error);
          Alert.alert('Authentication error', 'Failed to authenticate with Firebase.');
        });
    } else if (response?.type === 'error') {
      console.error('Authentication error:', response.error);
      Alert.alert('Authentication error', 'An error occurred during authentication.');
    }
  }, [response, auth, handleGoogleSignIn, router]);

  const handleGoogleSignInPress = () => {
    promptAsync();
  };

  // 登出处理函数
  const handleLogout = async () => {
    try {
      await logout();  // 调用 logout 函数
      console.log('User logged out successfully');
    } catch (error) {
      Alert.alert(t('common.error'), 'Logout failed');
      console.error('Logout failed:', error);
    }
  };

  return (
    <ThemedScreen
      showHeaderNavButton={true}
      showHeaderNavOptionButton={false}
    >
      <StyledView className="justify-center p-5">
        <ThemedText type='title-2x' textAlign='center'>{t('email.checkEmailScreen.createAccount')}</ThemedText>
        <StyledView className="my-10">
          <ThemedText type='label' colorName='accent'>{t('common.contactInfo.email')}</ThemedText>
          <ThemedTextInput
            placeholder={t('email.checkEmailScreen.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            onBlur={() => handleBlur('email', email)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete={'email'}
          />
          <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.email}>{errors.email}</ThemedText>
        </StyledView>
        <ThemedButton
          text={t('common.continue')}
          handleOnPress={handleContinue}
          status={checkingEmail}
        />

        {/* Google 登录按钮 */}
        <StyledView className="flex-row justify-center mt-5">
          <ThemedButton text={t('splashScreen.googleLogin')} handleOnPress={handleGoogleSignInPress} />
        </StyledView>

        {/* 登出按钮 */}
        <StyledView className="flex-row justify-center mt-5">
          <ThemedButton text={t('common.logout')} handleOnPress={handleLogout} />
        </StyledView>
      </StyledView>
    </ThemedScreen>
  );
};

export default SplashScreen;
