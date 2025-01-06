import React, { useEffect, useState, useMemo } from 'react';
import { View, TouchableOpacity, FlatList, type ModalProps } from 'react-native';
import { styled } from 'nativewind';
import { AntDesign } from '@expo/vector-icons';
import { useClientContext } from "@/context/ClientContext";
import ThemedTextInput from "@/components/themed/ThemedTextInput";
import ThemedText from "@/components/themed/ThemedText";
import { useTranslation } from 'react-i18next';
import ClientItem from "@/components/common/clients/ClientItem";
import { Client } from "@/types";

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface SelectClientModalProps extends ModalProps {
    visible: boolean;
    salonId: string;
    AddEditClientModalView: () => void;
    onClientSelect: (client: Partial<Client>) => void;
    onWalkInSelect: () => void;
}

const SelectClientModalView: React.FC<SelectClientModalProps> = ({
                                                                 visible,
                                                                 AddEditClientModalView,
                                                                 onClientSelect,
                                                                 onWalkInSelect,
                                                             }) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const { clients } = useClientContext();

    const filteredClients = useMemo(() => {
        return clients.filter(client =>
            client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.phone.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, clients]);

    useEffect(() => {
        if (visible) {
            setSearchQuery('');
        }
    }, [visible]);

    return (
        <StyledView className='p-3 flex-auto'>
            <ThemedText type='title-2x'>{t('client.selectClientModalView.selectClient')}</ThemedText>
            <ThemedTextInput
                placeholder={t('client.selectClientModalView.searchPlaceholder')}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <StyledTouchableOpacity
                className="flex-row items-center px-2 border-b border-gray-200"
                onPress={AddEditClientModalView}
            >
                <StyledView className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center my-4 mr-3">
                    <AntDesign name="plus" size={20} color="purple" />
                </StyledView>
                <ThemedText type='text-lg'>{t('client.selectClientModalView.addNewClient')}</ThemedText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
                className="flex-row items-center px-2 border-b border-gray-200"
                onPress={onWalkInSelect}
            >
                <StyledView className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center my-4 mr-3">
                    <AntDesign name="user" size={20} color="purple" />
                </StyledView>
                <ThemedText type='text-lg'>{t('client.selectClientModalView.walkIn')}</ThemedText>
            </StyledTouchableOpacity>
            <FlatList<Client>
                data={filteredClients}
                renderItem={({ item }) => (
                    <ClientItem item={item} onClientSelect={onClientSelect} />
                )}
                keyExtractor={item => item._id}
                style={{ marginBottom: 10 }}
            />
        </StyledView>
    );
};

export default React.memo(SelectClientModalView);
