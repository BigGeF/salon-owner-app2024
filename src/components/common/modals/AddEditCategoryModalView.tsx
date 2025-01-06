import React, {useCallback, useEffect, useMemo} from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextInput from "@/components/themed/ThemedTextInput";
import ThemedButton from "@/components/themed/ThemedButton";
import { MutationStatus } from "@tanstack/react-query";
import {validateString} from '@/utils/validationHelpers';
import { useTranslation } from 'react-i18next';
import {useValidationManager} from "@/utils/validationManager";

interface AddEditCategoryModalViewProps {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    categoryName: string;
    setCategoryName: (name: string) => void;
    isEditing: boolean;
    categoryStatus?: MutationStatus;
}

const StyledView = styled(View);

const AddEditCategoryModalView: React.FC<AddEditCategoryModalViewProps> = ({
                                                         visible,
                                                         onClose,
                                                         onSave,
                                                         categoryName,
                                                         setCategoryName,
                                                         isEditing,
                                                         categoryStatus = 'idle'
                                                     }) => {
    const { t } = useTranslation();
    const { errors, handleBlur, validateAllFields, configureValidation, resetErrors  } = useValidationManager();

    // Configuration for input validation functions and error messages
    const validationConfig = useMemo(() => ({
        categoryName: {
            validate: (value: string) => validateString(value),
            errorMessage: t('category.addEditModal.errors.name'),
        }
    }), [t]);

    useEffect(() => {
        configureValidation(validationConfig);
    }, [validationConfig]);

    useEffect(() => {
        if (visible){
            resetErrors();
        }
    }, [visible, resetErrors]);

    const handleSave = useCallback(() => {
        const formData = { categoryName };

        if (validateAllFields(formData)) {
            onSave();
        }
    }, [categoryName, validateAllFields, onSave]);

    return (
        <StyledView className='px-2 pb-5'>
            <ThemedText type='title-2x'>{isEditing ? t('category.addEditModal.editCategory') : t('category.addEditModal.addCategory')}</ThemedText>
            <ThemedText type='label' colorName='accent'>{t('category.addEditModal.categoryName')}</ThemedText>
            <ThemedTextInput
                placeholder={t('category.addEditModal.namePlaceholder')}
                value={categoryName}
                onChangeText={setCategoryName}
                onBlur={() => handleBlur('categoryName', categoryName)}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.categoryName}>
                {errors.categoryName}
            </ThemedText>
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
                    text={isEditing ? t('common.save') : t('common.add')}
                    type='primary'
                    flexWidth='full'
                    status={categoryStatus}
                    handleOnPress={handleSave}
                />
            </StyledView>
        </StyledView>
    );
};

export default React.memo(AddEditCategoryModalView);
