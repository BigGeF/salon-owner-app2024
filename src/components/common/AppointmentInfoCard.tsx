// salon-owner-app/src/components/common/modals/Appointments/AppointmentInfoCard.tsx
import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import { format, parseISO, addMinutes, isBefore } from 'date-fns';
import { Appointment } from '@/types';
import {styled, useColorScheme} from 'nativewind';
import DeleteAppointModal from './modals/Appointments/DeleteAppointModal';
import ThemedText from "@/components/themed/ThemedText"; // 引入删除确认模态

interface AppointmentCardModalProps {
    appointment: Appointment;
    onClick: () => void;
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const AppointmentInfoCard: React.FC<AppointmentCardModalProps> = ({ appointment, onClick }) => {
    const { t } = useTranslation();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const {colorScheme} = useColorScheme();

    const pastColor = colorScheme === 'light' ? 'bg-yellow-100' : 'bg-yellow-500';
    const futureColor = colorScheme === 'light' ? 'bg-green-200' : 'bg-green-500';

    const cardColor = isBefore(parseISO(appointment.appointmentDate), new Date()) ? pastColor : futureColor;

    const calculateEndTime = (startTime: string, duration: number) => {
        if (!startTime || !duration) return '';
        const startDateTime = parseISO(startTime);
        const endTime = addMinutes(startDateTime, duration);
        return format(endTime, 'hh:mm a');
    };

    const handleDelete = () => {
        setDeleteModalVisible(true); // 显示删除确认模态
    };

    return (
        <>
            <StyledTouchableOpacity
                onPress={() => {
                    onClick()
                }}
            >
                <StyledView style={styles.card} className={`p-3 rounded-xl m-1 mb-3 ${cardColor}`}>
                    <View style={styles.header}>
                        <ThemedText type='title-nav'>
                            {(appointment.client?.firstName || t('Walk in'))} {(appointment.client?.lastName || '')}
                        </ThemedText>
                        <TouchableOpacity onPress={handleDelete}>
                            <FontAwesome name="trash" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                    <StyledView  className='mt-2'>
                        <StyledView>
                            <ThemedText>{`${format(parseISO(appointment.appointmentDate), 'hh:mm a')} - ${calculateEndTime(appointment.appointmentDate, appointment.service?.duration)}`}</ThemedText>
                        </StyledView>
                        <StyledView className='flex-row items-center'>
                            <ThemedText className='m-0' type='label' colorName='text'>{t('Artist')}:</ThemedText>
                            <ThemedText className='ml-1' type='text-sm'>{`${appointment.employee?.firstName} ${appointment.employee?.lastName}` }</ThemedText>
                        </StyledView>
                        <StyledView className='flex-row items-center'>
                            <ThemedText className='m-0' type='label' colorName='text'>{t('Service')}:</ThemedText>
                            <ThemedText className='ml-1' type='text-sm'>{appointment.service?.name}</ThemedText>
                        </StyledView>
                        <StyledView className='flex-row items-center'>
                            <ThemedText className='m-0' type='label' colorName='text'>{t('Status')}:</ThemedText>
                            <ThemedText className='ml-1' type='text-sm'>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</ThemedText>
                        </StyledView>
                        <StyledView className='flex-row items-center'>
                            <ThemedText className='m-0' type='label' colorName='text'>{t('Phone')}:</ThemedText>
                            <ThemedText className='ml-1' type='text-sm'>{appointment.client?.phone}</ThemedText>
                        </StyledView>
                    </StyledView>
                </StyledView>
            </StyledTouchableOpacity>

            {/* 删除确认模态 */}
            <DeleteAppointModal
                visible={deleteModalVisible}
                appointmentId={appointment._id} // Pass the appointment ID
                onSuccess={() => {
                    setDeleteModalVisible(false); // Close the modal after success
                }}
                onCancel={() => setDeleteModalVisible(false)} // Close modal on cancel
            />
            
        </>
    );
};

const styles = StyleSheet.create({
    card: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    pastCard: {
        backgroundColor: '#FFF9C4', // Light Yellow
        borderWidth: 1,
        borderColor: '#FFECB3',
    },
    upcomingCard: {
        backgroundColor: '#C8E6C9', // Light Green
        borderWidth: 1,
        borderColor: '#A5D6A7',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    clientName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    details: {
        marginTop: 10,
    }
});

export default memo(AppointmentInfoCard);
