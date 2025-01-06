// src/screens/SalonAppointmentsScreen.tsx
import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSalonContext } from '@/context/SalonContext';
import {Agenda, AgendaEntry} from 'react-native-calendars';
import { Appointment } from '@/types';
import { calendarTheme } from '@/styles/commonStyles';
import { useTranslation } from 'react-i18next';
import AppointmentCardModal from '@/components/common/AppointmentInfoCard';
import {styled, useColorScheme} from 'nativewind';
import { format, parseISO } from 'date-fns';
import { useSelectedAppointmentContext } from '@/context/Appointment/SelectedAppointmentContext';
import { useAppointmentContext } from '@/context/Appointment/AppointmentContext';
import { useDefaultSalonIdContext } from '@/context/DefaultSalonIdContext';
import ThemedScreen from "@/components/themed/ThemedScreen";
import {EmployeeSelector} from "@/components/EmployeeSelector";
import {useEmployeesContext} from "@/context/EmployeesContext";
import ThemedButton from "@/components/themed/ThemedButton";
import ReservationList from "react-native-calendars/src/agenda/reservation-list";

type DateObject = {
  dateString: string;  
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

// Define the combined type
type AgendaEntryAppointment = Appointment & {
    name: string;
    day: string;
    height: number; // Make 'height' required
};

type NewItemsType = {
    [key: string]: AgendaEntryAppointment[]; // key is the date (string), value is an array of appointments
};

const StyledView = styled(View);
const StyledText = styled(Text);


const SalonAppointmentsScreen: React.FC = () => {
    const { t } = useTranslation();
    const params = useLocalSearchParams();
    const id = params.id as string;
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | 'all'>('all');
    const { setSelectedAppointment } = useSelectedAppointmentContext();

    const { salons, isSalonsLoading: isSalonsLoading, salonsError: salonsError } = useSalonContext();
    const {appointments} = useAppointmentContext();
    const { defaultSalonId } = useDefaultSalonIdContext();
    const {employees, setSalonId} = useEmployeesContext();

    const {colorScheme} = useColorScheme();

    useEffect(() => {
        if (defaultSalonId){
            setSalonId(defaultSalonId);
        }
    }, [defaultSalonId]);

    const handleAppointmentSelect = useCallback((appointment: Appointment) => {

        setSelectedAppointment(appointment);  

        router.push({
            pathname: 'home/appointments/add-edit-appointment',
            params: { salonId: id },
        });
    }, [setSelectedAppointment, router]);


    const handleEmployeeSelect = (employeeId: string | 'all') => {
        setSelectedEmployeeId(employeeId);
    };

    const handleAddAppointment = () => {
        router.push({
            pathname: `home/appointments/add-edit-appointment`,
            params: { salonId: id, initialDate: selectedDate },
        });
    };

    if (isSalonsLoading) {
        return (
            <StyledView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </StyledView>
        );
    }

    if (salonsError) {
        return (
            <StyledView className="flex-1 justify-center items-center">
                <StyledText className="text-red-300">
                  {t('加载沙龙信息时出错')}
                </StyledText>
            </StyledView>
        );
    }

  //const salon = salons?.find(salon => salon._id === id);

    // In the useMemo hook
    const filteredAppointments = useMemo(() => {
        const newItems: NewItemsType = {};

        if (!newItems[selectedDate]) {
            newItems[selectedDate] = [];
        }

        appointments.forEach((appointment) => {
            if (
                selectedEmployeeId !== 'all' &&
                appointment.employee?.id !== selectedEmployeeId
            ) {
                return;
            }
            const dateKey = format(
                parseISO(appointment.appointmentDate),
                'yyyy-MM-dd'
            );
            console.log("Date Key: ", dateKey);
            if (!newItems[dateKey]) {
                newItems[dateKey] = [];
            }
            const agendaAppointment: AgendaEntryAppointment = {
                ...appointment,
                name: appointment.service?.name || 'Appointment',
                day: dateKey,
                height: 100, // Assign a numeric value to 'height'
            };
            newItems[dateKey].push(agendaAppointment);
        });

        const sortedNewItems: NewItemsType = Object.keys(newItems)
            .reduce((sorted: NewItemsType, key) => {
                // Sort the array of appointments based on appointmentDate within each date group
                sorted[key] = newItems[key].sort((a, b) => {
                    // Parse the appointmentDate and sort by time
                    const dateA = new Date(a.appointmentDate).getTime();
                    const dateB = new Date(b.appointmentDate).getTime();
                    return dateA - dateB; // Sort in ascending order
                });
                return sorted;
            }, {});

        console.log("New Items: ", JSON.stringify(newItems));
        console.log("Sorted Items: ", JSON.stringify(sortedNewItems));

        //console.log("newItems length: ", newItems.size);
        return sortedNewItems;
    }, [appointments, selectedEmployeeId, selectedDate]);


  return (
      <ThemedScreen
          headerTitle='Appointments'
          showHeaderNavButton={true}
          showHeaderNavOptionButton={true}
      >

          <StyledView className='flex-1'>
              <StyledView className='p-4'>
                  <ThemedButton text={'New Appointment'} handleOnPress={handleAddAppointment} />
              </StyledView>
              <Agenda
                  theme={calendarTheme(colorScheme)}
                  items={filteredAppointments}
                  selected={selectedDate}
                  onDayPress={(day: DateObject) => {
                      console.log(day.dateString)
                      setSelectedDate(day.dateString);
                  }}
                  renderList={(listProps) => (
                      <View style={[{flex: 1}, { backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#ffffff' }]}>
                          <ReservationList {...listProps} />
                      </View>
                  )}
                  renderItem={(item: AgendaEntry, firstItemInDay: boolean) => {
                      console.log("Item Rendered: ", item);
                      const appointmentItem = item as AgendaEntryAppointment;
                      return (
                          <AppointmentCardModal
                              key={appointmentItem._id}
                              appointment={appointmentItem}
                              onClick={() => handleAppointmentSelect(appointmentItem)}
                          />
                      );
                  }}

                  renderEmptyDate={() => (
                      <StyledView className="flex-1 justify-center items-center p-5">
                          <StyledText className="text-center text-gray-500">
                              {t('No appointments')}
                          </StyledText>
                      </StyledView>
                  )}

                  contentContainerStyle={{
                      shadowColor: 'black',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.2,
                      shadowRadius: 10,
                      elevation: 5,
                  }}
              />

              <EmployeeSelector
                  employees={employees}
                  selectedEmployeeId={selectedEmployeeId}
                  onSelect={handleEmployeeSelect}
              />
          </StyledView>

      </ThemedScreen>
  );
};

export default memo(SalonAppointmentsScreen);
