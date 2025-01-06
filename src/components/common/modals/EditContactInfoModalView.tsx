import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import RNPickerSelect from 'react-native-picker-select';
import { countryCodes } from '@/utils/countryCodes';
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextInput from "@/components/themed/ThemedTextInput";
import ThemedButton from "@/components/themed/ThemedButton";
import { validateCountryCode, validateEmail, validateMobileNumber, validateString } from "@/utils/validationHelpers";
import { Owner } from "@/types";
import { useEditOwner } from "@/hooks/ownerHooks/useEditOwner";
import { useTranslation } from 'react-i18next';
import { useValidationManager } from "@/utils/validationManager";

interface EditContactInfoModalProps {
    visible: boolean;
    onClose: () => void;
    owner?: Owner;
    ownerId: string | null;
}

const StyledView = styled(View);

const EditContactInfoModalView: React.FC<EditContactInfoModalProps> = ({
                                                                       visible,
                                                                       onClose,
                                                                       owner,
                                                                       ownerId,
                                                                       ...rest
                                                                   }) => {
    const { t } = useTranslation();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [countryCode, setCountryCode] = useState<string>('');

    const editOwnerMutation = useEditOwner(ownerId);

    const { errors, handleBlur, validateAllFields, configureValidation, resetErrors } = useValidationManager();

    const validationConfig = useMemo(() => ({
        firstName: {
            validate: validateString,
            errorMessage: t('common.errors.firstName'),
        },
        lastName: {
            validate: validateString,
            errorMessage: t('common.errors.lastName'),
        },
        email: {
            validate: validateEmail,
            errorMessage: t('common.errors.email'),
        },
        phone: {
            validate: validateMobileNumber,
            errorMessage: t('common.errors.phone'),
        },
        countryCode: {
            validate: validateCountryCode,
            errorMessage: t('common.errors.countryCode'),
        }
    }), [t]);

    const ownerMutationStatus = useMemo(
        () => editOwnerMutation.status,
        [editOwnerMutation.status]
    );

    useEffect(() => {
        configureValidation(validationConfig);
    }, [validationConfig]);

    useEffect(() => {
        if (visible) {
            if (owner) {
                setFirstName(owner.firstName);
                setLastName(owner.lastName);
                setEmail(owner.email);
                setPhone(owner.phone);
                setCountryCode(owner.countryCode);
            } else {
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhone('');
                setCountryCode('');
            }
            resetErrors();
        }
    }, [visible, owner]);

    const ownerData = useMemo(() => ({
        ...owner,
        firstName,
        lastName,
        email,
        phone,
        countryCode,
    }), [owner, firstName, lastName, email, phone, countryCode]);

    const handleSaveOwner = useCallback(() => {
        const formData = { firstName, lastName, email, phone, countryCode };

        if (validateAllFields(formData)) {
            editOwnerMutation.mutate(ownerData, {
                onSuccess: () => {
                    onClose();
                },
                onError: (error) => {
                    console.error(error);
                },
            });
        }
    }, [validateAllFields, ownerData, editOwnerMutation, onClose]);

    return (
        <StyledView className='px-2 pb-5' {...rest}>
            <ThemedText type='title-2x'>{t('owner.editContactInfoModal.editContactInfo')}</ThemedText>
            <ThemedText type='label' colorName='accent'>{t('common.contactInfo.firstName')}</ThemedText>
            <ThemedTextInput
                value={firstName}
                placeholder={t('owner.editContactInfoModal.firstNamePlaceholder')}
                onChangeText={setFirstName}
                onBlur={() => handleBlur('firstName', firstName)}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.firstName}>{errors.firstName}</ThemedText>
            <ThemedText type='label' colorName='accent'>{t('common.contactInfo.lastName')}</ThemedText>
            <ThemedTextInput
                value={lastName}
                placeholder={t('owner.editContactInfoModal.lastNamePlaceholder')}
                onChangeText={setLastName}
                onBlur={() => handleBlur('lastName', lastName)}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.lastName}>{errors.lastName}</ThemedText>
            <ThemedText type='label' colorName='accent'>{t('common.contactInfo.email')}</ThemedText>
            <ThemedTextInput
                value={email}
                placeholder={t('owner.editContactInfoModal.emailPlaceholder')}
                onChangeText={setEmail}
                onBlur={() => handleBlur('email', email)}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.email}>{errors.email}</ThemedText>
            <ThemedText type='label' colorName='accent'>{t('common.contactInfo.mobile')}</ThemedText>
            <StyledView className="flex-row items-center mb-2">
                <RNPickerSelect
                    onValueChange={(value) => setCountryCode(value)}
                    items={countryCodes.map((country) => ({
                        label: `${country.dialCode} (${country.name})`,
                        value: country.dialCode,
                    }))}
                    style={{
                        inputIOS: { width: 120, height: 50 },
                        inputAndroid: { width: 120, height: 50 },
                    }}
                    value={countryCode}
                />
                <ThemedTextInput
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholder={t('owner.editContactInfoModal.mobilePlaceholder')}
                    onBlur={() => handleBlur('phone', phone)}
                />
            </StyledView>
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.countryCode}>{errors.countryCode}</ThemedText>
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.phone}>{errors.phone}</ThemedText>
            <StyledView className="flex-row justify-between mt-4">
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
                    handleOnPress={handleSaveOwner}
                    status={ownerMutationStatus}
                />
            </StyledView>
        </StyledView>
    );
};

export default React.memo(EditContactInfoModalView);
