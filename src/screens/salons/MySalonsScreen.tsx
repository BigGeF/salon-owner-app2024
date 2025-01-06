import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { useSalonContext } from '@/context/SalonContext';
import { useDefaultSalonIdContext } from '@/context/DefaultSalonIdContext';
import { useEditDefaultSalonId } from '@/hooks/salonHooks/useEditDefaultSalonId';
import { getOwnerId } from "@/utils/auth";

import { styled } from 'nativewind';
import ThemedText from "@/components/themed/ThemedText";
import ThemedIcon from "@/components/themed/ThemedIcon";
import ThemedScreen from '@/components/themed/ThemedScreen';

import OptionModalView from "@/components/common/modals/OptionModalView";
import AddEditSalonModalView from "@/components/common/modals/AddEditSalonModalView";
import ThemedDynamicModal from "@/components/themed/ThemedDynamicModal";

import { Salon } from '@/types';
 console.log("ownerIdd",getOwnerId());
 
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledActivityIndicator = styled(ActivityIndicator);

const MySalonsScreen: React.FC = () => {
    const { t } = useTranslation();
    const [ownerId, setOwnerId] = useState<string | null>(null);
    const { salons, isSalonsLoading, salonsError, refetchSalons } = useSalonContext();
    const { defaultSalonId } = useDefaultSalonIdContext();
    const { mutate: editDefaultSalonId } = useEditDefaultSalonId(ownerId);
    const router = useRouter();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentModalView, setCurrentModalView] = useState('');
    const [selectedSalonId, setSelectedSalonId] = useState<string | null>(null);

    useEffect(() => {
        const fetchOwnerId = async () => {
            const result = await getOwnerId();
            console.log("result------ ",result.ownerId);
            
            setOwnerId(result.ownerId); // Set the ownerId state
        };

        void fetchOwnerId();
    }, []);

    const handleBackPressed = useCallback(() => {
        router.replace('settings/');
    }, [router]);

    const handleCloseModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const handleAddSalonSelected = useCallback(() => {
        setCurrentModalView('addSalon');
    }, []);

    const handleSalonSelected = useCallback((salonId: string) => {
        setSelectedSalonId(salonId);
        setCurrentModalView('changeCurrentSalon');
        setIsModalVisible(true);
    }, []);
    
    const handleSetDefaultSalon = useCallback((salonId: string) => {
        editDefaultSalonId({ defaultSalonId: salonId });
        setIsModalVisible(false);
    }, [editDefaultSalonId]);

    const handleMenuButtonSelected = useCallback(() => {
        setCurrentModalView('addSalonOption');
        setIsModalVisible(true);
    }, []);

    const modalViews = useMemo(() => [
        {
            key: 'changeCurrentSalon',
            component: (
                <OptionModalView
                    onClose={handleCloseModal}
                    title={t('salon.mySalonsScreen.changeCurrentSalon')}
                    option1Text={t('common.yes')}
                    option2Text={t('common.cancel')}
                    onOption1Press={() => handleSetDefaultSalon(selectedSalonId!)}
                    onOption2Press={handleCloseModal}
                />
            )
        },
        {
            key: 'addSalonOption',
            component: (
                <OptionModalView
                    onClose={handleCloseModal}
                    option1Text={t('salon.mySalonsScreen.addSalon')}
                    option2Text={t('common.cancel')}
                    onOption1Press={handleAddSalonSelected}
                    onOption2Press={handleCloseModal}
                />
            )
        },
        {
            key: 'addSalon',
            component: (
                <AddEditSalonModalView
                    visible={currentModalView === 'addSalon'}
                    onClose={handleCloseModal}
                />
            )
        }
    ], [t, handleCloseModal, handleSetDefaultSalon, selectedSalonId, currentModalView, handleAddSalonSelected]);

    const renderSalonListItem = useCallback(({ item }: { item: Salon }) => {
        const isSelected = defaultSalonId === item._id;
        return (
            <StyledTouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-200" onPress={() => handleSalonSelected(item._id)}>
                <StyledView>
                    <ThemedText>{item.name}</ThemedText>
                    <ThemedText type='text-sm' colorName='textGrey'>{item.address.city}, {item.address.state}</ThemedText>
                </StyledView>
                {isSelected && (
                    <StyledView className="flex-row items-center">
                        <ThemedText type='text-sm' colorName='selected'>{t('salon.mySalonsScreen.selected')}</ThemedText>
                        <ThemedIcon iconType='ant' name='check' colorName='iconSelected' size={20} />
                    </StyledView>
                )}
            </StyledTouchableOpacity>
        );
    }, [defaultSalonId, handleSalonSelected, t]);

    if (isSalonsLoading) {
        return <StyledActivityIndicator size="large" color="#0000ff" />;
    }

    if (salonsError) {
        return <ThemedText type='text-lg' colorName='errorText'>Error: {salonsError.message}</ThemedText>;
    }

    return (
        <ThemedScreen
            headerTitle={t('salon.mySalonsScreen.mySalons')}
            showHeaderNavButton={true}
            showHeaderNavOptionButton={true}
            onHeaderNavBackPress={handleBackPressed}
            onHeaderNavOptionsPress={handleMenuButtonSelected}
        >
            <FlatList
                data={salons}
                renderItem={renderSalonListItem}
                keyExtractor={item => item._id}
                refreshControl={<RefreshControl refreshing={isSalonsLoading} onRefresh={refetchSalons} />}
                style={{ paddingHorizontal: 8 }}
            />
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

export default MySalonsScreen;
