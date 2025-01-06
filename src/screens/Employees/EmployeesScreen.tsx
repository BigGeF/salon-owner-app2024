import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
    View,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { styled } from 'nativewind';
import { Employee } from '@/types';
import { useEmployeesContext, EmployeesProvider } from '@/context/EmployeesContext';
import ThemedText from "@/components/themed/ThemedText";
import ThemedScreen from "@/components/themed/ThemedScreen";
import { useTranslation } from 'react-i18next';
import OptionModalView from "@/components/common/modals/OptionModalView";
import AddEditEmployeeModalView from "@/components/common/modals/AddEditEmployeeModalView";
import ThemedDynamicModal from "@/components/themed/ThemedDynamicModal";

const StyledView = styled(View);
const Container = styled(View, 'flex-1');
const EmployeeItem = styled(TouchableOpacity, 'p-4 border-b border-gray-300 bg-white mb-2 rounded-lg shadow flex-row items-center');
const EmployeeText = styled(ThemedText, 'text-lg ml-4');
const Avatar = styled(View, 'w-10 h-10 bg-gray-300 rounded-full justify-center items-center');
const AvatarText = styled(ThemedText, 'text-lg text-white font-bold');
const AvatarImage = styled(Image, 'w-10 h-10 rounded-full');

const EmployeesScreen: React.FC = () => {
    const { t } = useTranslation();
    const params = useLocalSearchParams();
    const salonId = params.id as string;
    const { employees, refetch, isLoading, isError, error, setSalonId } = useEmployeesContext();

    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentModalView, setCurrentModalView] = useState('editSalonOption');

    useEffect(() => {
        setSalonId(salonId);
    }, [salonId]);

    // Memoize the function to handle opening of the modal for adding/editing employees
    const openEditEmployeeModal = useCallback((employee: Employee) => {
        setSelectedEmployee(employee);
        setCurrentModalView('addEditEmployee');
        setIsModalVisible(true);
    }, []);

    // Memoize the function to handle closing the modal
    const handleCloseModal = useCallback(() => {
        setSelectedEmployee(null);
        setIsModalVisible(false);
    }, []);

    // Memoize the function to handle pressing the options button
    const handleOptionPress = useCallback(() => {
        setCurrentModalView('addEmployeeOption');
        setIsModalVisible(true);
    }, []);

    // Memoize modal views to avoid recalculating on every render
    const modalViews = useMemo(() => [
        {
            key: "addEmployeeOption",
            component: (
                <OptionModalView
                    onClose={handleCloseModal}
                    option1Text={t('employee.addEditEmployeesScreen.addEmployee')}
                    option2Text={t('common.cancel')}
                    onOption1Press={() => {
                        setCurrentModalView('addEditEmployee');
                    }}
                    onOption2Press={handleCloseModal}
                />
            )
        },
        {
            key: "addEditEmployee",
            component: (
                <AddEditEmployeeModalView
                    visible={currentModalView === 'addEditEmployee'}
                    onClose={handleCloseModal}
                    employee={selectedEmployee}
                    refetch={refetch}
                />
            )
        },
    ], [handleCloseModal, currentModalView, selectedEmployee, refetch, t]);

    // Memoize the function to render employees in the FlatList
    const renderEmployeeListItem = useCallback(({ item }: { item: Employee }) => (
        <EmployeeItem
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            }}
            onPress={() => openEditEmployeeModal(item)}
        >
            {item.avatar ? (
                <AvatarImage source={{ uri: item.avatar }} />
            ) : (
                <Avatar>
                    <AvatarText>{item.firstName.charAt(0)}</AvatarText>
                </Avatar>
            )}
            <EmployeeText>{item.firstName} {item.lastName} - {item.role}</EmployeeText>
        </EmployeeItem>
    ), [openEditEmployeeModal]);

    if (isError) {
        return (
            <Container>
                <ThemedText type='title-2x' colorName='errorText'>{error?.message}</ThemedText>
            </Container>
        );
    }

    return (
        <ThemedScreen
            headerTitle={t('employee.addEditEmployeesScreen.employees')}
            showHeaderNavButton={true}
            showHeaderNavOptionButton={true}
            onHeaderNavOptionsPress={handleOptionPress}
        >
            <StyledView className='px-4 pt-10'>
                {/* Display loading indicator in place of FlatList */}
                {isLoading ? (
                    <ActivityIndicator size="large" color="#007bff" />
                ) : (
                    <FlatList<Employee>
                        data={employees}
                        keyExtractor={(employee) => employee._id}
                        renderItem={renderEmployeeListItem}
                    />
                )}
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

export default EmployeesScreen;
