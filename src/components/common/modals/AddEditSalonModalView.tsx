import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { useAddSalon } from '@/hooks/salonHooks/useAddSalon';
import { useEditSalon } from '@/hooks/salonHooks/useEditSalon';
import { Salon } from '@/types';
import { styled } from 'nativewind';
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextInput from "@/components/themed/ThemedTextInput";
import ThemedButton from "@/components/themed/ThemedButton";
import { getCombinedStatus } from "@/utils/statusHelpers";
import { validateString, validateMobileNumber, validateEmail } from '@/utils/validationHelpers';
import { useTranslation } from 'react-i18next';
import { useValidationManager } from "@/utils/validationManager";

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);

interface AddEditSalonModalProps {
    onClose: () => void;
    visible: boolean;
    salon?: Salon;
}

const AddEditSalonModalView: React.FC<AddEditSalonModalProps> = ({
                                                                     onClose,
                                                                     visible,
                                                                     salon,
                                                                 }) => {
    const { t } = useTranslation();
    const [name, setName] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [state, setState] = useState<string>('');
    const [zip, setZip] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const addSalonMutation = useAddSalon();
    const editSalonMutation = useEditSalon();

    const { errors, handleBlur, validateAllFields, configureValidation, resetErrors } = useValidationManager();

    const validationConfig = useMemo(() => ({
        name: {
            validate: validateString,
            errorMessage: t('salon.addEditModal.errors.name'),
        },
        street: {
            validate: validateString,
            errorMessage: t('salon.addEditModal.errors.street'),
        },
        city: {
            validate: validateString,
            errorMessage: t('salon.addEditModal.errors.city'),
        },
        state: {
            validate: validateString,
            errorMessage: t('salon.addEditModal.errors.state'),
        },
        zip: {
            validate: validateString,
            errorMessage: t('salon.addEditModal.errors.zip'),
        },
        phone: {
            validate: validateMobileNumber,
            errorMessage: t('common.errors.phone'),
        },
        email: {
            validate: validateEmail,
            errorMessage: t('common.errors.email'),
        },
    }), [t]);

    // Fetch owner ID and configure validation when component is mounted
    useEffect(() => {
        configureValidation(validationConfig);
    }, [validationConfig]);

    // Reset fields and errors whenever modal becomes visible
    useEffect(() => {
        if (visible) {
            if (salon) {
                console.log(salon)
                setName(salon.name);
                setStreet(salon.address.street);
                setCity(salon.address.city);
                setState(salon.address.state);
                setZip(salon.address.zip);
                setPhone(salon.contact.phone);
                setEmail(salon.contact.email);
            } else {
                setName('');
                setStreet('');
                setCity('');
                setState('');
                setZip('');
                setPhone('');
                setEmail('');
            }
            resetErrors();
        }
    }, [visible, salon]);

    const salonMutationStatus = useMemo(() =>
            getCombinedStatus([addSalonMutation.status, editSalonMutation.status]),
        [addSalonMutation.status, editSalonMutation.status]
    );

    const salonData = useMemo(() => ({
        name,
        address: { street, city, state, zip },
        contact: { phone, email },
    }), [name, street, city, state, zip, phone, email]);

    const handleSaveSalon = useCallback(() => {
        const formData = { name, street, city, state, zip, phone, email };

        if (validateAllFields(formData)) {
            if (salon) {
                editSalonMutation.mutate(
                    { salonId: salon._id, salonData },
                    {
                        onSuccess: onClose,
                        onError: (error) => console.error('Error updating salon:', error),
                    }
                );
            } else {
                addSalonMutation.mutate(
                    { salonData },
                    {
                        onSuccess: onClose,
                        onError: (error) => console.error('Error adding salon:', error),
                    }
                );
            }
        }
    }, [salon, salonData, validateAllFields, onClose, editSalonMutation, addSalonMutation]);

    return (
        <StyledScrollView className='px-2 pb-5'>
            <ThemedText type='title-2x' textAlign='center'>
                {salon ? t('salon.addEditModal.editSalonDetails') : t('salon.addEditModal.addNewSalon')}
            </ThemedText>

            <ThemedText type='label' colorName='accent' className='align-self-start'>{t('salon.addEditModal.name')}</ThemedText>
            <ThemedTextInput
                placeholder={t('salon.addEditModal.namePlaceholder')}
                value={name}
                onChangeText={setName}
                onBlur={() => handleBlur('name', name)}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.name}>{errors.name}</ThemedText>

            <ThemedText type='label' colorName='accent'>{t('common.contactInfo.phone')}</ThemedText>
            <ThemedTextInput
                placeholder={t('salon.addEditModal.phonePlaceholder')}
                value={phone}
                onChangeText={setPhone}
                onBlur={() => handleBlur('phone', phone)}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.phone}>{errors.phone}</ThemedText>

            <ThemedText type='label' colorName='accent'>{t('common.contactInfo.email')}</ThemedText>
            <ThemedTextInput
                placeholder={t('salon.addEditModal.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                onBlur={() => handleBlur('email', email)}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.email}>{errors.email}</ThemedText>

            <ThemedText type='label' colorName='accent'>{t('common.address.street')}</ThemedText>
            <ThemedTextInput
                placeholder={t('salon.addEditModal.streetPlaceholder')}
                value={street}
                onChangeText={setStreet}
                onBlur={() => handleBlur('street', street)}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.street}>{errors.street}</ThemedText>

            <ThemedText type='label' colorName='accent'>{t('common.address.city')}</ThemedText>
            <ThemedTextInput
                placeholder={t('salon.addEditModal.cityPlaceholder')}
                value={city}
                onChangeText={setCity}
                onBlur={() => handleBlur('city', city)}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.city}>{errors.city}</ThemedText>
            <StyledView className='flex-row'>
                <StyledView className='flex-1 pr-2'>
                    <ThemedText type='label' colorName='accent'>{t('common.address.state')}</ThemedText>
                    <ThemedTextInput
                        placeholder={t('salon.addEditModal.statePlaceholder')}
                        value={state}
                        onChangeText={setState}
                        onBlur={() => handleBlur('state', state)}
                    />
                    <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.state}>{errors.state}</ThemedText>
                </StyledView>
                <StyledView className='flex-1 pl-1'>
                    <ThemedText type='label' colorName='accent'>{t('common.address.zip')}</ThemedText>
                    <ThemedTextInput
                        placeholder={t('salon.addEditModal.zipPlaceholder')}
                        value={zip}
                        onChangeText={setZip}
                        onBlur={() => handleBlur('zip', zip)}
                    />
                    <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.zip}>{errors.zip}</ThemedText>
                </StyledView>
            </StyledView>

            {/*<TextInputFloatingLabel
                label={t('salon.addEditModal.name')}
                value={name}
                onChangeText={setName}
                onBlur={() => handleBlur('name', name)}
                hasError={!!errors.name}
                errorMessage={errors.name}
            />
            <TextInputFloatingLabel
                label={t('common.contactInfo.phone')}
                value={phone}
                onChangeText={setPhone}
                onBlur={() => handleBlur('phone', phone)}
                hasError={!!errors.phone}
                errorMessage={errors.phone}
            />
            <TextInputFloatingLabel
                label={t('common.contactInfo.email')}
                value={email}
                onChangeText={setEmail}
                onBlur={() => handleBlur('email', email)}
                hasError={!!errors.email}
                errorMessage={errors.email}
            />
            <TextInputFloatingLabel
                label={t('common.address.street')}
                value={street}
                onChangeText={setStreet}
                onBlur={() => handleBlur('street', street)}
                hasError={!!errors.street}
                errorMessage={errors.street}
            />
            <TextInputFloatingLabel
                label={t('common.address.city')}
                value={city}
                onChangeText={setCity}
                onBlur={() => handleBlur('city', city)}
                hasError={!!errors.city}
                errorMessage={errors.city}
            />
            <StyledView className='flex-row'>
                <StyledView className='flex-1 pr-2'>
                    <TextInputFloatingLabel
                        label={t('common.address.state')}
                        value={state}
                        onChangeText={setState}
                        onBlur={() => handleBlur('state', state)}
                        hasError={!!errors.state}
                        errorMessage={errors.state}
                    />
                </StyledView>
                <StyledView className='flex-1 pl-1'>
                    <TextInputFloatingLabel
                        label={t('common.address.zip')}
                        value={zip}
                        onChangeText={setZip}
                        onBlur={() => handleBlur('zip', zip)}
                        hasError={!!errors.zip}
                        errorMessage={errors.zip}
                    />
                </StyledView>
            </StyledView>*/}

            <StyledView className="border-t-2 border-gray-400 mt-4 mb-4"></StyledView>
            <StyledView className="flex-row justify-between my-4">
                <ThemedButton
                    text={t('common.cancel')}
                    type='cancel'
                    flexWidth='full'
                    textColorName='cancelButtonText'
                    bgColorName='cancelButtonBG'
                    handleOnPress={onClose}
                />
                <ThemedButton
                    text={t('common.save')}
                    type='primary'
                    flexWidth='full'
                    handleOnPress={handleSaveSalon}
                    status={salonMutationStatus}
                />
            </StyledView>
        </StyledScrollView>
    );
};

// Memoize the entire component to avoid unnecessary re-renders
export default React.memo(AddEditSalonModalView);
