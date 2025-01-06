import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSalonContext } from '@/context/SalonContext';
import { useAppointmentContext } from '@/context/Appointment/AppointmentContext';
import { useServiceContext } from '@/context/ServicesContext';
import { styled } from 'nativewind';
import { useDefaultSalonIdContext } from "@/context/DefaultSalonIdContext";
import SalonMenuCard from '@/components/common/SalonMenuCard';
import ThemedText from "@/components/themed/ThemedText";
import ThemedButton from "@/components/themed/ThemedButton";
import ThemedScreen from "@/components/themed/ThemedScreen";
import { useTranslation } from 'react-i18next';

const StyledView = styled(View);

const SalonHomeScreen: React.FC = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const { salons, isSalonsLoading, salonsError } = useSalonContext();
    const { defaultSalonId, isDefaultSalonIdLoading } = useDefaultSalonIdContext();
    const { setSalonId } = useAppointmentContext();
    const { setSalonIdInServices } = useServiceContext();
    const [loadingSelectedSalon, setLoadingSelectedSalon] = useState<boolean>(false);

    // Memoize selectedSalon to avoid recalculating it on every render
    const selectedSalon = useMemo(() => {
        if (salons && defaultSalonId) {
            return salons.find(salon => salon._id.toString() === defaultSalonId);
        }
        return null;
    }, [defaultSalonId, salons]);

    // Memoize state update callbacks
    const updateSelectedSalon = useCallback(() => {
        if (defaultSalonId && salons && salons.length > 0) {
            setSalonId(defaultSalonId);
            setSalonIdInServices(defaultSalonId);
            setLoadingSelectedSalon(true);
            setLoadingSelectedSalon(false); // Stop loading immediately after setting the state
        }
    }, [defaultSalonId, salons, setSalonId, setSalonIdInServices]);

    useEffect(() => {
        updateSelectedSalon();
    }, [defaultSalonId, salons, updateSelectedSalon]);


    const handleAddSalonPress = useCallback(() => {
        router.push('home/add-edit-salon');
    }, [router]);

    const handleChooseDefaultSalonPress = useCallback(() => {
        router.push('settings/my-salons');
    }, [router]);

    const handleSalonDetailsPress = useCallback(() => {
        router.push(`home/salon-details?id=${defaultSalonId}`);
    }, [router, defaultSalonId]);

    const handleServiceMenuPress = useCallback(() => {
        router.push(`home/service-menu?id=${defaultSalonId}`);
    }, [router, defaultSalonId]);

    const handleEmployeesPress = useCallback(() => {
        router.push(`home/add-edit-employees?id=${defaultSalonId}`);
    }, [router, defaultSalonId]);

    const handleAppointmentsPress = useCallback(() => {
        router.push(`home/appointments/get-appointments?id=${defaultSalonId}`);
    }, [router, defaultSalonId]);

    const handleClientsPress = useCallback(() => {
        router.push(`home/clients?id=${defaultSalonId}`);
    }, [router, defaultSalonId]);

    if (isSalonsLoading || isDefaultSalonIdLoading || loadingSelectedSalon) {
        return (
            <StyledView className="flex-1 justify-center items-center p-5 bg-gray-200">
                <ActivityIndicator size="large" color="#007bff" />
            </StyledView>
        );
    }

    if (salonsError) {
        console.log(salonsError);
        return (
            <StyledView className="flex-1 justify-center items-center p-5 bg-gray-200">
                <ThemedText type='title-2x' colorName='errorText'>{t('salon.salonHomeScreen.errors.loadingDetails')}</ThemedText>
            </StyledView>
        );
    }

    if (salons && salons.length === 0) {
        return (
            <StyledView className="flex-1 justify-center items-center p-5 bg-gray-200">
                <ThemedText type='title-2x' colorName='errorText'>{t('salon.salonHomeScreen.errors.noSalons')}</ThemedText>
                <ThemedButton text={t('salon.salonHomeScreen.addSalon')} handleOnPress={handleAddSalonPress} />
            </StyledView>
        );
    }

    if (!selectedSalon) {
        return (
            <StyledView className="flex-1 justify-center items-center p-5 bg-gray-200">
                <ThemedText type='title-2x' colorName='errorText'>{t('salon.salonHomeScreen.errors.noDefaultSalon')}</ThemedText>
                <ThemedButton text={t('salon.salonHomeScreen.chooseDefaultSalon')} handleOnPress={handleChooseDefaultSalonPress} />
            </StyledView>
        );
    }

    return (
        <ThemedScreen showHeaderNavButton={false} showHeaderNavOptionButton={false}>
            <ThemedText type='title-4x' textAlign='center'>{selectedSalon.name}</ThemedText>
            <StyledView className="h-1 bg-gray-300 mb-5" />

            <StyledView className='flex-1'>
                <StyledView className='flex-row h-[30%]'>
                    <SalonMenuCard
                        addedClassName="mr-2"
                        title={t('salon.salonHomeScreen.salonDetails')}
                        iconName="isv"
                        onPress={handleSalonDetailsPress}
                    />

                    <SalonMenuCard
                        addedClassName="ml-2"
                        title={t('salon.salonHomeScreen.serviceMenu')}
                        iconName="profile"
                        onPress={handleServiceMenuPress}
                    />
                </StyledView>
                <StyledView className='flex-row h-[30%]'>
                    <SalonMenuCard
                        addedClassName="mr-2"
                        title={t('salon.salonHomeScreen.employees')}
                        iconName="idcard"
                        onPress={handleEmployeesPress}
                    />

                    <SalonMenuCard
                        addedClassName="ml-2"
                        title={t('salon.salonHomeScreen.appointments')}
                        iconName="calendar"
                        onPress={handleAppointmentsPress}
                    />
                </StyledView>
                <StyledView className='flex-row h-[30%]'>
                    <SalonMenuCard
                        addedClassName="mr-2"
                        title={t('salon.salonHomeScreen.clients')}
                        iconName="team"
                        onPress={handleClientsPress}
                    />
                    <StyledView className='flex-1 px-5 ml-2' />
                </StyledView>
            </StyledView>
        </ThemedScreen>
    );
};

export default SalonHomeScreen;
