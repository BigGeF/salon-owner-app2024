import React, { useState, useMemo, useCallback } from "react";
import { FlatList } from "react-native";
import { useTranslation } from 'react-i18next';
import { router } from "expo-router";
import { Client } from "@/types";

import { useClientContext } from "@/context/ClientContext";
import ClientItem from "@/components/common/clients/ClientItem";
import { useDeleteClient } from "@/hooks/clientHooks/useDeleteClient";
import { useDefaultSalonIdContext } from "@/context/DefaultSalonIdContext";

import ThemedScreen from "@/components/themed/ThemedScreen";
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextInput from "@/components/themed/ThemedTextInput";
import ThemedDynamicModal from "@/components/themed/ThemedDynamicModal";
import OptionModalView from "@/components/common/modals/OptionModalView";
import AddEditClientModalView from "@/components/common/modals/AddEditClientModalView";

const ClientScreen: React.FC = () => {
    const { t } = useTranslation();
    const { clients, refetchClients } = useClientContext();
    const { defaultSalonId } = useDefaultSalonIdContext();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentModalView, setCurrentModalView] = useState('options');

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const deleteClientMutation = useDeleteClient();

    // Memoize filteredClients to avoid recalculating on every render
    const filteredClients = useMemo(() => {
        return clients.filter(client =>
            client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.phone.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [clients, searchQuery]);

    // Memoize event handlers
    const handleBackPressed = useCallback(() => {
        router.back();
    }, []);

    const handleModalClose = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const handleHeaderMenuPressed = useCallback(() => {
        setCurrentModalView('addClientOption');
        setIsModalVisible(true);
    }, []);

    const handleClientSelected = useCallback((client: Client) => {
        setSelectedClient(client);
        setCurrentModalView('editDeleteClientOption');
        setIsModalVisible(true);
    }, []);

    const handleDeleteClientConfirm = useCallback(() => {
        if (selectedClient && defaultSalonId) {
            deleteClientMutation.mutate({
                    salonId: defaultSalonId,
                    clientId: selectedClient._id
                },
                {
                    onSuccess: () => {
                        console.log('Client deleted successfully');
                        handleModalClose();
                        refetchClients(); // Refresh the client list
                    },
                    onError: (error) => {
                        console.error('Error deleting client:', error);
                    },
                });
        }
    }, [selectedClient, defaultSalonId, deleteClientMutation, refetchClients, handleModalClose]);

    // Memoize modalViews for the dynamic modal
    const modalViews = useMemo(() => [
        {
            key: 'addClientOption',
            component: (
                <OptionModalView
                    onClose={handleModalClose}
                    option1Text={t('client.clientsScreen.addNewClient')}
                    option2Text={t('common.cancel')}
                    onOption1Press={() => {
                        setSelectedClient(null);
                        setCurrentModalView('addEditClient');
                    }}
                    onOption2Press={handleModalClose}
                />
            )
        },
        {
            key: 'editDeleteClientOption',
            component: (
                <OptionModalView
                    onClose={handleModalClose}
                    option1Text={t('client.clientsScreen.editClient')}
                    option2Text={t('client.clientsScreen.deleteClient')}
                    onOption1Press={() => { setCurrentModalView('addEditClient'); }}
                    onOption2Press={() => { setCurrentModalView('deleteClientOption'); }}
                />
            )
        },
        {
            key: 'deleteClientOption',
            component: (
                <OptionModalView
                    onClose={handleModalClose}
                    title={selectedClient ? `${t('common.delete')} ${selectedClient.firstName} ${selectedClient.lastName}?` : `${t('client.clientsScreen.deleteClient')}?`}
                    option1Text={t('common.yes')}
                    option2Text={t('common.cancel')}
                    onOption1Press={() => {
                        handleDeleteClientConfirm();
                        handleModalClose();
                    }}
                    onOption2Press={handleModalClose}
                />
            )
        },
        {
            key: 'addEditClient',
            component: (
                <AddEditClientModalView
                    visible={isModalVisible}
                    onClose={handleModalClose}
                    client={selectedClient}
                />
            )
        }
    ], [handleModalClose, handleDeleteClientConfirm, selectedClient, isModalVisible, t]);

    return (
        <ThemedScreen
            headerTitle={t('client.clientsScreen.clients')}
            showHeaderNavButton={true}
            showHeaderNavOptionButton={true}
            onHeaderNavBackPress={handleBackPressed}
            onHeaderNavOptionsPress={handleHeaderMenuPressed}
        >
            <ThemedText type='title-2x'>{t('client.clientsScreen.clients')}</ThemedText>
            <ThemedTextInput
                placeholder={t('client.clientsScreen.searchPlaceholder')}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <FlatList<Client>
                data={filteredClients}
                renderItem={({ item }) => (
                    <ClientItem item={item} onClientSelect={handleClientSelected}/>
                )}
                keyExtractor={item => item._id}
                style={{ marginBottom: 10 }}
            />

            <ThemedDynamicModal
                type='bottom'
                animationType='slide'
                visible={isModalVisible}
                onClose={handleModalClose}
                views={modalViews}
                currentView={currentModalView}
            />
        </ThemedScreen>
    );
}

export default ClientScreen;
