import React from 'react';
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/themeHooks/useThemeColor';
import { Colors } from "@/constants/Colors";

// Define props for ThemedIcon
interface ThemedIconProps {
    className?: string,
    iconType: 'ant' | 'entypo' | 'fontawesome'; // Specifies the icon type (AntDesign or Entypo)
    name: keyof typeof AntDesign.glyphMap | keyof typeof Entypo.glyphMap; // Icon name
    size?: number; // Icon size
    colorName?: keyof typeof Colors; // Key for theme color
    lightColor?: string; // Optional specific light color
    darkColor?: string; // Optional specific dark color
}

const ThemedIcon: React.FC<ThemedIconProps> = ({
                                                   className='',
                                                   iconType,
                                                   name,
                                                   size = 24,
                                                   colorName = 'icon',
                                                   lightColor,
                                                   darkColor,
                                               }) => {
    // Get the themed color using useThemeColor hook
    const themeColor = useThemeColor({ light: lightColor, dark: darkColor }, colorName);

    // Render the appropriate icon based on the iconType
    if (iconType === 'ant' && name in AntDesign.glyphMap) {
        return (
            <AntDesign
                className={className}
                name={name as keyof typeof AntDesign.glyphMap}
                size={size}
                color={themeColor}
            />
        );
    }

    if (iconType === 'entypo' && name in Entypo.glyphMap) {
        return (
            <Entypo
                className={className}
                name={name as keyof typeof Entypo.glyphMap}
                size={size}
                color={themeColor}
            />
        );
    }

    if (iconType === 'fontawesome' && name in FontAwesome.glyphMap) {
        return (
            <FontAwesome
                className={className}
                name={name as keyof typeof FontAwesome.glyphMap}
                size={size}
                color={themeColor}
            />
        );
    }

    // Default return in case of mismatch or error
    return null;
};

export default ThemedIcon;
