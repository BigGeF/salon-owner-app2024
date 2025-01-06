import { Alert } from 'react-native';
import { Appointment } from '@/types';
import { useDeleteAppointment } from '@/hooks/appointmentHooks/useDeleteAppointment';
import { useUpdateAppointment } from '@/hooks/appointmentHooks/useUpdateAppointment';

export const useAppointmentHandlers = () => {
    const { mutate: deleteAppointment } = useDeleteAppointment();
    const { mutate: updateAppointment } = useUpdateAppointment();

    const handleDelete = (appointment: Appointment, closeModal: () => void) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this appointment?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteAppointment(appointment._id, {
                            onSuccess: () => {
                                Alert.alert('Success', 'Appointment deleted successfully.');
                                closeModal();
                            },
                            onError: (error) => {
                                console.error('Failed to delete appointment:', error);
                                Alert.alert('Error', 'Failed to delete the appointment. Please try again.');
                            }
                        });
                    }
                }
            ]
        );
    };

    const handleReschedulePress = (setRescheduleMode: (mode: boolean) => void, setShowDatePicker: (show: boolean) => void) => {
        setRescheduleMode(true);
        setShowDatePicker(true);
    };

    const handleDateChange = (event: any, date: Date | undefined, setShowDatePicker: (show: boolean) => void, setSelectedDate: (date: Date) => void, setShowTimePicker: (show: boolean) => void) => {
        setShowDatePicker(false);
        if (date) {
            setSelectedDate(date);
            setShowTimePicker(true);
        }
    };

    const handleTimeChange = (event: any, time: Date | undefined, selectedDate: Date | null, appointment: Appointment, closeModal: () => void, setRescheduleMode: (mode: boolean) => void) => {
        if (time && selectedDate) {
            const newDateTime = new Date(selectedDate);
            newDateTime.setHours(time.getHours());
            newDateTime.setMinutes(time.getMinutes());

            Alert.alert(
                'Confirm Reschedule',
                'Are you sure you want to change the appointment time?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Confirm',
                        onPress: () => {
                            updateAppointment(
                                {
                                    _id: appointment._id,
                                    appointmentDate: newDateTime.toISOString(),
                                },
                                {
                                    onSuccess: () => {
                                        Alert.alert('Success', 'Appointment rescheduled successfully.');
                                        setRescheduleMode(false);
                                        closeModal();
                                    },
                                    onError: (error) => {
                                        console.error('Failed to reschedule appointment:', error);
                                        Alert.alert('Error', 'Failed to reschedule appointment. Please try again.');
                                    }
                                }
                            );
                        }
                    }
                ]
            );
        }
    };

    return {
        handleDelete,
        handleReschedulePress,
        handleDateChange,
        handleTimeChange,
    };
};
