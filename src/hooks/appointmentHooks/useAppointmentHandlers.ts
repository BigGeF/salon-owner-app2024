// src/hooks/appointmentHooks/useAppointmentHandlers.ts

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Appointment } from '../../types';
import { useCreateAppointment } from './useCreateAppointment';
import { useUpdateAppointment } from './useUpdateAppointment';
import { useDeleteAppointment } from './useDeleteAppointment';

export interface UseAppointmentHandlersProps {
    appointment: Partial<Appointment>;
    setErrorMessage: (message: string | null) => void;
    setAddModalVisible: (visible: boolean) => void;
}

export const useAppointmentHandlers = ({
    appointment,
    setErrorMessage,
    setAddModalVisible,
}: UseAppointmentHandlersProps) => {
    const { t } = useTranslation();
    const { mutate: createAppointment } = useCreateAppointment();
    const { mutate: updateAppointment } = useUpdateAppointment();
    const { mutate: deleteAppointment } = useDeleteAppointment();
    const handleSaveAppointment = useCallback(() => {
        if (!appointment.tempClient?.firstName?.trim()) {
            setErrorMessage(t('Client first name is required'));
            return;
        }

        if (!appointment.tempClient?.lastName?.trim()) {
            setErrorMessage(t('Client last name is required'));
            return;
        }

        if (!appointment.serviceId) {
            setErrorMessage(t('Service selection is required'));
            return;
        }

        const phone = appointment.tempClient?.phone;
        if (!phone?.trim()) {
            setErrorMessage(t('Phone number is required'));
            return;
        }

        if (!/^\d{10}$/.test(phone.trim())) {
            setErrorMessage(t('Please enter a valid 10-digit phone number'));
            return;
        }

        console.log('Creating appointment FROM useAppointmentHandlers.ts:', appointment); 

        createAppointment(appointment, {
            onSuccess: () => {
                console.log('Appointment created successfully'); 
                setAddModalVisible(false);
                setErrorMessage(null);
            },
            onError: (error: any) => {
                console.error('Failed to create appointment:', error); 
                setErrorMessage(error.message || t('Failed to create appointment'));
            },
        });
    }, [appointment, updateAppointment,createAppointment, setErrorMessage, setAddModalVisible, t]);

    const handleUpdateAppointment = useCallback(() => {
        updateAppointment(appointment, {
            onSuccess: () => {
                console.log('Appointment updated successfully'); 
                setAddModalVisible(false);
                setErrorMessage(null);
            },
            onError: (error: any) => {
                console.error('Failed to update appointment:', error); 
                setErrorMessage(error.message || t('Failed to update appointment'));
            },
        });
    }, [appointment, updateAppointment, setErrorMessage, setAddModalVisible, t]);

    const handleDeleteAppointment = useCallback(() => {
        if (!appointment._id) {
          
            setErrorMessage('Appointment ID is required for delete.');
            return;
        }
    
        deleteAppointment(appointment._id, {
            onSuccess: () => {
                console.log('Appointment deleted successfully');
                setAddModalVisible(false);
                setErrorMessage(null);
            },
            onError: (error: any) => {
                console.error('Failed to delete appointment:', error);
                setErrorMessage(error.message || 'Failed to delete appointment.');
            },
        });
    }, [appointment, deleteAppointment, setAddModalVisible, setErrorMessage]);
    
    return {
        handleSaveAppointment,
        handleUpdateAppointment,
        handleDeleteAppointment,
    };
};

export default useAppointmentHandlers;
