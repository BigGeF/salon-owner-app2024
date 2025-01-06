import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Image, View } from 'react-native';
import { styled } from 'nativewind';
import { useOwnerQuery } from '@/hooks/ownerHooks/useOwnerQuery';
import ThemedText from "@/components/themed/ThemedText";
import ThemedScreen from "@/components/themed/ThemedScreen";
import { useTranslation } from 'react-i18next';
import ThemedDynamicModal from "@/components/themed/ThemedDynamicModal";
import OwnerProfileOptionModalView from "@/components/common/modals/OwnerProfileOptionModalView";
import EditContactInfoModalView from "@/components/common/modals/EditContactInfoModalView";
import ChangePasswordModalView from "@/components/common/modals/ChangePasswordModalView";
import { useAuth } from '@/context/AuthContext';
// import {useOwnerIdContext} from "@/context/OwnerIdContext";

const StyledView = styled(View);
const StyledImage = styled(Image);

const OwnerProfileScreen: React.FC = () => {
    const { t } = useTranslation();
    const {owner} = useAuth();
    console.log("Owner profile screen", owner);
    
    // const { data: owner } = useOwnerQuery(ownerId);
    const ownerId = owner?._id || ""
    const [email, setEmail] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [countryCode, setCountryCode] = useState<string>('');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentModalView, setCurrentModalView] = useState('ownerProfileOption');

    useEffect(() => {
        if (owner) {
            setEmail(owner.email);
            setFirstName(owner.firstName);
            setLastName(owner.lastName);
            setPhone(owner.phone);
            setCountryCode(owner.countryCode);
        }
    }, [owner]);

    // Memoize the obfuscation functions
    const obfuscateEmail = useCallback((email: string): string => {
        const [local, domain] = email.split('@');
        const first = local[0];
        const last = local[local.length - 1];
        return `${first}******${last}@${domain}`;
    }, []);

    const obfuscatePhone = useCallback((phone: string): string => {
        const first = phone.slice(0, 1);
        const last = phone.slice(-2);
        return `${first}******${last}`;
    }, []);

    // Memoize the function to handle pressing the options button
    const handleOptionPress = useCallback(() => {
        setCurrentModalView('ownerProfileOption');
        setIsModalVisible(true);
    }, []);

    // Memoize the function to close the modal
    const handleCloseModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    // Memoize modal views to avoid recalculating on every render
    const modalViews = useMemo(() => [
        {
            key: 'ownerProfileOption',
            component: (
                <OwnerProfileOptionModalView
                    onClose={handleCloseModal}
                    onEditContactInfo={() => setCurrentModalView('editContactInfo')}
                    onChangePassword={() => setCurrentModalView('editPassword')}
                />
            ),
        },
        {
            key: 'editContactInfo',
            component: (
                <EditContactInfoModalView
                    visible={currentModalView === 'editContactInfo'}
                    onClose={handleCloseModal}
                    owner={owner ?? undefined}
                    ownerId={ownerId}
                />
            )
        },
        {
            key: 'editPassword',
            component: (
                <ChangePasswordModalView
                    visible={currentModalView === 'editPassword'}
                    onClose={handleCloseModal}
                    ownerId={ownerId}
                />
            )
        }
    ], [handleCloseModal, currentModalView, owner]);

    return (
        <ThemedScreen
            headerTitle={t('common.profile')}
            showHeaderNavButton={true}
            showHeaderNavOptionButton={true}
            onHeaderNavOptionsPress={handleOptionPress}
        >
            <StyledView className="items-center m-5 mt-8">
                <StyledImage
                    source={{ uri: 'https://via.placeholder.com/150' }}
                    className="w-24 h-24 rounded-full"
                />
            </StyledView>
            <ThemedText type='title-2x' textAlign='center'>{`${firstName} ${lastName}`}</ThemedText>
            <StyledView className="border-b border-gray-300 my-6" />
            <StyledView className="mb-4">
                <ThemedText type='label' colorName='accent'>{t('common.contactInfo.email')}</ThemedText>
                <ThemedText>{obfuscateEmail(email)}</ThemedText>
            </StyledView>
            <StyledView className="mb-4">
                <ThemedText type='label' colorName='accent'>{t('common.contactInfo.mobile')}</ThemedText>
                <ThemedText>{`${countryCode} ${obfuscatePhone(phone)}`}</ThemedText>
            </StyledView>
            <StyledView className="border-b border-gray-300 my-6" />
            <StyledView className="mb-4">
                <ThemedText type='label' colorName='accent'>{t('common.password.password')}</ThemedText>
                <ThemedText>********</ThemedText>
            </StyledView>

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

export default OwnerProfileScreen;
