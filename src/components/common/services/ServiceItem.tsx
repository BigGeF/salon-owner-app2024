import React from 'react';
import { View } from 'react-native';
import { ServiceAndCat } from '@/types';
import { styled } from 'nativewind';
import ThemedText from "@/components/themed/ThemedText";
import ThemedIcon from "@/components/themed/ThemedIcon";

interface ServiceItemProps {
    service: ServiceAndCat;
}

const StyledView = styled(View);

const ServiceItem: React.FC<ServiceItemProps> = ({ service }) => (

    <StyledView className="flex-row p-5 mb-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200">
        <StyledView className='flex-auto'>
            <StyledView className='mb-2'>
                <ThemedText type='text-lg'>{service.name}</ThemedText>
            </StyledView>
            <StyledView className='ml-1'>
                <ThemedText type='grey-bold' colorName='textGrey'>{`$${service.price}   |   ${service.duration} mins`}</ThemedText>
            </StyledView>
        </StyledView>
        <StyledView className='justify-center'>
            <ThemedIcon name='right' iconType='ant' size={24}/>
        </StyledView>
    </StyledView>
);

// Use React.memo to avoid unnecessary re-renders
export default React.memo(ServiceItem);
