//salon-owner-app/src/screens/auth/LoadingScreen.tsx
import React, { useEffect, useCallback, useMemo } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { useSalonContext } from "@/context/SalonContext";
import { useAuth } from "@/context/AuthContext";
import ThemedScreen from '@/components/themed/ThemedScreen';

const StyledView = styled(View);

export default function LoadingScreen() {
    const router = useRouter();
    const { salons, refetchSalons } = useSalonContext();
    const { isAuthenticated, isAuthenticating } = useAuth();

    const isSalonsNull = useMemo(() => salons === null, [salons]);

    const navigateToSalonDetails = useCallback(() => {
        if (isAuthenticated) {
            router.replace(`home/salon-home`);
        }
    }, [isAuthenticated, router]);

    const navigateToSplashScreen = useCallback(() => {
        router.replace(`auth/splash`); // Navigate to the splash screen if not authenticated
    }, [router]);

    useEffect(() => {
        console.log("SALONSSSSSS: ", salons);
    }, [salons]);

    useEffect(() => {
        console.log("LoadingScreen - isAuthenticated: ", isAuthenticated);
        console.log("LoadingScreen - isAuthenticating: ", isAuthenticating);
        console.log("LoadingScreen - isSalonsNull: ", isSalonsNull);
        if (!isAuthenticated && !isAuthenticating) {
            // Not authenticated, navigate to the splash screen
            navigateToSplashScreen();
        } else if (isAuthenticated && isSalonsNull) {
            // Authenticated but salons data hasn't been fetched, trigger refetch
            void refetchSalons();
        }
    }, [isAuthenticated, isAuthenticating, isSalonsNull, refetchSalons, navigateToSplashScreen]);

    useEffect(() => {
        // Navigate to "my-salons" once authenticated (even if no salons exist)
        if (isAuthenticated && salons !== null) {
            navigateToSalonDetails();
        }
    }, [salons, isAuthenticated, navigateToSalonDetails]);

    return (
        <ThemedScreen
            showHeaderNavButton={true}
            showHeaderNavOptionButton={false}
        >
            <StyledView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading Salons</Text>
            </StyledView>
        </ThemedScreen>
    );
}
