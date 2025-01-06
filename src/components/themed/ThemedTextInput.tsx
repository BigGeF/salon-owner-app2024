import React, {useMemo, useState} from 'react';
import { TextInput, TouchableOpacity, View, type TextInputProps } from 'react-native';
import { styled } from 'nativewind';
import { useThemeColor } from '@/hooks/themeHooks/useThemeColor';
import { Colors } from "@/constants/Colors";
import {AntDesign} from "@expo/vector-icons";

export const ThemedTextInputTypes = {
    default: 'default',
    password: 'password',
    multi: 'multi'
};

export type ThemedTextInputProps = TextInputProps & {
    lightTextColor?: string;
    darkTextColor?: string;
    lightBgColor?: string;
    darkBgColor?: string;
    placeholderLightTextColor?: string;
    placeholderDarkTextColor?: string;
    type?: keyof typeof ThemedTextInputTypes;
    colorName?: keyof typeof Colors;
    hasError?: boolean
};

// Create a styled version of the TextInput and View components using NativeWind
const StyledTextInput = styled(TextInput);
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

export function ThemedTextInput({
                                    style,
                                    lightTextColor,
                                    darkTextColor,
                                    lightBgColor,
                                    darkBgColor,
                                    placeholderLightTextColor,
                                    placeholderDarkTextColor,
                                    type = 'default',
                                    colorName = 'text',
                                    hasError = false,
                                    onChangeText,
                                    ...rest
                                }: ThemedTextInputProps) {
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

    const themeTextColor = useThemeColor({ light: lightTextColor, dark: darkTextColor }, colorName);
    const themeBgColor = useThemeColor({ light: lightBgColor, dark: darkBgColor }, 'inputBackground');
    const placeholderTextColor = useThemeColor({ light: placeholderLightTextColor, dark: placeholderDarkTextColor }, 'inputPlaceholderText');
    const errorBorder = useThemeColor({}, 'errorInput');

    // Map types to Tailwind class names
    const typeStyles = useMemo(() => ({
        default: 'h-10 border border-gray-300 rounded px-2 mb-2',
        password: 'h-10 border border-gray-300 rounded px-2 mb-2',
        multi: 'h-24 border border-gray-300 rounded px-2 mb-2',
    }), []);

    const border = hasError ? `border-2 ${errorBorder}` : '';

    if (type === 'password') {
        const passwordClassName = `${typeStyles[type]} ${themeBgColor} ${border} flex-row items-center`;
        return (
            <StyledView className={passwordClassName}>
                <StyledTextInput
                    className={`${themeTextColor} flex-1`}
                    placeholderTextColor={placeholderTextColor}
                    style={style}
                    secureTextEntry={!showPassword} // Toggle secure text entry based on state
                    onChangeText={onChangeText}
                    {...rest}
                />
                <StyledTouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <AntDesign name={showPassword ? 'eyeo' : 'eye'} size={24} color="black" />
                </StyledTouchableOpacity>
            </StyledView>
        );
    }
    const className = `${typeStyles[type]} ${themeBgColor} ${themeTextColor} ${border}`;
    return (
        <StyledTextInput
            className={className}
            placeholderTextColor={placeholderTextColor}
            style={style}
            onChangeText={onChangeText}
            {...rest}
        />
    );
}

export default ThemedTextInput;
