import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { useDefaultSalonIdContext } from "@/context/DefaultSalonIdContext";
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextInput from "@/components/themed/ThemedTextInput";
import ThemedButton from "@/components/themed/ThemedButton";
import { validateString } from '@/utils/validationHelpers';
import { useTranslation } from 'react-i18next';
import { useValidationManager } from "@/utils/validationManager";
import { Employee } from "@/types";
import { MutationStatus } from "@tanstack/react-query";
import { getCombinedStatus } from "@/utils/statusHelpers";
import { useEditEmployee } from "@/hooks/employeeHooks/useEditEmployee";
import { useCreateEmployee } from "@/hooks/employeeHooks/useCreateEmployee";
import { useDeleteEmployee } from "@/hooks/employeeHooks/useDeleteEmployee";

const StyledView = styled(View);

interface AddEditEmployeeModalProps {
    visible: boolean;
    onClose: () => void;
    refetch: () => void;
    employee?: Employee | null;
}

const AddEditEmployeeModalView: React.FC<AddEditEmployeeModalProps> = ({
                                                                         visible,
                                                                         onClose,
                                                                         refetch,
                                                                         employee,
                                                                     }) => {
    const { t } = useTranslation();
    const { defaultSalonId } = useDefaultSalonIdContext();

    const { handleCreateEmployee, status: createStatus } = useCreateEmployee();
    const editEmployeeMutation = useEditEmployee();
    const { useHandleDeleteEmployee, status: deleteStatus } = useDeleteEmployee();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');

    const { errors, handleBlur, validateAllFields, configureValidation, resetErrors } = useValidationManager();

    const employeeStatus = useMemo(() => getCombinedStatus([createStatus, editEmployeeMutation.status]), [createStatus, editEmployeeMutation.status]);

    // Configuration for input validation functions and error messages
    const validationConfig = useMemo(() => ({
        firstName: {
            validate: validateString,
            errorMessage: t('common.errors.firstName'),
        },
        lastName: {
            validate: validateString,
            errorMessage: t('common.errors.lastName'),
        },
        role: {
            validate: validateString,
            errorMessage: t('employee.addEditEmployeesScreen.errors.role'),
        },
    }), [t]);

    useEffect(() => {
        configureValidation(validationConfig);
    }, [validationConfig]);

    // Reset fields whenever the modal becomes visible
    useEffect(() => {
        if (visible) {
            if (employee) {
                setFirstName(employee.firstName || '');
                setLastName(employee.lastName || '');
                setRole(employee.role || '');
            } else {
                setFirstName('');
                setLastName('');
                setRole('');
            }
            resetErrors();
        }
    }, [visible, employee]);

    const handleSaveEmployee = useCallback(async () => {
        const formData = { firstName, lastName, role };

        if (validateAllFields(formData) && defaultSalonId) {
            const employeeData: Partial<Employee> = {
                firstName,
                lastName,
                role,
            };

            if (employee) {
                // Save Edited Employee
                try {
                    editEmployeeMutation.mutate({ _id: employee._id, ...employeeData }, {
                        onSuccess: () => {
                            onClose();
                            refetch(); // Refresh the employee list
                        },
                    });
                } catch (err) {
                    console.error(err);
                }
            } else {
                // Save new employee
                try {
                    await handleCreateEmployee(defaultSalonId, employeeData);
                    onClose();
                    refetch(); // Trigger refetch to update employees list
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }, [firstName, lastName, role, employee, defaultSalonId, validateAllFields, onClose, refetch, handleCreateEmployee, editEmployeeMutation]);

    // Memoized handleDeleteEmployeeAction
    const handleDeleteEmployeeAction = useCallback(async () => {
        if (employee) {
            try {
                await useHandleDeleteEmployee(employee._id);
                onClose();
                refetch(); // Refresh the employee list
            } catch (err) {
                console.error(err);
            }
        }
    }, [employee, useHandleDeleteEmployee, onClose, refetch]);

    return (
        <StyledView className='px-2 pb-5'>
            <ThemedText type='title-2x' textAlign='center'>
                {employee ? t('employee.addEditEmployeesScreen.editEmployee') : t('employee.addEditEmployeesScreen.addNewEmployee')}
            </ThemedText>

            <ThemedText type='label' colorName='accent'>{t('common.contactInfo.firstName')}*</ThemedText>
            <ThemedTextInput
                placeholder={t('employee.addEditEmployeesScreen.firstNamePlaceholder')}
                value={firstName}
                onChangeText={setFirstName}
                onBlur={() => handleBlur('firstName', firstName)}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.firstName}>{errors.firstName}</ThemedText>

            <ThemedText type='label' colorName='accent'>{t('common.contactInfo.lastName')}*</ThemedText>
            <ThemedTextInput
                placeholder={t('employee.addEditEmployeesScreen.lastNamePlaceholder')}
                value={lastName}
                onChangeText={setLastName}
                onBlur={() => handleBlur('lastName', lastName)}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.lastName}>{errors.lastName}</ThemedText>

            <ThemedText type='label' colorName='accent'>{t('employee.addEditEmployeesScreen.role')}*</ThemedText>
            <ThemedTextInput
                placeholder={t('employee.addEditEmployeesScreen.rolePlaceholder')}
                value={role}
                onChangeText={setRole}
                onBlur={() => handleBlur('role', role)}
            />
            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.role}>{errors.role}</ThemedText>

            <StyledView className="flex-row justify-around mt-4">
                <ThemedButton
                    text={t('common.cancel')}
                    type='cancel'
                    flexWidth='full'
                    textColorName='cancelButtonText'
                    bgColorName='cancelButtonBG'
                    handleOnPress={onClose}
                />
                {employee && (
                    <ThemedButton
                        text={t('common.delete')}
                        flexWidth='full'
                        textColorName='deleteButtonText'
                        bgColorName='deleteButtonBG'
                        handleOnPress={handleDeleteEmployeeAction}
                        status={deleteStatus}
                    />
                )}
                <ThemedButton
                    text={employee ? t('common.save') : t('common.add')}
                    type='primary'
                    flexWidth='full'
                    handleOnPress={handleSaveEmployee}
                    status={employeeStatus}
                />
            </StyledView>
        </StyledView>
    );
};

// Export memoized component
export default React.memo(AddEditEmployeeModalView);
