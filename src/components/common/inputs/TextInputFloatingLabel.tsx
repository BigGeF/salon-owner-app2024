import React, { useRef, useState, useEffect } from 'react';
import { Animated, TextInput, TextInputProps, View } from 'react-native';
import { styled } from 'nativewind';
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/themeHooks/useThemeColor";
import ThemedText from "@/components/themed/ThemedText";

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledAnimatedText = styled(Animated.Text);

export const ThemedTextInputTypes = {
    default: 'default',
    password: 'password',
    multi: 'multi'
};

interface TextInputFloatingLabelProps extends TextInputProps {
    label: string;
    errorMessage?: string;
    lightTextColor?: string;
    darkTextColor?: string;
    lightBgColor?: string;
    darkBgColor?: string;
    labelColor?: string;
    labelDarkColor?: string;
    labelColorName?: keyof typeof Colors;
    textColorName?: keyof typeof Colors;
    hasError?: boolean;
    showError?: boolean;
}

const TextInputFloatingLabel: React.FC<TextInputFloatingLabelProps> = ({
                                                                           label,
                                                                           value = '',
                                                                           errorMessage,
                                                                           lightTextColor,
                                                                           darkTextColor,
                                                                           lightBgColor,
                                                                           darkBgColor,
                                                                           labelColor,
                                                                           labelDarkColor,
                                                                           labelColorName = 'accent',
                                                                           textColorName = 'text',
                                                                           hasError = false,
                                                                           showError = true,
                                                                           onFocus,
                                                                           onBlur,
                                                                           ...textInputProps
                                                                       }) => {
    const themeTextColor = useThemeColor({ light: lightTextColor, dark: darkTextColor }, textColorName);
    const themeLabelColor = useThemeColor({ light: lightTextColor, dark: darkTextColor }, labelColorName);
    const borderColor = useThemeColor({}, hasError ? 'errorInput' : 'cancelButtonBG');

    const floatingLabelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;
    const [fontWeight, setFontWeight] = useState<'bold' | 'normal'>('normal'); // Simple fontWeight state
    const [isFocused, setIsFocused] = useState(false); // Track if the field is focused

    const triggerLabelAnimation = (toValue: number) => {
        Animated.timing(floatingLabelAnimation, {
            toValue,
            duration: 150,
            useNativeDriver: false,
        }).start();
    };

    const handleFocus = (e: any) => {
        setFontWeight('bold'); // Set font weight to bold on focus
        setIsFocused(true); // Mark the field as focused
        triggerLabelAnimation(1);
        if (onFocus) {
            onFocus(e);
        }
    };

    const handleBlur = (e: any) => {
        setIsFocused(false); // Mark the field as not focused
        if (!value) {
            setFontWeight('normal'); // Reset font weight to normal on blur if no value
            triggerLabelAnimation(0);
        }
        if (onBlur) {
            onBlur(e);
        }
    };

    // Trigger animation based on the value changes (for programmatically set values)
    useEffect(() => {
        if (value || isFocused) {
            triggerLabelAnimation(1);
            setFontWeight('bold');
        } else {
            triggerLabelAnimation(0);
            setFontWeight('normal');
        }
    }, [value, isFocused]);

    // Define animated styles for the floating label position and size
    const floatingLabelStyle = {
        top: floatingLabelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [10, -5], // top value
        }),
        fontSize: floatingLabelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12], // font size
        }),
        fontWeight // This is handled here
    };

    return (
        <StyledView className="mt-5 mx-2">
            <StyledAnimatedText
                style={floatingLabelStyle} // Consolidate the styles here
                className={`absolute ${themeLabelColor}`}
            >
                {label}
            </StyledAnimatedText>
            <StyledTextInput
                className={`pt-3 pb-1 px-2 border-b ${borderColor} ${themeTextColor} text-lg`}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={value}
                {...textInputProps}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={showError && hasError}>{errorMessage}</ThemedText>
        </StyledView>
    );
};

export default TextInputFloatingLabel;
