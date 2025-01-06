import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router';

import { useSalonContext } from '@/context/SalonContext';

import ThemedText from "@/components/themed/ThemedText";
import ThemedScreen from "@/components/themed/ThemedScreen";
import ThemedBackgroundView from "@/components/themed/ThemedBackgroundView";
import ThemedDynamicModal from "@/components/themed/ThemedDynamicModal";

import OptionModalView from "@/components/common/modals/OptionModalView";
import AddEditSalonModalView from "@/components/common/modals/AddEditSalonModalView";

const SalonDetailsScreen: React.FC = () => {
    const { t } = useTranslation();
    const params = useLocalSearchParams();
    const { salons } = useSalonContext();
    const salonId = params.id as string;

    const existingSalon = useMemo(() => {
        return salons?.find(salon => salon._id === salonId);
    }, [salons, salonId]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentModalView, setCurrentModalView] = useState('editSalonOption');

    // Memoize handleOptionPress to prevent unnecessary re-renders
    const handleOptionPress = useCallback(() => {
        setCurrentModalView('editSalonOption');
        setIsModalVisible(true);
    }, []);

    // Memoize the modal closing functions to avoid re-creating them unnecessarily
    const handleCloseModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const switchViewToAddEditSalon = useCallback(() => {
        setCurrentModalView('addEditSalon');
    }, []);

    const modalViews = useMemo(() => [
        {
            key: "editSalonOption",
            component: (
                <OptionModalView
                    onClose={handleCloseModal}
                    option1Text={t('salon.salonDetailsScreen.editSalonDetails')}
                    option2Text={t('common.cancel')}
                    onOption1Press={switchViewToAddEditSalon}
                    onOption2Press={handleCloseModal}
                />
            )
        },
        {
            key: "addEditSalon",
            component: (
                <AddEditSalonModalView
                    visible={currentModalView === 'addEditSalon'}
                    onClose={handleCloseModal}
                    salon={existingSalon}
                />
            )
        },
    ], [t, currentModalView, existingSalon, handleCloseModal, switchViewToAddEditSalon]);

    return (
        <ThemedScreen
            headerTitle={t('salon.salonDetailsScreen.salonDetails')}
            showHeaderNavButton={true}
            showHeaderNavOptionButton={true}
            onHeaderNavOptionsPress={handleOptionPress}
        >
            <ThemedText type='title-3x' textAlign='center'>{existingSalon?.name}</ThemedText>
            <ThemedBackgroundView className="mb-5 rounded-lg p-5">
                <ThemedText type='header' textAlign='center'>{t('salon.salonDetailsScreen.contact')}</ThemedText>
                <ThemedText type='label' colorName='accent'>{t('common.contactInfo.phone')}</ThemedText>
                <ThemedText>{existingSalon?.contact.phone}</ThemedText>
                <ThemedText type='label' colorName='accent'>{t('common.contactInfo.email')}</ThemedText>
                <ThemedText>{existingSalon?.contact.email}</ThemedText>
            </ThemedBackgroundView>
            <ThemedBackgroundView className="mb-5 rounded-lg p-5">
                <ThemedText type='header' textAlign='center'>{t('salon.salonDetailsScreen.address')}</ThemedText>
                <ThemedText type='label' colorName='accent'>{t('common.address.street')}</ThemedText>
                <ThemedText>{existingSalon?.address.street}</ThemedText>
                <ThemedText type='label' colorName='accent'>{t('common.address.city')}</ThemedText>
                <ThemedText>{existingSalon?.address.city}</ThemedText>
                <ThemedText type='label' colorName='accent'>{t('common.address.state')}</ThemedText>
                <ThemedText>{existingSalon?.address.state}</ThemedText>
                <ThemedText type='label' colorName='accent'>{t('common.address.zip')}</ThemedText>
                <ThemedText>{existingSalon?.address.zip}</ThemedText>
            </ThemedBackgroundView>

            <ThemedDynamicModal
                type='bottom'
                animationType='slide'
                visible={isModalVisible}
                onClose={handleCloseModal}
                views={modalViews}
                currentView={currentModalView}
            />
        </ThemedScreen>
    );
};

export default SalonDetailsScreen;
