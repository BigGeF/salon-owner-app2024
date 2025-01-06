import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import ThemedText from "@/components/themed/ThemedText";

interface OptionModalViewProps {
    onClose: () => void;
    title?: string;
    option1Text: string;
    option2Text: string;
    onOption1Press: () => void;
    onOption2Press: () => void;
}

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);

const OptionModalView: React.FC<OptionModalViewProps> = ({
                                                             onClose,
                                                             title,
                                                             option1Text,
                                                             option2Text,
                                                             onOption1Press,
                                                             onOption2Press,
                                                             ...rest
                                                         }) => (
    <StyledView {...rest}>
        {title && <ThemedText type='text-lg' textAlign='center' className='mb-6'>{title}</ThemedText>}
        <StyledTouchableOpacity className="py-4 w-full items-center" onPress={onOption1Press}>
            <ThemedText className='text-lg'>{option1Text}</ThemedText>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity className="py-4 w-full items-center" onPress={onOption2Press}>
            <ThemedText className='text-lg'>{option2Text}</ThemedText>
        </StyledTouchableOpacity>
    </StyledView>
);

export default React.memo(OptionModalView);
