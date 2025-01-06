// ServiceSelectionModal.tsx
import React, {useState} from 'react';
import { Modal, TouchableOpacity, TextInput, ScrollView, View, Text } from 'react-native';
import { styled } from 'nativewind';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useServiceContext } from '@/context/ServicesContext';
import { useCategoriesContext } from '@/context/CategoriesContext';
import {ServiceAndCat} from "@/types";
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextInput from "@/components/themed/ThemedTextInput";

interface ServiceSelectModalViewProps {
    visible: boolean;
    handleServiceSelection: (service: ServiceAndCat) => void;
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

const ServiceSelectModalView: React.FC<ServiceSelectModalViewProps> = ({
                                                                         visible,
                                                                         handleServiceSelection
                                                                     }) => {
    const { t } = useTranslation();
    const { services } = useServiceContext();
    const { categories } = useCategoriesContext();

    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
        <StyledScrollView className='pb-5' contentContainerStyle={{ flexGrow: 1 }}>
            <ThemedText type='title-2x' textAlign='center'>
                {t('Select a Service')}
            </ThemedText>

            <ThemedTextInput
                placeholder={t('Enter Service Name')}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <StyledView className='mt-2'>
                {categories.map(category => (
                    <StyledView key={category._id} className="w-full mb-4">
                        <ThemedText type='text-lg'>
                            {category.name}
                        </ThemedText>

                        {services
                            .filter(service => service.categoryId._id === category._id && service.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(service => (
                                <StyledTouchableOpacity
                                    key={service._id}
                                    className="p-3 border-b border-gray-200 w-full"
                                    onPress={() => handleServiceSelection(service)}
                                >
                                    <StyledView className="flex-row justify-between items-center py-2">
                                        <ThemedText type='text-lg' colorName='textGrey'>{service.name}</ThemedText>
                                        <ThemedText className="text-lg text-purple-500">$ {service.price}</ThemedText>
                                    </StyledView>
                                </StyledTouchableOpacity>
                            ))}
                    </StyledView>
                ))}
            </StyledView>
        </StyledScrollView>
    );
};

export default ServiceSelectModalView;
