import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar, StatusBarStyle } from 'expo-status-bar'; // Import StatusBarStyle
import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";
import { enableScreens } from 'react-native-screens';
import { NativeWindStyleSheet } from "nativewind";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppContextProvider } from "@/providers/AppContextProvider";
import { useColorScheme as useColorSchemeNative } from "nativewind/dist/use-color-scheme";
import { useMemo } from 'react';
import { Colors } from "@/constants/Colors";

enableScreens();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

NativeWindStyleSheet.setOutput({
    default: "native",
});

export default function Layout() {
    const { colorScheme } = useColorSchemeNative();

    // Memoize statusBarStyles with the correct types
    const statusBarStyles = useMemo(() => {
        const style: StatusBarStyle = colorScheme === 'dark' ? 'light' : 'dark'; // Ensure correct type
        const backgroundColor = colorScheme === 'dark' ? Colors.navTabBackground.dark : Colors.navTabBackground.light;
        return { style, backgroundColor };
    }, [colorScheme]);

    console.log("Creating Layout in Mobile View");

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
                <AppContextProvider>
                    <I18nextProvider i18n={i18n}>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="auth" options={{ headerShown: false }} />
                            <Stack.Screen name="login" options={{ title: 'Login' }} />
                            <Stack.Screen name="register" options={{ title: 'Register'}} />
                        </Stack>
                        {/* Use the memoized statusBarStyles with proper type */}
                        <StatusBar style={statusBarStyles.style} backgroundColor={statusBarStyles.backgroundColor} />
                    </I18nextProvider>
                </AppContextProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}
