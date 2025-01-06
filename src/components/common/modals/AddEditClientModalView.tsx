import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { useAddClient } from '@/hooks/clientHooks/useAddClient';
import { useClientContext } from '@/context/ClientContext';
import { useDefaultSalonIdContext } from "@/context/DefaultSalonIdContext";
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextInput from "@/components/themed/ThemedTextInput";
import ThemedButton from "@/components/themed/ThemedButton";
import { validateString, validateMobileNumber, validateEmail } from '@/utils/validationHelpers';
import { useTranslation } from 'react-i18next';
import { useValidationManager } from "@/utils/validationManager";
import { Client } from "@/types";
import { useEditClient } from "@/hooks/clientHooks/useEditClient";
import { getCombinedStatus } from "@/utils/statusHelpers";

const StyledView = styled(View);

interface AddNewClientModalProps {
    visible: boolean;
    onClose: () => void;
    client?: Client | null;
    onSave?: (savedClient: Client) => void; 

}

const AddEditClientModalView: React.FC<AddNewClientModalProps> = ({
                                                                      visible,
                                                                      onClose,
                                                                      client,
                                                                      onSave,  

                                                                  }) => {
    const { t } = useTranslation();
    const { defaultSalonId } = useDefaultSalonIdContext();
    const addClientMutation = useAddClient();
    const editClientMutation = useEditClient();

    const { refetchClients } = useClientContext();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const { errors, handleBlur, validateAllFields, configureValidation, resetErrors } = useValidationManager();

    // Memoize the clientMutationStatus to avoid recalculating it on every render
    const clientMutationStatus = useMemo(() => getCombinedStatus([editClientMutation.status, addClientMutation.status]), [editClientMutation, addClientMutation]);

    // Configuration for input validation functions and error messages
    const validationConfig = useMemo(() => ({
        firstName: {
            validate: validateString,
            errorMessage: t('common.errors.firstName'),
        },
        lastName: {
            validate: (value: string) => value === '' || validateString(value),
            errorMessage: t('common.errors.lastName'),
        },
        email: {
            validate: (value: string) => value === '' || validateEmail(value),
            errorMessage: t('common.errors.email'),
        },
        phone: {
            validate: validateMobileNumber,
            errorMessage: t('common.errors.phone'),
        },
    }), [t]);

    useEffect(() => {
        configureValidation(validationConfig);
    }, [validationConfig]);

    // Reset fields whenever the modal becomes visible
    useEffect(() => {
        if (visible) {
            if (client) {
                setFirstName(client.firstName || '');
                setLastName(client.lastName || '');
                setEmail(client.email || '');
                setPhone(client.phone || '');
            } else {
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhone('');
            }
            resetErrors();
        }
    }, [visible, client]);



    const handleSave = useCallback(() => {
        if (!defaultSalonId) {
            throw new Error(t('client.addEditClient.errors.noSalonId'));
        }

        const formData = { firstName, lastName, email, phone };

        if (validateAllFields(formData)) {
            const clientData = { firstName, lastName, email, phone };

            if (client) {
                editClientMutation.mutate(
                    {
                        salonId: defaultSalonId,
                        clientId: client._id,
                        clientData,
                    },
                    {
                        onSuccess: (savedClient: Client) => {
                            refetchClients(); // Refresh the client list
                            onSave?.(savedClient); 
                            onClose();
                        },
                        onError: (error) => {
                            console.error('Error editing client:', error);
                        },
                    }
                );
            } else {
                addClientMutation.mutate(
                    {
                        salonId: defaultSalonId,
                        clientData,
                    },
                    {
                        onSuccess: (savedClient: Client) => {
                            refetchClients(); // Refresh the client list
                            onSave?.(savedClient); 
                            onClose();
                        },
                        onError: (error) => {
                            console.error('Error adding client:', error);
                        },
                    }
                );
            }
        }
    }, [defaultSalonId, firstName, lastName, email, phone, client, validateAllFields, refetchClients,onSave, onClose, t, addClientMutation, editClientMutation]);

    return (
        <StyledView className='px-2 pb-5'>
            <ThemedText type='title-2x'>{client ? t('client.addEditClientModalView.editClient') : t('client.addEditClientModalView.addNewClient')}</ThemedText>

            <ThemedText type='label' colorName='label'>{t('common.contactInfo.firstName')}*</ThemedText>
            <ThemedTextInput
                placeholder={t('client.addEditClientModalView.firstNamePlaceholder')}
                value={firstName}
                onChangeText={setFirstName}
                onBlur={() => handleBlur('firstName', firstName)}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.firstName}>{errors.firstName}</ThemedText>

            <ThemedText type='label' colorName='label'>{t('common.contactInfo.lastName')}</ThemedText>
            <ThemedTextInput
                placeholder={t('client.addEditClientModalView.lastNamePlaceholder')}
                value={lastName}
                onChangeText={setLastName}
                onBlur={() => handleBlur('lastName', lastName)}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.lastName}>{errors.lastName}</ThemedText>

            <ThemedText type='label' colorName='label'>{t('common.contactInfo.phone')}*</ThemedText>
            <ThemedTextInput
                placeholder={t('client.addEditClientModalView.phonePlaceholder')}
                value={phone}
                onChangeText={setPhone}
                onBlur={() => handleBlur('phone', phone)}
                keyboardType="phone-pad"
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.phone}>{errors.phone}</ThemedText>

            <ThemedText type='label' colorName='label'>{t('common.contactInfo.email')}</ThemedText>
            <ThemedTextInput
                placeholder={t('client.addEditClientModalView.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                onBlur={() => handleBlur('email', email)}
                keyboardType="email-address"
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.email}>{errors.email}</ThemedText>

            <StyledView className="flex-row justify-between mt-8">
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
                    handleOnPress={handleSave}
                    status={clientMutationStatus}
                />
            </StyledView>
        </StyledView>
    );
};

// Export as memoized component
export default React.memo(AddEditClientModalView);
