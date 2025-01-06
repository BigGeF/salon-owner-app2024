import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import GroupedServices from '@/components/common/services/GroupedServices';
import { useServiceContext } from '@/context/ServicesContext';
import { useCategoriesContext } from '@/context/CategoriesContext';
import { useAddCategory } from '@/hooks/categoryHooks/useAddCategory';
import { useEditCategory } from '@/hooks/categoryHooks/useEditCategory';
import { useDeleteService } from '@/hooks/serviceHooks/useDeleteService';
import { useDeleteCategory } from '@/hooks/categoryHooks/useDeleteCategory';
import { ServiceAndCat, Category } from '@/types';
import { styled } from 'nativewind';
import ThemedTextInput from "@/components/themed/ThemedTextInput";
import ThemedText from "@/components/themed/ThemedText";
import { MutationStatus } from "@tanstack/react-query";
import CategoryListHorizontal from "@/components/common/services/CategoryListHorizontal";
import { getCombinedStatus } from "@/utils/statusHelpers";
import ThemedScreen from "@/components/themed/ThemedScreen";
import { useTranslation } from 'react-i18next';
import OptionModalView from "@/components/common/modals/OptionModalView";
import ThemedDynamicModal from "@/components/themed/ThemedDynamicModal";
import AddEditServiceModalView from "@/components/common/modals/AddEditServiceModalView";
import AddEditCategoryModalView from "@/components/common/modals/AddEditCategoryModalView";
import DeleteCategoryModalView from "@/components/common/modals/DeleteCategoryModalView";

const StyledView = styled(View);

const ServiceMenuScreen: React.FC = () => {
    const { t } = useTranslation();
    const params = useLocalSearchParams();
    const id = params.id as string;
    const [searchQuery, setSearchQuery] = useState<string>('');

    const { services, refetchServices } = useServiceContext();
    const { categories, refetchCategories } = useCategoriesContext();
    const [selectedCategoryID, setSelectedCategoryID] = useState<string>('all');
    const [groupedServices, setGroupedServices] = useState<{ categoryName: string, categoryId: string, services: ServiceAndCat[] }[]>([]);

    const [selectedService, setSelectedService] = useState<ServiceAndCat | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentModalView, setCurrentModalView] = useState('addServiceOrCatOption');

    const [categoryStatus, setCategoryStatus] = useState<MutationStatus>('idle');

    const addCategoryMutation = useAddCategory();
    const editCategoryMutation = useEditCategory();
    const deleteServiceMutation = useDeleteService();
    const deleteCategoryMutation = useDeleteCategory();

    useEffect(() => {
        setCategoryStatus(getCombinedStatus([addCategoryMutation.status, editCategoryMutation.status]));
    }, [addCategoryMutation, editCategoryMutation]);

    // Memoized grouped services
    const groupedServicesMemo = useMemo(() => {
        const categoriesMap: { [key: string]: Category } = {};

        services.forEach(service => {
            categoriesMap[service.categoryId._id] = {
                _id: service.categoryId._id,
                salonId: service.categoryId.salonId,
                name: service.categoryId.name,
            };
        });

        const uniqueCategories = [{ _id: 'all', salonId: '', name: t('service.serviceMenuScreen.allCategories') }, ...Object.values(categoriesMap)];

        const grouped = uniqueCategories
            .filter(category => selectedCategoryID === 'all' || category._id === selectedCategoryID)
            .map(category => ({
                categoryName: category.name,
                categoryId: category._id,
                services: services.filter(service =>
                    (selectedCategoryID === 'all' || service.categoryId._id === selectedCategoryID) &&
                    service.categoryId._id === category._id &&
                    service.name.toLowerCase().includes(searchQuery.toLowerCase())
                ),
            }))
            .filter(group => group.services.length > 0);

        if (selectedCategoryID !== 'all') {
            categories.forEach(category => {
                const isCategoryInGrouped = grouped.some(group => group.categoryId === category._id);
                if (!isCategoryInGrouped && category._id === selectedCategoryID) {
                    grouped.push({
                        categoryName: category.name,
                        categoryId: category._id,
                        services: []
                    });
                }
            });
        }

        return grouped;
    }, [selectedCategoryID, services, searchQuery, categories, t]);

    const handleServicePress = useCallback((service: ServiceAndCat) => {
        setSelectedService(service);
        setCurrentModalView('editDeleteServiceOption');
        setIsModalVisible(true);
    }, []);

    const handleModalOpen = useCallback(() => {
        setCurrentModalView('addServiceOrCatOption');
        setIsModalVisible(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const handleServiceModalClose = useCallback(() => {
        setIsModalVisible(false);
        setSelectedService(null);
    }, []);

    const handleAddServiceSelected = useCallback(() => {
        setSelectedService(null);
        setCurrentModalView('addEditService');
    }, []);

    const handleEditDeleteServiceClose = useCallback(() => {
        setSelectedService(null);
        setIsModalVisible(false);
    }, []);

    const handleDeleteService = useCallback(() => {
        if (selectedService) {
            deleteServiceMutation.mutate(
                { salonId: id, serviceId: selectedService._id },
                {
                    onSuccess: () => {
                        refetchServices();
                        setIsModalVisible(false);
                    },
                    onError: (error) => {
                        console.error('Error deleting service:', error);
                    },
                }
            );
        }
    }, [selectedService, id, deleteServiceMutation, refetchServices]);

    const handleAddCategorySelected = useCallback(() => {
        setEditingCategoryId(null);
        setNewCategoryName('');
        setCurrentModalView('addEditCategory');
    }, []);

    const handleCategoryModalClose = useCallback(() => {
        setNewCategoryName('');
        setEditingCategoryId(null);
        setIsModalVisible(false);
    }, []);

    const handleEditDeleteCatOptionClose = useCallback(() => {
        setEditingCategoryId(null);
        setIsModalVisible(false);
    }, []);

    const handleDeleteCatOptionSelected = useCallback(() => {
        setCurrentModalView('deleteCategory');
    }, []);

    const handleEditRemoveCategoryModalOpen = useCallback((categoryId: string) => {
        setEditingCategoryId(categoryId);
        setCurrentModalView('editDeleteCategoryOption');
        setIsModalVisible(true);
    }, []);

    const handleEditCategorySelected = useCallback(() => {
        setCurrentModalView('addEditCategory');
        const category = categories.find(cat => cat._id === editingCategoryId);
        if (category) {
            setNewCategoryName(category.name);
        }
    }, [editingCategoryId, categories]);

    const handleSaveCategory = useCallback(() => {
        if (editingCategoryId) {
            editCategoryMutation.mutate(
                {
                    categoryId: editingCategoryId,
                    salonId: id,
                    categoryData: { _id: editingCategoryId, salonId: id, name: newCategoryName },
                },
                {
                    onSuccess: () => {
                        refetchServices();
                        refetchCategories();
                        handleCategoryModalClose();
                    },
                    onError: (error) => {
                        console.error('Error editing category:', error);
                    },
                }
            );
        } else {
            addCategoryMutation.mutate(
                {
                    salonId: id,
                    categoryData: { _id: '', salonId: id, name: newCategoryName },
                },
                {
                    onSuccess: () => {
                        refetchCategories();
                        handleCategoryModalClose();
                    },
                    onError: (error) => {
                        console.error('Error adding category:', error);
                    },
                }
            );
        }
    }, [editingCategoryId, newCategoryName, id, addCategoryMutation, editCategoryMutation, refetchCategories, refetchServices, handleCategoryModalClose]);

    const handleDeleteCategory = useCallback(() => {
        if (editingCategoryId) {
            deleteCategoryMutation.mutate(
                { categoryId: editingCategoryId, salonId: id },
                {
                    onSuccess: () => {
                        refetchCategories();
                        refetchServices();
                        setIsModalVisible(false);
                    },
                    onError: (error) => {
                        console.error('Error deleting category:', error);
                    },
                }
            );
        }
    }, [editingCategoryId, id, deleteCategoryMutation, refetchCategories, refetchServices]);

    const modalViews = useMemo(() => [
        {
            key: 'addServiceOrCatOption',
            component: (
                <OptionModalView
                    onClose={handleModalClose}
                    option1Text={t('service.serviceMenuScreen.addNewService')}
                    option2Text={t('service.serviceMenuScreen.addNewCategory')}
                    onOption1Press={handleAddServiceSelected}
                    onOption2Press={handleAddCategorySelected}
                />
            )
        },
        {
            key: 'editDeleteCategoryOption',
            component: (
                <OptionModalView
                    onClose={handleEditDeleteCatOptionClose}
                    option1Text={t('service.serviceMenuScreen.editCategory')}
                    option2Text={t('service.serviceMenuScreen.deleteCategory')}
                    onOption1Press={handleEditCategorySelected}
                    onOption2Press={handleDeleteCatOptionSelected}
                />
            )
        },
        {
            key: 'editDeleteServiceOption',
            component: (
                <OptionModalView
                    onClose={handleEditDeleteServiceClose}
                    option1Text={t('service.serviceMenuScreen.editService')}
                    option2Text={t('service.serviceMenuScreen.deleteService')}
                    onOption1Press={() => setCurrentModalView('addEditService')}
                    onOption2Press={() => setCurrentModalView('deleteServiceConfirmation')}
                />
            )
        },
        {
            key: 'addEditService',
            component: (
                <AddEditServiceModalView
                    visible={currentModalView === 'addEditService'}
                    onClose={handleServiceModalClose}
                    service={selectedService}
                    categories={categories}
                    salonId={id}
                />
            )
        },
        {
            key: 'addEditCategory',
            component: (
                <AddEditCategoryModalView
                    visible={currentModalView === 'addEditCategory'}
                    onClose={handleCategoryModalClose}
                    onSave={handleSaveCategory}
                    categoryName={newCategoryName}
                    setCategoryName={setNewCategoryName}
                    isEditing={!!editingCategoryId}
                    categoryStatus={categoryStatus}
                />
            )
        },
        {
            key: 'deleteCategory',
            component: (
                <DeleteCategoryModalView
                    onClose={handleModalClose}
                    onDelete={handleDeleteCategory}
                    categoryStatus={deleteCategoryMutation.status}
                />
            )
        },
        {
            key: 'deleteServiceConfirmation',
            component: (
                <OptionModalView
                    onClose={handleModalClose}
                    title={`${t('service.serviceMenuScreen.deleteService')} - ${selectedService?.name}`}
                    option1Text={t('common.delete')}
                    option2Text={t('common.cancel')}
                    onOption1Press={handleDeleteService}
                    onOption2Press={handleModalClose}
                />
            )
        }
    ], [handleModalClose, handleServiceModalClose, handleAddServiceSelected, handleAddCategorySelected, handleEditDeleteServiceClose, handleEditDeleteCatOptionClose, handleEditCategorySelected, handleSaveCategory, handleDeleteCategory, handleDeleteService, selectedService, categories, currentModalView, newCategoryName, editingCategoryId, categoryStatus, deleteCategoryMutation.status, id, t]);

    return (
        <ThemedScreen
            headerTitle={t('service.serviceMenuScreen.serviceMenu')}
            showHeaderNavButton={true}
            showHeaderNavOptionButton={true}
            onHeaderNavOptionsPress={handleModalOpen}
        >
            <ThemedText type='title-2x'>{t('service.serviceMenuScreen.serviceMenu')}</ThemedText>
            <ThemedText>{t('service.serviceMenuScreen.viewManageMessage')}</ThemedText>
            <StyledView className="my-6">
                <ThemedTextInput
                    placeholder={t('service.serviceMenuScreen.searchPlaceholder')}
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                />
            </StyledView>
            <StyledView className="flex-grow-0">
                <CategoryListHorizontal
                    categories={categories}
                    selectedCategoryID={selectedCategoryID}
                    setSelectedCategoryID={setSelectedCategoryID}
                />
            </StyledView>

            <GroupedServices
                groupedServices={groupedServicesMemo}
                onServicePress={handleServicePress}
                onCategoryOptionsPress={handleEditRemoveCategoryModalOpen}
            />

            <ThemedDynamicModal
                type='bottom'
                animationType='slide'
                visible={isModalVisible}
                onClose={handleModalClose}
                views={modalViews}
                currentView={currentModalView}
            />
        </ThemedScreen>
    );
};

export default ServiceMenuScreen;
