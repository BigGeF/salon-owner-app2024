import React, { useMemo } from 'react';
import { View, type ViewProps } from 'react-native';
import { styled } from 'nativewind';
import { useThemeColor } from '@/hooks/themeHooks/useThemeColor';
import { Colors } from "@/constants/Colors";

// Define type styles as a Record
const typeStyles = {
    'default': '',
};

// Define ThemedTextProps using keyof typeof typeStyles for type prop
export type ThemedViewProps = ViewProps & {
    className?: string;
    lightColor?: string;
    darkColor?: string;
    type?: keyof typeof typeStyles; // Restrict type to keys of typeStyles
    colorName?: keyof typeof Colors;
};

// Create a styled version of the View component using NativeWind
const StyledView = styled(View);

export function ThemedText({
                               className = '',
                               style,
                               lightColor,
                               darkColor,
                               type = 'default',
                               colorName = 'viewBgColor',
                               ...rest
                           }: ThemedViewProps) {
    const themeColor = useThemeColor({ light: lightColor, dark: darkColor }, colorName);

    // Memoize newClassName to avoid re-calculation on every render
    const newClassName = useMemo(() => {
        return `${typeStyles[type]} ${themeColor} ${className}`;
    }, [type, themeColor, className]);

    return (
        <StyledView
            className={newClassName} // Apply the Tailwind class based on type, textAlign, and color
            style={style}
            {...rest}
        />
    );
}

export default ThemedText;
