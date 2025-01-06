import React, { useState } from 'react';
import { Modal, TouchableOpacity, TextInput, View, Text, ScrollView, Linking, Alert } from 'react-native';
import { styled } from 'nativewind';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Service, Category, Employee, ServiceAndCat } from '../../../types';  // Replace with your actual type imports
import DateTimePicker from '@react-native-community/datetimepicker';  // Import date and time picker
import { format, addMinutes } from 'date-fns'; // Import date manipulation functions

interface AppointmentModalProps {
    visible: boolean;
    closeModal: () => void;
    newAppointment: any;
    setNewAppointment: (data: any) => void;
    errorMessage: string | null;
    services: ServiceAndCat[];
    categories: Category[];
    employees: Employee[];
    handleSaveAppointment: () => void;
    handleServiceSelect: (serviceId: string, serviceName: string, duration: number) => void; // Add duration parameter
    handleEmployeeSelect: (employeeId: string, firstName: string, lastName: string) => void;
    serviceModalVisible: boolean;
    setServiceModalVisible: (visible: boolean) => void;
    employeeModalVisible: boolean;
    setEmployeeModalVisible: (visible: boolean) => void;
    selectedDate: string;
    setShowDatePicker: (visible: boolean) => void;
    showDatePicker: boolean;
    showTimePicker: boolean;
    setShowTimePicker: (visible: boolean) => void;
    formatTime: (date: Date) => string;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    loadingEmployees: boolean;
    employeeError: string | null;
    handleDeleteAppointment: any
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

const AppointmentModal: React.FC<AppointmentModalProps> =
    ({
        visible,
        closeModal,
        newAppointment,
        setNewAppointment,
        errorMessage,
        services,
        categories,
        employees,
        handleSaveAppointment,
        handleServiceSelect,
        handleEmployeeSelect,
        serviceModalVisible,
        setServiceModalVisible,
        employeeModalVisible,
        setEmployeeModalVisible,
        selectedDate,
        setShowDatePicker,
        showDatePicker,
        showTimePicker,
        setShowTimePicker,
        formatTime,
        searchQuery,
        setSearchQuery,
        loadingEmployees,
        employeeError,
        handleDeleteAppointment
    }) => {
        const { t } = useTranslation();

        // Function to calculate end time based on service duration
        const calculateEndTime = (startTime: Date, duration: number) => {
            return addMinutes(startTime, duration);
        };

        const handleServiceSelection = (serviceId: string, serviceName: string, duration: number) => {
            setNewAppointment({ ...newAppointment, serviceId, serviceName, serviceDuration: duration });
            setServiceModalVisible(false);
        };
        const handleDatePicker = () => {
            setShowDatePicker(true); // Ensure showDatePicker is set to true
        };

        return (
            <Modal visible={visible} animationType="slide" transparent={true}>
                <ScrollView>
                    <StyledView className="flex-1 justify-center items-center bg-white mt-9  ">
                        <StyledView className="bg-white-500 w-[95%] h-[88%] p-4 rounded-lg  mb-5">

                            {/* 错误信息 */}
                            {errorMessage && (
                                <StyledText className="text-red-500 text-center mb-4">
                                    {errorMessage}
                                </StyledText>
                            )}

                            {/* 取消和删除按钮的容器 */}
                            <StyledView className="flex-row justify-between w-full mb-5 ">

                                {/* 带X图标的取消按钮 */}
                                <StyledTouchableOpacity
                                    className="  flex-row justify-center items-center "
                                    onPress={closeModal}
                                >
                                    <FontAwesome name="close" size={20} color="black" />
                                </StyledTouchableOpacity>

                                {/* 删除预约按钮 */}
                                <StyledTouchableOpacity
                                    className="bg-white border border-red-500 text-red-500 text-base p-2 rounded-lg"
                                    onPress={() => {
                                        handleDeleteAppointment(newAppointment.appointmentId);
                                        closeModal();
                                    }}
                                >
                                    <StyledText className="text-red-500 text-center">

                                        {t('Delete Appointment')}
                                    </StyledText>
                                </StyledTouchableOpacity>
                            </StyledView>
                            {/* 服务价格 */}
                            <StyledText className="text-xl text-center text-blue-600 font-bold mb-4">
                                {t('Edit Appointment')}
                            </StyledText>
                            <StyledText className="text-sm text-white-500 mb-1">
                                {t('Client Name')}
                            </StyledText>
                            <StyledView className="flex-row mb-4">
                                {/* 客户名输入框 - 名字 */}
                                <StyledTextInput
                                    className="flex-1 mr-2 p-3 border border-blue-300 rounded-lg"
                                    placeholder={t('Client First Name')}
                                    value={newAppointment.clientFirstName}
                                    onChangeText={(text) => setNewAppointment({ ...newAppointment, clientFirstName: text })}
                                />
                                {/* 客户姓输入框 - 姓氏 */}
                                <StyledTextInput
                                    className="flex-1 p-3 border border-blue-300 rounded-lg"
                                    placeholder={t('Client Last Name')}
                                    value={newAppointment.clientLastName}
                                    onChangeText={(text) => setNewAppointment({ ...newAppointment, clientLastName: text })}
                                />
                            </StyledView>

                            {/* 服务选择 */}
                            <StyledView className="mb-4">
                                <StyledText className="text-sm text-white-500 mb-1">
                                    {t('Choose Service')}
                                </StyledText>
                                <StyledTouchableOpacity
                                    className="flex-1 p-3 border border-blue-300 rounded-lg bg-white shadow-sm"
                                    onPress={() => setServiceModalVisible(true)}
                                >
                                    <StyledText className="text-lg text-left text-blue-700">
                                        {newAppointment.serviceName || t('Select Service')}
                                    </StyledText>
                                </StyledTouchableOpacity>
                            </StyledView>
                            {/* 员工选择 */}
                            <StyledView className="mb-4">
                                <StyledText className="text-sm text-white-500 mb-1">
                                    {t('Choose Employee')}
                                </StyledText>
                                <StyledTouchableOpacity
                                    className="flex-1 p-3 border border-blue-300 rounded-lg bg-white shadow-sm"
                                    onPress={() => setEmployeeModalVisible(true)}
                                >
                                    <StyledText className="text-lg text-left text-blue-700">
                                        {newAppointment.employeeName || t('Select Employee')}
                                    </StyledText>
                                </StyledTouchableOpacity>
                            </StyledView>


                            {/* 电话号码输入 */}
                            <StyledView className="mb-4">
                                <StyledText className="text-sm text-white-500 mb-1">
                                    {t('Phone Number')}
                                </StyledText>
                                <StyledTextInput
                                    className="flex-1 p-3 border border-blue-300 rounded-lg bg-white shadow-sm text-lg items-center "  // 添加 items-center 来垂直居中文本
                                    placeholder={t('Phone')}
                                    value={newAppointment.phone}
                                    onChangeText={(text) => setNewAppointment({ ...newAppointment, phone: text })}
                                />
                                <StyledTouchableOpacity
                                    className=" mt-2 bg-blue-500 p-2 rounded-lg shadow-sm"
                                    onPress={() => {
                                        // 确保电话号码有效
                                        if (newAppointment.phone) {
                                            const url = `tel:${newAppointment.phone}`;
                                            Linking.openURL(url);
                                        } else {
                                            Alert.alert(t('Invalid Number'), t('Please enter a valid phone number before calling.'));
                                        }
                                    }}
                                >
                                    <StyledText className="text-white text-center">{t('Call Client')}
                                    </StyledText>
                                </StyledTouchableOpacity>
                            </StyledView>


                            {/* 日期选择器 */}
                            <StyledView className="w-full mb-4">
                                {/* 日期和时间选择器 */}
                                <StyledView className="mb-4 flex-row justify-end">
                                    <StyledText className="text-sm text-white-500 mb-1 w-full">
                                        {t('Select Date')}
                                    </StyledText>
                                    <StyledTouchableOpacity
                                        onPress={handleDatePicker}
                                        className="border border-blue-300 p-3 rounded-lg shadow-sm"
                                    >
                                        <StyledText className="text-lg text-left text-white-700">
                                        {newAppointment.date ? format(new Date(newAppointment.date), 'yyyy-MM-dd') : t('Pick a date')}
                                        </StyledText>
                                    </StyledTouchableOpacity>

                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={(event, date) => {
                                                setShowDatePicker(false); // Close the picker after selection
                                                if (date) {
                                                    setNewAppointment({ ...newAppointment, date });
                                                }
                                            }}
                                        />
                                    )}
                                </StyledView>

                                {/* 时间和结束时间放在同一行 */}
                                <StyledView className="mb-4 flex-row justify-between">
                                    {/* 预约时间 */}
                                    <StyledView className="flex-1 mr-2">
                                        <StyledText className="text-sm text-white-500 mb-1">
                                            {t('Time of appointment')}
                                        </StyledText>
                                        <StyledTouchableOpacity
                                            onPress={() => setShowTimePicker(true)}  // 点击显示时间选择器
                                            className="bg-white-200 p-3 rounded-lg w-full shadow-sm"
                                        >
                                            <StyledView className="flex-row justify-between items-center">
                                                <StyledText className="text-lg text-left text-white-700">
                                                    {newAppointment.time ? `${formatTime(newAppointment.time)} - ${formatTime(calculateEndTime(newAppointment.time, newAppointment.serviceDuration))}` : t('Not Set')}
                                                </StyledText>
                                            </StyledView>

                                        </StyledTouchableOpacity>

                                        {/* 弹出时间选择器 */}
                                        {showTimePicker && (
                                            <Modal
                                                transparent={true}
                                                animationType="slide"
                                                visible={showTimePicker}
                                                onRequestClose={() => setShowTimePicker(false)}  // 点击外部关闭
                                            >
                                                <StyledView className="flex-1 justify-center items-center">
                                                    <StyledView className="bg-white p-4 rounded-lg shadow-lg">
                                                        {/* DateTimePicker */}
                                                        <DateTimePicker
                                                            value={newAppointment.time || new Date()}
                                                            mode="time"
                                                            display="spinner"
                                                            onChange={(event, selectedTime) => {
                                                                // 暂存选择的时间
                                                                if (selectedTime) {
                                                                    setNewAppointment((prev: any) => ({ ...prev, tempTime: selectedTime }));
                                                                }
                                                            }}
                                                        />
                                                        {/* 按钮用于确认选择并关闭时间选择器 */}
                                                        <StyledTouchableOpacity
                                                            onPress={() => {
                                                                // 确认选择时间并关闭选择器
                                                                if (newAppointment.tempTime) {
                                                                    setNewAppointment((prev: { tempTime: any; }) => ({ ...prev, time: prev.tempTime }));
                                                                }
                                                                setShowTimePicker(false);  // 关闭时间选择器
                                                            }}
                                                            className="bg-blue-500 p-2 rounded-lg mt-2"
                                                        >
                                                            <StyledText className="text-white text-center">{t('Confirm')}</StyledText>
                                                        </StyledTouchableOpacity>
                                                    </StyledView>
                                                </StyledView>
                                            </Modal>
                                        )}
                                    </StyledView>


                                    {/* 结束时间 */}

                                </StyledView>

                            </StyledView>

                            {/* 备注输入 */}
                            <StyledTextInput
                                className="w-full p-3 border border-white-300 rounded-lg mb-4"
                                placeholder={t('Note')}
                                value={newAppointment.note}
                                onChangeText={(text) => setNewAppointment({ ...newAppointment, note: text })}
                            />

                            {/* 保存预约按钮 */}
                            <StyledTouchableOpacity
                                className="bg-blue-600 p-3 rounded-lg w-full shadow-md"
                                onPress={handleSaveAppointment}
                            >
                                <StyledText className="text-white text-center text-lg font-semibold">
                                    {t('Save Appointment')}
                                </StyledText>
                            </StyledTouchableOpacity>


                        </StyledView>

                        {/* 服务选择模态框 */}
                        <Modal visible={serviceModalVisible} animationType="slide" transparent={true}>
                            <StyledView className="flex-1 justify-center items-center bg-black bg-opacity-50">
                                <StyledView className="w-10/12 h-4/5 bg-white rounded-lg p-5 shadow-xl">
                                    <StyledTouchableOpacity className="absolute top-2 right-2" onPress={() => setServiceModalVisible(false)}>
                                        <FontAwesome name="close" size={20} color="black" />
                                    </StyledTouchableOpacity>

                                    <StyledScrollView contentContainerStyle="flex-grow justify-center items-center">
                                        <StyledText className="text-2xl font-bold mb-5 text-center text-blue-500">
                                            {t('Select Service')}
                                        </StyledText>

                                        <StyledTextInput
                                            className="w-full p-3 border border-white-300 rounded-lg mb-4"
                                            placeholder={t('Search services')}
                                            value={searchQuery}
                                            onChangeText={(text) => setSearchQuery(text)}
                                        />

                                        {categories.map(category => (
                                            <StyledView key={category._id} className="w-full mb-4">
                                                <StyledText className="text-lg font-bold mb-2">
                                                    {category.name}
                                                </StyledText>

                                                {services
                                                    .filter(service => service.categoryId._id === category._id && service.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                                    .map(service => (
                                                        <StyledTouchableOpacity
                                                            key={service._id}
                                                            className="p-3 border-b border-white-300 w-full"
                                                            onPress={() => handleServiceSelection(service._id, service.name, service.duration)}
                                                        >
                                                            <StyledView className="flex-row justify-between items-center">
                                                                <StyledText className="text-lg text-white-500">{service.name}</StyledText>
                                                                <StyledText className="text-lg text-purple-500">$ {service.price}</StyledText>
                                                            </StyledView>
                                                        </StyledTouchableOpacity>
                                                    ))}
                                            </StyledView>
                                        ))}
                                    </StyledScrollView>
                                </StyledView>
                            </StyledView>
                        </Modal>

                        {/* 员工选择模态框 */}
                        <Modal visible={employeeModalVisible} animationType="slide" transparent={true}>
                            <StyledView className="flex-1 justify-center items-center bg-black bg-opacity-50">
                                <StyledView className="w-10/12 h-4/5 bg-white rounded-lg p-5 shadow-xl">
                                    <StyledTouchableOpacity className="absolute top-2 right-2" onPress={() => setEmployeeModalVisible(false)}>
                                        <FontAwesome name="close" size={20} color="black" />
                                    </StyledTouchableOpacity>

                                    <StyledScrollView contentContainerStyle="flex-grow justify-center items-center">
                                        <StyledText className="text-2xl font-bold mb-3 text-center text-blue-600">
                                            {t('Select Employee')}
                                        </StyledText>

                                        {loadingEmployees ? (
                                            <StyledText>{t('Loading')}...</StyledText>
                                        ) : employeeError ? (
                                            <StyledText>{t('Error loading employees')}</StyledText>
                                        ) : (
                                            employees.map(employee => (
                                                <StyledTouchableOpacity
                                                    key={employee._id}
                                                    className="p-3 border-b border-white-300 w-full"
                                                    onPress={() => handleEmployeeSelect(employee._id, employee.firstName, employee.lastName)}
                                                >
                                                    <StyledText className="text-lg">{employee.firstName} {employee.lastName}</StyledText>
                                                    <StyledText className="text-sm">{employee.role}</StyledText>
                                                </StyledTouchableOpacity>
                                            ))
                                        )}
                                    </StyledScrollView>
                                </StyledView>
                            </StyledView>
                        </Modal>
                    </StyledView>
                </ScrollView>
            </Modal>

        );
    };

export default AppointmentModal;
