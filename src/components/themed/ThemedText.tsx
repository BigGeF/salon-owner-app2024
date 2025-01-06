import React, {useMemo} from 'react';
import { Text, type TextProps } from 'react-native';
import { styled } from 'nativewind';
import { useThemeColor } from '@/hooks/themeHooks/useThemeColor';
import { Colors } from "@/constants/Colors";

// Define type styles as a Record
const typeStyles = {
    'default': 'text-base', // text-base corresponds to a fontSize of 16 in Tailwind
    'label': 'text-sm font-bold my-1',
    'grey-bold': 'text-base font-semibold',
    'text-sm': 'text-sm',
    'text-lg': 'text-lg font-bold',
    'text-xl': 'text-xl font-bold',
    'title-2x': 'text-2xl font-bold mb-4',
    'title-3x': 'text-3xl font-bold mb-4',
    'title-4x': 'text-4xl font-bold mb-4',
    'title-nav': 'text-xl font-semibold',
    'header': 'text-lg font-semibold uppercase mb-4',
    'input-error': 'text-sm font-semibold ml-2',
    'link': 'text-base underline', // Custom color and underline
};

// Define possible text alignments
const textAlignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

// Define ThemedTextProps using keyof typeof typeStyles for type prop
export type ThemedTextProps = TextProps & {
    className?: string;
    lightColor?: string;
    darkColor?: string;
    type?: keyof typeof typeStyles;
    colorName?: keyof typeof Colors
    textAlign?: keyof typeof textAlignments;
    isVisible?: boolean
};

// Create a styled version of the Text component using NativeWind
const StyledText = styled(Text);

export function ThemedText({
                               className = '',
                               style,
                               lightColor,
                               darkColor,
                               type = 'default',
                               colorName = 'text',
                               textAlign = 'left',
                               isVisible = true,
                               ...rest
                           }: ThemedTextProps) {
    const themeColor = useThemeColor({ light: lightColor, dark: darkColor }, colorName);

    // Memoize the className to avoid recalculations on every render
    const newClassName = useMemo(() => {
        return `${typeStyles[type]} ${textAlignments[textAlign]} ${themeColor} ${className}`;
    }, [type, textAlign, themeColor, className]);

    // Conditional rendering based on isVisible
    if (!isVisible) {
        return null;
    }

    return (
        <StyledText
            className={newClassName} // Apply the Tailwind class based on type, textAlign, and color
            style={style}
            {...rest}
        />
    );
}

export default ThemedText;
