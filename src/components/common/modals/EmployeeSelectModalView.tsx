// EmployeeSelectModalView.tsx
import React from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { useGetEmployeesBySalonId } from '@/hooks/employeeHooks/useGetEmployeesBySalonId';
import {Employee} from '@/types'
import ThemedText from "@/components/themed/ThemedText";
import {useEmployeesContext} from "@/context/EmployeesContext";

interface EmployeeSelectionModalViewProps {
    salonId: string;
    visible: boolean;
    handleEmployeeSelect: (employee: Employee) => void;
}

const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

const EmployeeSelectionModalView: React.FC<EmployeeSelectionModalViewProps> = ({
                                                                           salonId,
                                                                           visible,
                                                                           handleEmployeeSelect
                                                                       }) => {
    const { t } = useTranslation();
    const {employees} = useEmployeesContext();

    return (
        <StyledScrollView className='pb-5' contentContainerStyle={{ flexGrow: 1 }}>
            <ThemedText type='title-2x' textAlign='center'>
                {t('Select an Employee')}
            </ThemedText>

            {employees.map(employee => (
                <StyledTouchableOpacity
                    key={employee._id}
                    className="p-3 border-b border-gray-200 w-full"
                    onPress={() => handleEmployeeSelect(employee)}
                >
                    <ThemedText type='text-lg'>{`${employee.firstName} ${employee.lastName}`}</ThemedText>
                    <ThemedText type='text-sm' colorName='textGrey'>{employee.role}</ThemedText>
                </StyledTouchableOpacity>
            ))}
        </StyledScrollView>
    );
};

export default EmployeeSelectionModalView;
