// src/components/common/modals/Appointments/DeleteAppointModal.tsx

import React, { memo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppointmentHandlers } from '../../../../hooks/appointmentHooks/useAppointmentHandlers';

interface DeleteAppointModalProps {
    visible: boolean;
    appointmentId: string | undefined;
    onSuccess?: () => void; 
    onCancel: () => void;
}

const DeleteAppointModal: React.FC<DeleteAppointModalProps> = ({
    visible,
    appointmentId,
    onSuccess,
    onCancel,
}) => {
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const appointment = {
        _id: appointmentId,
    }

    const { handleDeleteAppointment } = useAppointmentHandlers({
        appointment,
        setErrorMessage: setErrorMessage, 
        setAddModalVisible: onCancel, 
    })

    const handleDelete = () => {
        handleDeleteAppointment();
        if (onSuccess) {
            onSuccess(); 
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{t('Confirm Deletion')}</Text>

                    {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.buttonText}>{t('Cancel')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <Text style={styles.buttonText}>{t('Delete')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: '#ff5c5c',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default memo(DeleteAppointModal);