import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { styled } from 'nativewind';
import { login } from '@/api/AuthAPI'; // Adjust the path as necessary
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledButton = styled(Button);

const LoginScreen = () => {
    const [email, setEmail] = useState<string | undefined>(process.env.TEST_OWNER_EMAIL);
    const [password, setPassword] = useState<string | undefined>(process.env.TEST_OWNER_PASSWORD);
    const { checkAuthStatus } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Email and password must be provided');
            return;
        }

        try {
            await login(email, password);
            await checkAuthStatus();
            router.replace('home'); // Redirect to home screen or wherever you need
        } catch (error) {
            console.error('Login errorrr:', error);

            Alert.alert('Login failed', 'Please check your credentials and try again.');
        }
    };

    return (
        <StyledView className="flex-1 justify-center items-center p-4">
            <StyledText className="text-2xl mb-4">Login</StyledText>
            <StyledTextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                className="w-full p-2 my-2 border border-gray-400 rounded"
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <StyledTextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="w-full p-2 my-2 border border-gray-400 rounded"
                autoCapitalize="none"
            />
            <StyledButton title="Login" onPress={handleLogin} />
        </StyledView>
    );
};

export default LoginScreen;
