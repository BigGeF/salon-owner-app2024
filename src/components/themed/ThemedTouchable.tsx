import React, {useMemo, useState} from 'react';
import { Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { styled } from 'nativewind';
import { useThemeColor } from '@/hooks/themeHooks/useThemeColor';
import { Colors } from "@/constants/Colors";
import {AntDesign, FontAwesome} from "@expo/vector-icons";


export type ThemedTouchableProps = TouchableOpacityProps & {
    onPress: () => void;
    touchableText?: string;
    lightTextColor?: string;
    darkTextColor?: string;
    lightBgColor?: string;
    darkBgColor?: string;
    placeholderLightTextColor?: string;
    placeholderDarkTextColor?: string;
    hasIcon?: boolean;
    colorName?: keyof typeof Colors;
    hasError?: boolean
};

// Create a styled version of the TextInput and View components using NativeWind
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export function ThemedTouchable({
                                    style,
                                    onPress,
                                    touchableText,
                                    lightTextColor,
                                    darkTextColor,
                                    lightBgColor,
                                    darkBgColor,
                                    placeholderLightTextColor,
                                    placeholderDarkTextColor,
                                    hasIcon = true,
                                    colorName = 'text',
                                    hasError = false,
                                    ...rest
                                }: ThemedTouchableProps) {

    const themeTextColor = useThemeColor({ light: lightTextColor, dark: darkTextColor }, colorName);
    const themeBgColor = useThemeColor({ light: lightBgColor, dark: darkBgColor }, 'inputBackground');
    const placeholderTextColor = useThemeColor({ light: placeholderLightTextColor, dark: placeholderDarkTextColor }, 'inputPlaceholderText');
    const errorBorder = useThemeColor({}, 'errorInput');


    const border = hasError ? `border-2 ${errorBorder}` : '';


    const className = `${themeBgColor} ${themeTextColor} ${border}`;
    return (
        <StyledTouchableOpacity
            className="flex-1 justify-center p-3 border border-blue-400 rounded-lg bg-white shadow-md flex-row items-center"
            onPress={onPress}
            {...rest}
        >
            {touchableText && <StyledText className="text-lg text-left text-blue-700 flex-grow">
                {touchableText}
            </StyledText>}
            {hasIcon && <FontAwesome name="chevron-down" size={20} color="blue"/>}
        </StyledTouchableOpacity>
    );
}

export default ThemedTouchable;
