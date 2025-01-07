import React, {useCallback, useEffect, useMemo, useState} from "react";
import ThemedScreen from "@/components/themed/ThemedScreen";
import {styled} from "nativewind";
import {Alert, Linking, ScrollView, TouchableOpacity, View} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {useTranslation} from "react-i18next";
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextInput from "@/components/themed/ThemedTextInput";
import { validateMobileNumber, validateString} from "@/utils/validationHelpers";
import {useValidationManager} from "@/utils/validationManager";
import ThemedTouchable from "@/components/themed/ThemedTouchable";
import ServiceSelectModalView from "@/components/common/modals/ServiceSelectModalView";
import {Appointment, ServiceAndCat, Employee, Client} from "@/types";
import {useSelectedAppointmentContext} from "@/context/Appointment/SelectedAppointmentContext";
import ThemedDynamicModal from "@/components/themed/ThemedDynamicModal";
import EmployeeSelectionModalView from "@/components/common/modals/EmployeeSelectModalView";
import ThemedButton from "@/components/themed/ThemedButton";
import {useCreateAppointment} from "@/hooks/appointmentHooks/useCreateAppointment";
import {useUpdateAppointment} from "@/hooks/appointmentHooks/useUpdateAppointment";
import {getCombinedStatus} from "@/utils/statusHelpers";
import DateTimePicker from "@react-native-community/datetimepicker";
import {format, parseISO} from "date-fns";
import {FontAwesome} from "@expo/vector-icons";
import SelectClientModalView from "@/components/common/modals/SelectClientModalView";
import TextInputFloatingLabel from "@/components/common/inputs/TextInputFloatingLabel";
import {useClientContext} from "@/context/ClientContext";
import {useAppointmentContext} from "@/context/Appointment/AppointmentContext";
import AddEditClientModalView from "@/components/common/modals/AddEditClientModalView";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledTouchableOpacity= styled(TouchableOpacity);

const initialAppointment:Partial<Appointment> = {
    salonId: '',
    appointmentDate: '',
    type: 'walk-in',
    employee: {
        id: '',
        firstName: '',
        lastName: '',
    },
    service: {
        id: '',
        name: '',
        price: 0,
        duration: 0,
    },
    client: {
        id: '',
        firstName: '',
        lastName: '',
        phone: '',
    },
    note: '',
    status: 'confirmed',
}

interface EmployeeSmall {
    id: string,
    fullName: string
}

const AddEditAppointmentScreen: React.FC = () => {
    const { t } = useTranslation();
    const { salonId, initialDate } = useLocalSearchParams();
    const { selectedAppointment, setSelectedAppointment } = useSelectedAppointmentContext();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [currentModalView, setCurrentModalView] = useState<string>('');
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
    const [isWalkInClient, setIsWalkInClient] = useState<boolean>(true);
    const [isValidating, setIsValidating] = useState<boolean>(false);
    const [clientFirstName, setClientFirstName] = useState<string>('');
    const [clientLastName, setClientLastName] = useState<string>('');
    const [clientPhone, setClientPhone] = useState<string>('');
    const [textConsentChecked, setTextConsentChecked] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Partial<Client> | null>(null);
    const [selectedService, setSelectedService] = useState<Partial<ServiceAndCat> | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<Partial<Employee> | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [note, setNote] = useState<string>('');
    const [currentAppointment, setCurrentAppointment] = useState<Partial<Appointment>>(initialAppointment);
    const { errors, handleBlur, validateAllFields, configureValidation, resetErrors } = useValidationManager();
    const addAppointmentMutation = useCreateAppointment();
    const editAppointmentMutation = useUpdateAppointment();

    const {refetchAppointments} = useAppointmentContext();

    const {clients} = useClientContext();

    useEffect(() => {
        resetErrors();

        if (initialDate){
            // Ensure salonId is a string
            const initialDateString = Array.isArray(initialDate) ? initialDate[0] : initialDate || '';

            setSelectedDate(parseISO(initialDateString).toDateString());
            console.log(parseISO(initialDateString));
        }

        if (selectedAppointment){
            console.log(selectedAppointment)
            setCurrentAppointment(selectedAppointment);


            const service: Partial<ServiceAndCat> = {
                name: selectedAppointment.service.name,
                _id: selectedAppointment.service.id,
                price: selectedAppointment.service.price,
                duration: selectedAppointment.service.duration
            }

            const employee: Partial<Employee> = {
                _id: selectedAppointment.employee?.id,
                firstName: selectedAppointment.employee?.firstName,
                lastName: selectedAppointment.employee?.lastName
            }

            const client: Partial<Client> = {
                _id: selectedAppointment.client.id,
                firstName: selectedAppointment.client.firstName,
                lastName: selectedAppointment.client.lastName,
                phone: selectedAppointment.client.phone,
            }

            if (selectedAppointment.client.id){
                setSelectedClient(client);
            }else{
                setClientFirstName(client.firstName || '');
                setClientLastName(client.lastName || '');
                setClientPhone(client.phone || '');
            }

            setIsWalkInClient(selectedAppointment.type === 'walk-in');
            setSelectedService(service);
            setSelectedEmployee(employee);
            setSelectedDate(selectedAppointment.appointmentDate);
            setNote(selectedAppointment.note || '');
        }

        console.log("Selected Employee: ", selectedEmployee);
    }, [selectedAppointment, initialDate]);

    const validationConfig = useMemo(() => ({
        clientFirstName: {
            validate: validateString,
            errorMessage: t('Client First Name Required'),
        },
        clientLastName: {
            validate: validateString,
            errorMessage: t('Client Last Name Required'),
        },
        clientPhone: {
            validate: validateMobileNumber,
            errorMessage: t('common.errors.phone'),
        },
        textConsentChecked: {
            validate: (checked: boolean) => !checked,
            errorMessage: t('Text message consent needed!'),
        }
    }), [t]);

    // Fetch owner ID and configure validation when component is mounted
    useEffect(() => {
        configureValidation(validationConfig);
    }, [validationConfig]);

    const handleAddNewClientSelect = () => {
        setCurrentModalView('addEditClient'); // 切换到 AddEditClientModalView
    };// 当新客户保存成功后调用
    const handleClientSaved = (newClient: Client) => {
        console.log('New client saved:', newClient); // 添加日志以调试
        setSelectedClient(newClient); // 设置新客户为选中的客户
        setCurrentModalView(''); // 关闭模态视图
        setIsModalVisible(false); // 隐藏模态框
    };
    
    const handleSelectClientPressed = useCallback(() => {
        setCurrentModalView('clientSelect');
        setIsModalVisible(true);
    }, []);

    const handleSelectServicePressed = useCallback(() => {
        setCurrentModalView('serviceSelect');
        setIsModalVisible(true);
    }, []);

    const handleSelectEmployeePressed = useCallback(() => {
        setCurrentModalView('employeeSelect');
        setIsModalVisible(true);
    }, []);

    const handleSelectDatePressed = useCallback(() => {
        setCurrentModalView('dateSelect');
        setIsModalVisible(true);
    }, []);

    const handleSelectTimePressed = useCallback(() => {
        setCurrentModalView('timeSelect');
        setIsModalVisible(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setCurrentModalView('');
        setIsModalVisible(false);
    }, []);

    const handleDismissScreen = useCallback(() => {
        setSelectedAppointment(null);
        router.dismiss()
    }, [router]);

    const handleServiceSelect = (service: ServiceAndCat) => {
        setSelectedService(service);
        setIsModalVisible(false);
    };

    const handleEmployeeSelect = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsModalVisible(false);
    };

    const handleClientSelect = (client: Partial<Client>) => {
        console.log(client);
        setSelectedClient(client);
        setIsModalVisible(false);
    };

    // // Handle date change
    // const handleDateChange = (event: any, date?: Date) => {
    //     setShowDatePicker(false);
    //     if (date) {
    //         console.log(date);
    //         setSelectedDate(date.toISOString());
    //     }
    // };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            console.log(date);
            setSelectedDate(date.toISOString());
        }
        console.log("Selected date:", date);
    };
    
    // // Handle time change
    // const handleTimeChange = (event: any, time?: Date) => {
    //     setShowTimePicker(false);
    //     if (time) {
    //         const appointmentDate = new Date(selectedDate || new Date());
    //         appointmentDate.setHours(time.getHours(), time.getMinutes());
    //         setSelectedDate(appointmentDate.toISOString());
    //     }
    // };

    const handleTimeChange = (time: Date | null) => {
        if (time) {
            const appointmentDate = new Date(selectedDate || new Date());
            appointmentDate.setHours(time.getHours(), time.getMinutes());
            setSelectedDate(appointmentDate.toISOString());
            setSelectedDate(appointmentDate.toISOString());
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'KK:mm b');
    };

    const refetchAndClose = () => {
        setSelectedAppointment(null);
        refetchAppointments();
        handleDismissScreen();
    }

    const handleCheckboxChange = useCallback(() => {
        setTextConsentChecked(!textConsentChecked);
        handleBlur('textConsentChecked', !textConsentChecked);
    }, [textConsentChecked, handleBlur]);

    const appointmentData: Partial<Appointment> = useMemo(() => ({
        ...currentAppointment,
        appointmentDate: selectedDate,
        type: isWalkInClient ? 'walk-in' : 'return-client',
        employee: {
            id: selectedEmployee?._id,
            firstName: selectedEmployee?.firstName || '',
            lastName: selectedEmployee?.lastName || '',
        },
        service: {
            id: selectedService?._id  || '',
            name: selectedService?.name  || '',
            price: selectedService?.price  || 0,
            duration: selectedService?.duration || 0
        },
        client: {
            ...(selectedClient?._id ? { id: selectedClient._id } : {}), // only include id if there is a selected client
            firstName: selectedClient?.firstName  || clientFirstName,
            lastName: selectedClient?.lastName  || clientLastName,
            phone: selectedClient?.phone  || clientPhone,
        },
        note: note,
    }), [clientFirstName, clientLastName, clientPhone, note, selectedDate, selectedService, selectedEmployee, selectedClient]);

    const handleSaveAppointment = useCallback(() => {
        console.log("Saving Appointment");

        setIsValidating(true);

        // Ensure salonId is a string
        const salonIdString = Array.isArray(salonId) ? salonId[0] : salonId || '';
        console.log("SalonID: ", salonIdString);

        if (isWalkInClient && !validateAllFields({ clientFirstName, clientLastName, clientPhone, textConsentChecked })){
            return;
        }else if (!isWalkInClient && !selectedClient){
            return;
        }

        if (!selectedEmployee || !selectedService){
            //alert('Employee must be selected!');
            return;
        }

        console.log("AppointmentData: ", JSON.stringify(appointmentData, null, 2));
        if (selectedAppointment) {
            editAppointmentMutation.mutate(
                appointmentData ,
                {
                    onSuccess: refetchAndClose,
                    onError: (error) => console.error('Error updating appointment:', error),
                }
            );
        } else if (salonIdString !== ''){
            addAppointmentMutation.mutate(
                {...appointmentData, salonId: salonIdString},
                {
                    onSuccess: refetchAndClose,
                    onError: (error) => console.error('Error adding appointment:', error),
                }
            );
        }
    }, [appointmentData, validateAllFields, router, editAppointmentMutation, addAppointmentMutation]);

    const appointmentMutationStatus = useMemo(() =>
            getCombinedStatus([addAppointmentMutation.status, editAppointmentMutation.status]),
        [addAppointmentMutation.status, editAppointmentMutation.status]
    );

    const modalViews = useMemo(() => [
        {
            key: 'serviceSelect',
            component: (
                <ServiceSelectModalView
                    visible={currentModalView === 'serviceSelect'}
                    handleServiceSelection={handleServiceSelect}
                />
            )
        },
        {
            key: 'employeeSelect',
            component: (
                <EmployeeSelectionModalView
                    salonId={salonId as string}
                    visible={currentModalView === 'employeeSelect'}
                    handleEmployeeSelect={handleEmployeeSelect}
                />
            )
        },
        {
            key: 'clientSelect',
            component: (
                <SelectClientModalView
                    salonId={salonId as string}
                    visible={currentModalView === 'clientSelect'}
                    onClientSelect={handleClientSelect}
                    AddEditClientModalView={handleAddNewClientSelect} // 更新这里
                    onWalkInSelect={() => {console.log("Walk In Selected")}}
                />
            )
        },
        {
            key: 'addEditClient',
            component: (
                <AddEditClientModalView
                    visible={currentModalView === 'addEditClient'}
                    onClose={handleCloseModal}
                    onSave={handleClientSaved} // 添加保存成功的回调
                />
            )
        },
    ], [currentModalView, handleCloseModal, handleServiceSelect, handleEmployeeSelect, handleClientSelect, handleAddNewClientSelect, handleClientSaved]);
    return (
        <ThemedScreen
            showHeaderNavButton={true}
            showHeaderNavOptionButton={true}
            onHeaderNavBackPress={refetchAndClose}
            headerTitle='Add Edit Appointment'
        >
            <StyledScrollView className='px-2 pb-5'>
                <StyledView className='flex-row mb-2 justify-between'>
                    <ThemedButton
                        text={'Walk In'}
                        type='primary-sm'
                        flexWidth='full'
                        textColorName={isWalkInClient ? 'primaryButtonText' : 'greyButtonText'}
                        bgColorName={isWalkInClient ? 'primaryButtonBG' : 'greyButtonBG'}
                        handleOnPress={() => setIsWalkInClient(true)}
                    />
                    <ThemedButton
                        text={'Returning Client'}
                        type='primary-sm'
                        flexWidth='full'
                        textColorName={!isWalkInClient ? 'primaryButtonText' : 'greyButtonText'}
                        bgColorName={!isWalkInClient ? 'primaryButtonBG' : 'greyButtonBG'}
                        handleOnPress={() => setIsWalkInClient(false)}
                    />
                </StyledView>
                <StyledView className='mt-4'>
                    {isWalkInClient && (
                        <StyledView className='mb-4'>
                            <TextInputFloatingLabel
                                label={t('First Name')}
                                value={clientFirstName}
                                onChangeText={setClientFirstName}
                                onBlur={() => handleBlur('clientFirstName', clientFirstName)}
                            />
                            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.clientFirstName}>
                                {errors.clientFirstName}
                            </ThemedText>

                            <TextInputFloatingLabel
                                label={t('Last Name')}
                                value={clientLastName}
                                onChangeText={setClientLastName}
                                onBlur={() => handleBlur('clientLastName', clientLastName)}
                            />
                            <ThemedText type='input-error' colorName='errorText'
                                        isVisible={!!errors.clientLastName}>{errors.clientLastName}</ThemedText>

                            <StyledView className='flex-row items-center'>
                                <StyledView className='flex-grow'>
                                    <TextInputFloatingLabel
                                        label={t('Phone')}
                                        value={clientPhone}
                                        onChangeText={setClientPhone}
                                        onBlur={() => handleBlur('clientPhone', clientPhone)}
                                    />
                                </StyledView>
                                <StyledTouchableOpacity
                                    disabled={!clientPhone || !!errors.clientPhone}
                                    className={`mt-5 ml-2 p-2 rounded-lg flex-row items-center justify-center ${clientPhone ? 'bg-blue-400' : 'bg-gray-400'}`}
                                    onPress={() => {
                                        if (clientPhone && !errors.clientPhone) {
                                            const url = `tel:${clientPhone}`;
                                            Linking.openURL(url).catch(() => {
                                                Alert.alert(t('Error'), t('Unable to dial the number.'));
                                            });
                                        } else {
                                            Alert.alert(t('Invalid Number'), t('Please enter a valid phone number.'));
                                        }
                                    }}
                                >
                                    <FontAwesome
                                        name="phone"
                                        size={20}
                                        color="white"
                                        style={{marginRight: 8}}
                                    />
                                    <ThemedText>
                                        {t('Call')}
                                    </ThemedText>
                                </StyledTouchableOpacity>
                            </StyledView>
                            <ThemedText type='input-error' colorName='errorText' isVisible={!!errors.clientPhone}>
                                {errors.clientPhone}
                            </ThemedText>
                            <StyledTouchableOpacity className="flex-row items-center my-2" onPress={handleCheckboxChange}>
                                <StyledView
                                    className={`ml-2 h-6 w-6 border rounded ${
                                        textConsentChecked ? 'bg-white' : 'bg-blue-500'
                                    } mr-2`}
                                />
                                <ThemedText className="pl-1" type="text-sm">
                                    {t('Client has agreed to receive appointment notifications via text message. Consent obtained to send SMS appointment reminders to the customer. Customer agrees to receive text message notifications (standard rates apply). For more information, please visit')}{' '}
                                    <ThemedText type="link" colorName="link">
                                        {t('registerAccountScreen.privacyPolicy')}
                                    </ThemedText>
                                </ThemedText>
                            </StyledTouchableOpacity>
                            <ThemedText type="input-error" colorName="errorText" isVisible={!!errors.textConsentChecked}>
                                {errors.textConsentChecked}
                            </ThemedText>
                        </StyledView>
                    )}
                    {!isWalkInClient && (
                        <StyledView className='flex-row mb-4'>
                            <StyledView className='flex-grow'>
                                <ThemedText type='label' colorName='accent' className='align-self-start'>{t('Returning Client')}</ThemedText>
                                <ThemedText type='text-lg'>
                                    {selectedClient ?  `${selectedClient.firstName} ${selectedClient.lastName}` : ''}
                                </ThemedText>
                                <ThemedText type='default' colorName='textGrey'>
                                    {selectedClient?.phone || ''}
                                </ThemedText>
                            </StyledView>
                            <StyledTouchableOpacity
                                onPress={handleSelectClientPressed}
                                className='flex mx-auto mt-auto border-2 border-white rounded-lg py-1 px-3 justify-center'
                            >
                                <ThemedText className='p-0'>{selectedClient ? 'Change Client' : 'Select a Client'}</ThemedText>
                            </StyledTouchableOpacity>
                        </StyledView>
                    )}
                </StyledView>

                <StyledView style={{borderBottomWidth: 1, borderBottomColor: 'rgba(155,155,155,0.55)'}}></StyledView>

                <StyledView className='flex-row mt-2 mb-4'>
                    <StyledView className='flex-grow'>
                        <ThemedText type='label' colorName='accent' className='align-self-start'>{t('Date of Appointment')}</ThemedText>
                        <ThemedText>{selectedDate ? `${format(new Date(selectedDate), 'MM-dd-yy')}` : ''}</ThemedText>
                    </StyledView>
                    <DatePicker
                        selected={selectedDate ? new Date(selectedDate) : new Date()}
                        onChange={handleDateChange}
                        dateFormat="MM-dd-yyyy"
                        placeholderText="Select a date"
                        className="date-picker-input" // Add custom styling class if needed
                        popperClassName="higher-zindex" // Add a custom class to control z-index
                        popperPlacement="bottom-start" // Optional: Adjust the placement if needed
                        portalId="root-portal" // Moves the picker to the end of the body
                    />
                    {/* <StyledTouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        className='flex mx-auto mt-auto border-2 border-white rounded-lg py-1 px-3 justify-center'
                    >
                        <ThemedText className='p-0'>{selectedService ? 'Change Date' : 'Select a Date'}</ThemedText>
                    </StyledTouchableOpacity> */}
                </StyledView>
                {/* {showDatePicker && (
                    <DateTimePicker
                        value={
                            selectedDate ? new Date(selectedDate) : new Date()
                        }
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )} */}
                {/* <DatePicker
                    selected={selectedDate ? new Date(selectedDate) : new Date()}
                    onChange={handleDateChange}
                    dateFormat="MM-dd-yyyy"
                    placeholderText="Select a date"
                    className="date-picker-input" // Add custom styling class if needed
                /> */}
                <StyledView style={{borderBottomWidth: 1, borderBottomColor: 'rgba(155,155,155,0.55)'}}></StyledView>

                <StyledView className='flex-row mt-2 mb-4'>
                    <StyledView className='flex-grow'>
                        <ThemedText type='label' colorName='accent' className='align-self-start'>{t('Time of Appointment')}</ThemedText>
                        <ThemedText>{selectedDate ? `${formatTime(selectedDate)}` : ''}</ThemedText>
                    </StyledView>
                    {/* <StyledTouchableOpacity
                        onPress={() => setShowTimePicker(true)}
                        className='flex mx-auto mt-auto border-2 border-white rounded-lg py-1 px-3 justify-center'
                    >
                        <ThemedText className='p-0'>{selectedService ? 'Change Time' : 'Select a Time'}</ThemedText>
                    </StyledTouchableOpacity> */}
                    <DatePicker
                        selected={selectedDate ? new Date(selectedDate) : new Date()}
                        onChange={handleTimeChange}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15} // Interval between times (15 minutes)
                        timeCaption="Time"
                        dateFormat="h:mm aa" // 12-hour format with AM/PM
                        placeholderText="Select a time"
                        className="time-picker-input"
                        popperClassName="higher-zindex" // Add a custom class to control z-index
                        popperPlacement="bottom-start" // Optional: Adjust the placement if needed
                        portalId="root-portal" // Moves the picker to the end of the body
                    />
                </StyledView>
                {/* {showTimePicker && (
                    <DateTimePicker
                        value={
                            selectedDate ? new Date(selectedDate) : new Date()
                        }
                        mode="time"
                        display="default"
                        onChange={handleTimeChange}
                    />
                )} */}
                <StyledView style={{borderBottomWidth: 1, borderBottomColor: 'rgba(155,155,155,0.55)'}}></StyledView>

                <StyledView className='flex-row mt-2 mb-4'>
                    <StyledView className='flex-grow'>
                        <ThemedText type='label' colorName='accent' className='align-self-start'>{t('Service')}</ThemedText>
                        <ThemedText>{selectedService?.name}</ThemedText>
                    </StyledView>
                    <StyledTouchableOpacity
                        onPress={handleSelectServicePressed}
                        className='flex mx-auto mt-auto border-2 border-white rounded-lg py-1 px-3 justify-center'
                    >
                        <ThemedText className='p-0'>{selectedService ? 'Edit Service' : 'Select A Service'}</ThemedText>
                    </StyledTouchableOpacity>
                </StyledView>
                <ThemedText type='input-error' colorName='errorText' isVisible={isValidating && !selectedService}>
                    {t("Service is required")}
                </ThemedText>
                <StyledView style={{borderBottomWidth: 1, borderBottomColor: 'rgba(155,155,155,0.55)'}}></StyledView>

                <StyledView className='flex-row mt-2 mb-4'>
                    <StyledView className='flex-grow'>
                        <ThemedText type='label' colorName='accent' className='align-self-start'>{t('Employee')}</ThemedText>
                        <ThemedText>{selectedEmployee ? `${selectedEmployee?.firstName} ${selectedEmployee?.lastName}` : ''}</ThemedText>
                    </StyledView>
                    <StyledTouchableOpacity
                        onPress={handleSelectEmployeePressed}
                        className='flex mx-auto mt-auto border-2 border-white rounded-lg py-1 px-3 justify-center'
                    >
                        <ThemedText className='p-0'>{selectedEmployee ? 'Change Employee' : 'Select an Employee'}</ThemedText>
                    </StyledTouchableOpacity>
                </StyledView>
                <ThemedText type='input-error' colorName='errorText' isVisible={isValidating && !selectedEmployee}>
                    {t("Employee is required")}
                </ThemedText>
                <StyledView style={{borderBottomWidth: 1, borderBottomColor: 'rgba(155,155,155,0.55)'}}></StyledView>

                <ThemedText type='label' colorName='accent' className='align-self-start'>{t('Note')}</ThemedText>
                <ThemedTextInput
                    style={{textAlignVertical: "top", padding: 4}}
                    type='multi'
                    placeholder={t('Enter Note')}
                    value={note}
                    onChangeText={setNote}
                />

                <StyledView className="flex-row justify-between my-4">
                    <ThemedButton
                        text={t('common.cancel')}
                        type='cancel'
                        flexWidth='full'
                        textColorName='cancelButtonText'
                        bgColorName='cancelButtonBG'
                        handleOnPress={handleDismissScreen}
                    />
                    <ThemedButton
                        text={t('common.save')}
                        type='primary'
                        flexWidth='full'
                        handleOnPress={handleSaveAppointment}
                        status={appointmentMutationStatus}
                    />
                </StyledView>

            </StyledScrollView>
            <ThemedDynamicModal
                type='bottom'
                animationType='slide'
                visible={isModalVisible}
                onClose={handleCloseModal}
                views={modalViews}
                currentView={currentModalView}
            />
        </ThemedScreen>
    )
}

export default AddEditAppointmentScreen;