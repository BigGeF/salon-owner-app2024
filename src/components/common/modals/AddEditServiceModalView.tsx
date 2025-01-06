import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    View,
    ScrollView,
    TextStyle,
    StyleSheet,
    type ModalProps
} from 'react-native';
import { Service, ServiceAndCat, Category } from '@/types';
import { useEditService } from '@/hooks/serviceHooks/useEditService';
import { useAddService } from '@/hooks/serviceHooks/useAddService';
import { styled } from 'nativewind';
import { useServiceContext } from "@/context/ServicesContext";
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextInput from "@/components/themed/ThemedTextInput";
import ThemedButton from "@/components/themed/ThemedButton";
import { MutationStatus } from "@tanstack/react-query";
import { getCombinedStatus } from "@/utils/statusHelpers";
import ThemedPickerSelect from "@/components/themed/ThemedPickerSelect";
import { validateString } from "@/utils/validationHelpers";
import { useTranslation } from 'react-i18next';
import { useValidationManager } from "@/utils/validationManager";
import { formatDuration } from '@/utils/timeUtils';

interface ServiceDetailModalProps extends ModalProps {
    visible: boolean;
    onClose: () => void;
    service?: ServiceAndCat | null;
    categories: Category[];
    salonId: string;
}

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);

const AddEditServiceModalView: React.FC<ServiceDetailModalProps> = ({
                                                                    visible,
                                                                    onClose,
                                                                    service,
                                                                    categories,
                                                                    salonId,
                                                                }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState(0);
    const [price, setPrice] = useState('');

    const { services, refetchServices } = useServiceContext();
    const addServiceMutation = useAddService();
    const editServiceMutation = useEditService();

    const { errors, handleBlur, validateAllFields, configureValidation, resetErrors } = useValidationManager();

    const serviceMutationStatus = useMemo(() =>
            getCombinedStatus([addServiceMutation.status, editServiceMutation.status]),
        [addServiceMutation.status, editServiceMutation.status]
    );

    const validationConfig = useMemo(() => ({
        name: {
            validate: (value: string) => validateString(value),
            errorMessage: t('service.addEditModal.errors.name'),
        },
        category: {
            validate: (value: string) => value !== ''&& value!== undefined,
            errorMessage: t('service.addEditModal.errors.category'),
        },
        description: {
            validate: () => true,
            errorMessage: '',
        },
        duration: {
            validate: (value: number) => value > 0,
            errorMessage: t('service.addEditModal.errors.duration'),
        },
        price: {
            validate: (value: string) => validateString(value, 1),
            errorMessage: t('service.addEditModal.errors.price'),
        }
    }), [t]);

    useEffect(() => {
        configureValidation(validationConfig);
    }, [validationConfig]);

    useEffect(() => {
        if (visible) {
            if (service) {
                setName(service.name);
                setCategory(service.categoryId._id);
                setDescription(service.description);
                setDuration(service.duration);
                setPrice(service.price.toString());
            } else {
                setName('');
                setCategory('');
                setDescription('');
                setDuration(0);
                setPrice('');
            }
            resetErrors();
        }
    }, [visible, service]);


    const getAppointmentTimes = useMemo(() => {
        return Array.from({ length: 48 }, (_, i) => (i + 1) * 5).map((value) => ({
            label: formatDuration(value),
            value,
            style: { backgroundColor: '#000' }
        }));
    }, [formatDuration]);

    const handleSaveService = useCallback(async () => {
        const formData = { name, category, description, duration, price };

        if (validateAllFields(formData)) {
            const serviceData: Partial<Service> = {
                name,
                categoryId: category,
                description,
                duration,
                price: parseFloat(price),
            };

            if (service) {
                editServiceMutation.mutate(
                    { salonId: service.salonId, serviceId: service._id, serviceData },
                    {
                        onSuccess: () => {
                            refetchServices();
                            console.log('Success editing service');
                            onClose();
                        },
                        onError: (error) => {
                            console.error('Error updating service:', error);
                        },
                    }
                );
            } else {
                addServiceMutation.mutate(
                    { salonId, serviceData },
                    {
                        onSuccess: () => {
                            refetchServices();
                            console.log('Success adding service');
                            onClose();
                        },
                        onError: (error) => {
                            console.error('Error adding service:', error);
                        },
                    }
                );
            }
        }
    }, [name, category, description, duration, price, validateAllFields, service, salonId, editServiceMutation, addServiceMutation, refetchServices, onClose]);

    return (
        <StyledScrollView className='px-2 pb-5'>
            <ThemedText type='title-2x'>
                {service ? t('service.addEditModal.editService') : t('service.addEditModal.addService')}
            </ThemedText>
            <ThemedText type='label' colorName='accent'>{t('service.addEditModal.name')}*</ThemedText>
            <ThemedTextInput
                value={name}
                placeholder={t('service.addEditModal.namePlaceholder')}
                onChangeText={setName}
                onBlur={() => handleBlur('name', name)}
                hasError={!!errors.name}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.name}>{errors.name}</ThemedText>

            <ThemedText type='label' colorName='accent'>{t('service.addEditModal.category')}*</ThemedText>
            <ThemedPickerSelect
                value={category}
                placeholderText={t('service.addEditModal.categoryPlaceholder')}
                onValueChange={setCategory}
                items={categories.map(cat => ({ label: cat.name, value: cat._id }))}
                onClose={() => handleBlur('category', category)}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.category}>{errors.category}</ThemedText>

            <ThemedText type='label' colorName='accent'>{t('service.addEditModal.description')}</ThemedText>
            <ThemedTextInput
                type='multi'
                value={description}
                placeholder={t('service.addEditModal.descriptionPlaceholder')}
                onChangeText={setDescription}
                multiline={true}
                maxLength={500}
                style={styles.textInput}
                hasError={!!errors.description}
                onBlur={() => handleBlur('description', description)}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.description}>{errors.description}</ThemedText>

            <ThemedText type='label' colorName='accent'>{t('service.addEditModal.duration')}*</ThemedText>
            <ThemedPickerSelect
                value={duration}
                placeholderText={t('service.addEditModal.durationPlaceholder')}
                onValueChange={setDuration}
                items={getAppointmentTimes}
                onClose={() => handleBlur('duration', duration)}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.duration}>{errors.duration}</ThemedText>

            <ThemedText type='label' colorName='accent'>{t('service.addEditModal.price')}*</ThemedText>
            <ThemedTextInput
                value={price}
                placeholder={t('service.addEditModal.pricePlaceholder')}
                onChangeText={setPrice}
                keyboardType="numeric"
                onBlur={() => handleBlur('price', price)}
                hasError={!!errors.price}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.price}>{errors.price}</ThemedText>

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
                    handleOnPress={handleSaveService}
                    status={serviceMutationStatus}
                />
            </StyledView>
        </StyledScrollView>
    );
};

export default React.memo(AddEditServiceModalView);

// Needed to make the text for description align to the top instead of the default center
const styles = StyleSheet.create({
    textInput: {
        textAlignVertical: 'top',
    } as TextStyle,
});
