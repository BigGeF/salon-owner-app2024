import React, { useCallback } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { styled } from 'nativewind';
import { router } from "expo-router";
import ThemedText from "@/components/themed/ThemedText";
import ThemedIcon from "@/components/themed/ThemedIcon";

// Styled Components
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

// Props for the reusable component
type ScreenNavHeaderProps = {
    title?: string;
    onBackPress?: () => void;
    onOptionsPress?: () => void;
    showNavButton?: boolean;
    showOptions?: boolean;
};

const ScreenNavHeader: React.FC<ScreenNavHeaderProps> = ({
                                                             title = '',
                                                             onBackPress = () => router.back(),
                                                             onOptionsPress,
                                                             showNavButton = true,
                                                             showOptions = true
                                                         }) => {
    const androidScrollViewClassName = 'px-5';
    const iosScrollViewClassName = 'mx-5';
    const scrollViewClassName = Platform.OS === 'ios' ? iosScrollViewClassName : androidScrollViewClassName;

    // Use useCallback for the press handlers
    const handleBackPress = useCallback(() => {
        if (onBackPress) onBackPress();
    }, [onBackPress]);

    const handleOptionsPress = useCallback(() => {
        if (onOptionsPress) onOptionsPress();
    }, [onOptionsPress]);

    return (
        <StyledView className={`flex-row justify-between items-center h-14 ${scrollViewClassName}`}>
            {showNavButton && (
                <StyledTouchableOpacity onPress={handleBackPress}>
                    <ThemedIcon name='arrowleft' iconType='ant' size={24} />
                </StyledTouchableOpacity>
            )}
            <ThemedText type='title-nav'>{title}</ThemedText>
            {showOptions && (
                <StyledTouchableOpacity onPress={handleOptionsPress}>
                    <ThemedIcon iconType='entypo' name='dots-three-horizontal' size={24} />
                </StyledTouchableOpacity>
            )}
        </StyledView>
    );
};

// Wrap in React.memo to prevent unnecessary re-renders
export default React.memo(ScreenNavHeader);
