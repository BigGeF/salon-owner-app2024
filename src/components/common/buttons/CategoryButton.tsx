import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styled } from 'nativewind';
import {useThemeColor} from "@/hooks/themeHooks/useThemeColor";

interface CategoryButtonProps {
    name: string;
    isSelected: boolean;
    onPress: () => void;
}

const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CategoryButton: React.FC<CategoryButtonProps> = ({ name, isSelected, onPress }) => {

    const themeTextColor = useThemeColor( {}, 'primaryButtonText');
    const themeBgColor = useThemeColor( {}, 'primaryButtonBG');

    return (
        <StyledTouchableOpacity
            className={`py-3 px-4 mx-1 rounded-full justify-center items-center ${isSelected ? `${themeBgColor}` : 'bg-gray-300'}`}
            onPress={onPress}
        >
            <StyledText className={`${isSelected ? `${themeTextColor}` : 'text-black'}`}>{name}</StyledText>
        </StyledTouchableOpacity>
    )
};

export default CategoryButton;
