import React, { useCallback } from 'react';
import { FlatList, View, TouchableOpacity } from 'react-native';
import ServiceItem from './ServiceItem';
import { ServiceAndCat } from '@/types';
import { styled } from 'nativewind';
import ThemedText from "@/components/themed/ThemedText";
import ThemedIcon from "@/components/themed/ThemedIcon";

interface GroupedServicesProps {
    groupedServices: { categoryName: string; categoryId: string; services: ServiceAndCat[] }[];
    onServicePress: (service: ServiceAndCat) => void;
    onCategoryOptionsPress: (categoryId: string) => void;
}

// Create styled components without generics
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

// Use the regular FlatList with generics for proper type support
const GroupedServices: React.FC<GroupedServicesProps> = ({
                                                             groupedServices,
                                                             onServicePress,
                                                             onCategoryOptionsPress,
                                                         }) => {

    // Memoize the category options press handler
    const handleCategoryOptionsPress = useCallback((categoryId: string) => {
        onCategoryOptionsPress(categoryId);
    }, [onCategoryOptionsPress]);

    // Memoize the service press handler
    const handleServicePress = useCallback((service: ServiceAndCat) => {
        onServicePress(service);
    }, [onServicePress]);

    return (
        <FlatList<{ categoryName: string; categoryId: string; services: ServiceAndCat[] }>
            data={groupedServices}
            keyExtractor={(item) => item.categoryId} // Use categoryId if it's unique
            renderItem={({ item }) => (
                <StyledView className="mb-5">
                    <StyledView className="flex-row justify-between items-center p-2">
                        <ThemedText type='text-lg'>{item.categoryName}</ThemedText>
                        <StyledTouchableOpacity onPress={() => handleCategoryOptionsPress(item.categoryId)}>
                            <ThemedIcon iconType='entypo' name='dots-three-vertical' size={24} />
                        </StyledTouchableOpacity>
                    </StyledView>
                    {item.services.map((service) => (
                        <StyledTouchableOpacity key={service._id} onPress={() => handleServicePress(service)}>
                            <ServiceItem service={service} />
                        </StyledTouchableOpacity>
                    ))}
                </StyledView>
            )}
            contentContainerStyle={{ paddingHorizontal: 5 }}
        />
    );
};

// Wrap in React.memo to prevent unnecessary re-renders
export default React.memo(GroupedServices);
