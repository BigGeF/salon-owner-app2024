import React, { useMemo, useCallback } from 'react';
import { TouchableOpacity, Text, type TextProps, View } from 'react-native';
import { styled } from 'nativewind';
import Loading from 'react-native-animated-loading-dots';
import { useThemeColor } from '@/hooks/themeHooks/useThemeColor';
import { Colors } from "@/constants/Colors";

// Define type styles as a Record
const typeStyles = {
    'primary': 'justify-center py-3 px-4 h-12 rounded-full items-center',
    'cancel': 'justify-center py-2 px-4 h-12 rounded-full items-center border border-2',
    'primary-sm': 'justify-center py-2 px-3 h-10 rounded-full items-center',
};

// Define possible text alignments
const textAlignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

const flexWidths = {
    zero: 'flex-0',
    full: 'flex-1',
};

// Define ThemedButtonProps using keyof typeof typeStyles for type prop
export type ThemedButtonProps = TextProps & {
    text: string;
    handleOnPress: () => void;
    lightTextColor?: string;
    darkTextColor?: string;
    lightBgColor?: string;
    darkBgColor?: string;
    type?: keyof typeof typeStyles;
    textColorName?: keyof typeof Colors;
    bgColorName?: keyof typeof Colors;
    textAlign?: keyof typeof textAlignments;
    flexWidth?: keyof typeof flexWidths;
    status?: 'error' | 'idle' | 'pending' | 'success';
    disabled?: boolean;
};

// Create a styled version of components using NativeWind
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledText = styled(Text);

export function ThemedButton({
                                 style,
                                 text,
                                 lightTextColor,
                                 darkTextColor,
                                 lightBgColor,
                                 darkBgColor,
                                 type = 'primary',
                                 textColorName = 'primaryButtonText',
                                 bgColorName = 'primaryButtonBG',
                                 textAlign = 'left',
                                 flexWidth = 'zero',
                                 status = 'idle',
                                 disabled = false,
                                 handleOnPress,
                                 ...rest
                             }: ThemedButtonProps) {
    const themeTextColor = useThemeColor({ light: lightTextColor, dark: darkTextColor }, textColorName);
    const themeBgColor = useThemeColor({ light: lightBgColor, dark: darkBgColor }, bgColorName);

    // Memoize class names
    const buttonClassName = useMemo(() => {
        return `${typeStyles[type]} ${themeBgColor}`;
    }, [type, themeBgColor]);

    const textClassName = useMemo(() => {
        return `${textAlignments[textAlign]} ${themeTextColor} text-base font-semibold`;
    }, [textAlign, themeTextColor]);

    // Memoize handleOnPress to avoid recreating the function on every render
    const onPressHandler = useCallback(() => {
        handleOnPress();
    }, [handleOnPress]);

    const colors: string[] = ["#FFF", "#FFF", "#FFF"];

    return (
        <StyledTouchableOpacity
            className={`mx-1 ${flexWidths[flexWidth]}`}
            onPress={onPressHandler}
            style={style}
            {...rest}
            disabled={disabled || status === 'pending'} // Disable button when status is 'pending'
        >
            <StyledView className={buttonClassName}>
                {status === 'pending' ? (
                    // Show loading indicator when status is 'pending'
                    <StyledView className='mt-1'>
                        <Loading
                            dotCount={3}
                            dotSize={14}
                            dotSpacing={8}
                            duration={200}
                            dotStyle={{ borderRadius: 100 }}
                            colors={colors}
                            animationType="FADE_IN_OUT"
                        />
                    </StyledView>
                ) : (
                    // Show button text otherwise
                    <StyledText className={textClassName}>{text}</StyledText>
                )}
            </StyledView>
        </StyledTouchableOpacity>
    );
}

export default ThemedButton;
