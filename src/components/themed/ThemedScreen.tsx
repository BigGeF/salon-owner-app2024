import React, { ReactNode, useMemo, useCallback } from "react";
import { styled, useColorScheme } from "nativewind";
import { Platform, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import ScreenNavHeader from "@/components/common/ScreenNavHeader";
import {router} from "expo-router";

// Define the type for the props to include children
interface ThemedScreenProps {
    children: ReactNode;
    showHeaderNavButton?: boolean;
    showHeaderNavOptionButton?: boolean;
    headerTitle?: string;
    onHeaderNavBackPress?: () => void;
    onHeaderNavOptionsPress?: () => void;
}

// Create a styled version of SafeAreaView using NativeWind
const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);

const ThemedScreen: React.FC<ThemedScreenProps> = ({
                                                       children,
                                                       showHeaderNavButton = false,
                                                       showHeaderNavOptionButton = false,
                                                       headerTitle = '',
                                                       onHeaderNavBackPress,
                                                       onHeaderNavOptionsPress
                                                   }) => {
    const { colorScheme } = useColorScheme();

    // Memoize the scrollView class name to prevent unnecessary recalculations
    const scrollViewClassName = useMemo(() => {
        const androidScrollViewClassName = 'px-5';
        const iosScrollViewClassName = 'mx-5';
        return Platform.OS === 'ios' ? iosScrollViewClassName : androidScrollViewClassName;
    }, []);

    // Memoize the gradient colors to avoid recalculating on every render
    const colors = useMemo(() => {
        return colorScheme === 'light'
            ? [
                '#FFDEE9',  // Light Pink
                '#B5FFFC',  // Light Cyan
                '#D4FFEA',  // Light Green
                '#E9FFFE',  // Light Blue
                '#FFF4E0',  // Light Yellow
                '#FFDDC1'   // Light Orange
            ]
            : [
                '#D13568',  // Darker Pink
                '#004953',  // Darker Cyan
                '#005F43',  // Darker Green
                '#0B4F6C',  // Darker Blue
                '#4D2C1D',  // Darker Yellow
                '#7A2801'   // Darker Orange
            ];
    }, [colorScheme]);

    // Memoize the onHeaderNavBackPress and onHeaderNavOptionsPress callbacks
    const handleBackPress = useCallback(() => {
        if (onHeaderNavBackPress) {
            onHeaderNavBackPress();
        } else {
            router.back(); // Fallback if no custom onBackPress is provided
        }
    }, [onHeaderNavBackPress]);


    const handleOptionsPress = useCallback(() => {
        if (onHeaderNavOptionsPress) {
            onHeaderNavOptionsPress();
        }
    }, [onHeaderNavOptionsPress]);

    return (
        <StyledSafeAreaView className='flex-1'>
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
            >
                <ScreenNavHeader
                    showNavButton={showHeaderNavButton}
                    showOptions={showHeaderNavOptionButton}
                    title={headerTitle}
                    onBackPress={handleBackPress}
                    onOptionsPress={handleOptionsPress}
                />
                <StyledView className={`flex-1 ${scrollViewClassName}`}>
                    {children}
                </StyledView>
            </LinearGradient>
        </StyledSafeAreaView>
    );
};

export default ThemedScreen;
