import React, {useMemo} from 'react';
import {View,Platform} from "react-native";
import RNPickerSelect, {Item, PickerSelectProps} from 'react-native-picker-select';
import { styled } from 'nativewind';
import { useThemeColor } from '@/hooks/themeHooks/useThemeColor';
import { Colors } from "@/constants/Colors";
import ThemedIcon from "./ThemedIcon";

// Define props for ThemedPickerSelect
export type ThemedPickerSelectProps = PickerSelectProps & {
    placeholderText?: string;
    lightTextColor?: string;
    darkTextColor?: string;
    lightBgColor?: string;
    darkBgColor?: string;
    colorName?: keyof typeof Colors;
};

// Styled version of View using NativeWind
const StyledView = styled(View);

export function ThemedPickerSelect({
                                       placeholderText,
                                       lightTextColor,
                                       darkTextColor,
                                       lightBgColor,
                                       darkBgColor,
                                       colorName = 'pickerText',
                                       style,
                                       ...rest
                                   }: ThemedPickerSelectProps) {

    
    // Get the themed color using useThemeColor hook
    const themeColor = useThemeColor({ light: lightTextColor, dark: darkTextColor }, colorName);
    const bgColor = useThemeColor({ light: lightBgColor, dark: darkBgColor }, 'pickerBackground');

    // Memoize the picker styles to prevent recreating them on each render
    const pickerStyle = useMemo(() => ({
        inputIOS: {
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 10,
            paddingRight: 40,
            borderRadius: 5,
            backgroundColor: bgColor,
            color: themeColor,
        },
        inputAndroid: {
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 10,
            paddingRight: 40,
            borderRadius: 5,
            backgroundColor: bgColor,
            color: themeColor
        }
    }), [bgColor, themeColor]);

    // Memoize the placeholder to prevent unnecessary recalculations
    const placeholder: Item = useMemo(() => ({
        label: placeholderText ? placeholderText : '',
        value: undefined,
        color: 'gray',
    }), [placeholderText]);

    return (
        <RNPickerSelect
            useNativeAndroidPickerStyle={false}
            placeholder={placeholder}
            style={{
                ...pickerStyle,
                ...style, // Spread additional styles passed through props
            }}
            {...rest} // Pass down other RNPickerSelect props
            Icon={() => {
                if(Platform.OS === "web"){
                    return null;
                }

                return (
                    <StyledView className='m-2'>
                        <ThemedIcon iconType='ant' name='down' />
                    </StyledView>
                )
            }}
        />
    );
}

export default ThemedPickerSelect;
