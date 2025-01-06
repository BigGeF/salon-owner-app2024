// // salon-owner-app/src/screens/auth/CheckEmailScreen.tsx
// import React, {useCallback, useEffect, useMemo, useState} from 'react';
// import { View, Alert, Platform } from 'react-native';
// import { useRouter } from 'expo-router';
// import { checkIfEmailExists } from '@/api/AuthAPI';
// import { useRegistration } from '@/context/RegistrationContext';
// import ThemedTextInput from "@/components/themed/ThemedTextInput";
// import ThemedText from "@/components/themed/ThemedText";
// import ThemedButton from "@/components/themed/ThemedButton";
// import ThemedScreen from "@/components/themed/ThemedScreen";
// import { validateEmail } from "@/utils/validationHelpers";
// import { useTranslation } from 'react-i18next';
// import { useValidationManager } from "@/utils/validationManager";
// import { MutationStatus } from "@tanstack/react-query";
// import { styled } from "nativewind";
// import { useAuth } from '@/context/AuthContext';  // 引入登出逻辑

// const StyledView = styled(View);

// const CheckEmailScreen: React.FC = () => {
//     const { t } = useTranslation();
//     const [email, setEmail] = useState('');
//     const [checkingEmail, setCheckingEmail] = useState<MutationStatus>('idle');
//     const { setRegistrationData } = useRegistration();
//     const router = useRouter();
//     const { logout,signInWithGoogle} = useAuth();  // 从 useAuth 中提取 logout 函数

//     const { errors, handleBlur, validateAllFields, configureValidation, resetErrors } = useValidationManager<{ email: string }>();

//     // Configuration for input validation functions and error messages
//     const validationConfig = useMemo(() => ({
//         email: {
//             validate: validateEmail,
//             errorMessage: t('common.errors.email'),
//         }
//     }), [t]);

//     useEffect(() => {
//         resetErrors();
//         configureValidation(validationConfig);
//     }, [validationConfig]);

//     const handleAuthError = (error: any, t: any) => {
//         console.error('Authentication error:', error);
//         Alert.alert(t('common.error'), t('authentication.errors.loginFailed'));
//     };
//     const navigateAfterAuth = (exists: boolean, router: any) => {
//         if (exists) {
//             router.push('auth/check-password');
//         } else {
//             router.push('register/register-account');
//         }
//     };
//     const handleContinue = useCallback(async () => {
//         const formData = { email };
    
//         if (validateAllFields(formData)) {
//             try {
//                 setCheckingEmail('pending');
//                 const exists = await checkIfEmailExists(email);
//                 console.log('Email exists:', exists);
//                 setRegistrationData({ email });
//                 setCheckingEmail('idle');
//                 navigateAfterAuth(exists, router);
//             } catch (error) {
//                 setCheckingEmail('idle');
//                 handleAuthError(error, t);
//             }
//         }
//     }, [email, validateAllFields, setRegistrationData, router, t]);
    

//     // Google Sign-In Handler
//     const handleGoogleSignIn = useCallback(async () => {
//         try {
//             console.log("Google Sign In");
    
//        await signInWithGoogle();
    
//             router.replace('home/salon-home');
//         } catch (error) {
//             handleAuthError(error, t);
//         }
//     }, [router, t]);
    

//     // Logout Handler
//     const handleLogout = async () => {
//         try {
//             await logout();  // 调用 logout 函数
//             console.log('User logged out successfully');
//         } catch (error) {
//             Alert.alert(t('common.error'), 'Logout failed');
//             console.error('Logout failed:', error);
//         }
//     };

//     return (
//         <ThemedScreen
//             showHeaderNavButton={true}
//             showHeaderNavOptionButton={false}
//         >
//             <StyledView className="justify-center p-5">
//                 <ThemedText type='title-2x' textAlign='center'>{t('email.checkEmailScreen.createAccount')}</ThemedText>
//                 <StyledView className="my-10">
//                     <ThemedText type='label' colorName='accent'>{t('common.contactInfo.email')}</ThemedText>
//                     <ThemedTextInput
//                         placeholder={t('email.checkEmailScreen.emailPlaceholder')}
//                         value={email}
//                         onChangeText={setEmail}
//                         onBlur={() => handleBlur('email', email)}
//                         keyboardType="email-address"
//                         autoCapitalize="none"
//                         autoComplete={'email'}
//                     />
//                     <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.email}>{errors.email}</ThemedText>
//                 </StyledView>
//                 <ThemedButton
//                     text={t('common.continue')}
//                     handleOnPress={handleContinue}
//                     status={checkingEmail}
//                 />

//                 {Platform.OS === 'web' && (
//                     <StyledView className="flex-row justify-center mt-5">
//                         <ThemedButton text={t('splashScreen.googleLogin')} handleOnPress={handleGoogleSignIn} />
//                     </StyledView>
//                 )}

//                 <StyledView className="flex-row justify-center mt-5">
//                     <ThemedButton text={t('common.logout')} handleOnPress={handleLogout} />
//                 </StyledView>
//             </StyledView>
//         </ThemedScreen>
//     );
// };

// export default CheckEmailScreen;
