import React from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { MutationStatus } from "@tanstack/react-query";
import ThemedButton from "@/components/themed/ThemedButton";
import ThemedText from "@/components/themed/ThemedText";
import { useTranslation } from 'react-i18next';

interface DeleteCategoryModalViewProps {
    onClose: () => void;
    categoryStatus: MutationStatus;  // Add status prop to display category deletion status
    onDelete: () => void;
}

const StyledView = styled(View);

const DeleteCategoryModalView: React.FC<DeleteCategoryModalViewProps> = ({
                                                                             onClose,
                                                                             categoryStatus,
                                                                             onDelete,
                                                                         }) => {
    const { t } = useTranslation();

    return (
        <StyledView className='px-2 pb-5'>
            <ThemedText type='title-2x'>{t('category.deleteModal.deleteCategory')}</ThemedText>
            <StyledView className='pt-2 pb-4'>
                <ThemedText>{t('category.deleteModal.deleteCategoryNote')}</ThemedText>
            </StyledView>
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
                    text={t('common.delete')}
                    type='primary'
                    flexWidth='full'
                    handleOnPress={onDelete}
                    status={categoryStatus}
                />
            </StyledView>
        </StyledView>
    );
};

export default React.memo(DeleteCategoryModalView);
