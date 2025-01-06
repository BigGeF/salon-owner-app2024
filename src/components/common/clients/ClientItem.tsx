import React from 'react'; // Ensure React is imported
import { TouchableOpacity, View } from 'react-native';
import { styled } from 'nativewind';
import ThemedText from '@/components/themed/ThemedText'; // Adjust the path based on your folder structure
import { Client } from '@/types'; // Assuming `Client` type is defined elsewhere in your project

// Styled components
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);

interface ClientItemProps {
    item: Client;
    onClientSelect: (client: Client) => void;
}

const ClientItem: React.FC<ClientItemProps> = ({ item, onClientSelect }) => {
    return (
        <StyledTouchableOpacity
            className="flex-row items-center py-4 px-2 border-b border-gray-200"
            onPress={() => onClientSelect(item)}
        >
            <StyledView className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mr-3">
                <ThemedText type="text-lg" className="text-purple-700">
                    {item.firstName?.charAt(0)}
                </ThemedText>
            </StyledView>
            <StyledView>
                <ThemedText type="text-lg">{`${item.firstName} ${item.lastName}`}</ThemedText>
                <ThemedText type="text-sm" colorName="textGrey">
                    {item.phone}
                </ThemedText>
                <ThemedText type="text-sm" colorName="textGrey">
                    {item.email}
                </ThemedText>
            </StyledView>
        </StyledTouchableOpacity>
    );
};

// Memoize the component
export default React.memo(ClientItem);
