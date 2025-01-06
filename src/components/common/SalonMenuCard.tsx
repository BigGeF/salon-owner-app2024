import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { styled } from 'nativewind';
import ThemedText from "@/components/themed/ThemedText";
import ThemedIcon from "@/components/themed/ThemedIcon";

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);

interface SalonMenuCardProps {
    title: string;
    iconName: keyof typeof AntDesign.glyphMap;
    onPress: () => void;
    addedClassName?: string;
}

const SalonMenuCard: React.FC<SalonMenuCardProps> = ({ title, iconName, onPress, addedClassName = '' }) => {

    const handlePress = useCallback(() => {
        onPress();
    }, [onPress]);

    return (
        <StyledTouchableOpacity
            className={`bg-white dark:bg-slate-800 p-5 mb-4 rounded-xl flex-1 ${addedClassName}`}
            onPress={handlePress} // Use memoized callback
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 10,
            }}
        >
            <StyledView className="mt-auto">
                <ThemedIcon name={iconName} iconType='ant' size={24}/>
                <StyledView className="flex-row justify-between mt-2 w-full">
                    <ThemedText type='text-lg'>{title}</ThemedText>
                </StyledView>
            </StyledView>
        </StyledTouchableOpacity>
    );
};

export default React.memo(SalonMenuCard);
