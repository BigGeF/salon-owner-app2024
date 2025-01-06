// src/screens/SalonAppointmentsScreen.tsx
import React, { useState, memo, useCallback } from 'react';
import { TouchableOpacity, View ,Text} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSalonContext } from '../../context/SalonContext';
import { Agenda, DateObject } from 'react-native-calendars';
import { Appointment, Employee } from '../../types';
import { useCreateAppointment } from '../../hooks/appointmentHooks/useCreateAppointment';
import { useUpdateAppointment } from '../../hooks/appointmentHooks/useUpdateAppointment';
import { useDeleteAppointment } from '../../hooks/appointmentHooks/useDeleteAppointment';
import { useServiceContext } from '../../context/ServicesContext';
import { useCategoriesContext } from '../../context/CategoriesContext';
import { calendarTheme } from '../../styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import AppointmentModal from '../../components/common/modals/Appointments/AddAppointmentModal';
import AppointmentDetailsModal from '../../components/common/modals/Appointments/UpdateAppointmentModal';
import DeleteAppointModal from '../../components/common/modals/Appointments/DeleteAppointModal';
import AppointmentCardModal from '../../components/common/modals/Appointments/AppointmentCardModal';
import EmployeeSelector from '../../components/EmployeeSelector/EmployeeSelector';
import AllAppointment from '../../components/common/modals/Appointments/AllAppointment';
import { styled } from 'nativewind'; // 导入 styled 函数

// 使用 styled 包装 View 和 Text 组件
const StyledView = styled(View);
const StyledText = styled(Text);

const SalonAppointments: React.FC = () => {
    const params = useLocalSearchParams();
    const id = params.id as string;
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
    const [employeeName, setEmployeeName] = useState<string>('');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // 其他状态
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [appointmentIdToDelete, setAppointmentIdToDelete] = useState<string | null>(null);

    // 单独的状态变量
    const [appointmentId, setAppointmentId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [serviceDescription, setServiceDescription] = useState('');
    const [servicePrice, setServicePrice] = useState(0);
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [time, setTime] = useState<Date>(new Date());
    const [employeeId, setEmployeeId] = useState<Employee | null>(null);
    const [note, setNote] = useState('');
    const [serviceDuration, setServiceDuration] = useState(0);
    const [tempClientFirstName, setTempClientFirstName] = useState('');
    const [tempClientLastName, setTempClientLastName] = useState('');
    const [tempClientPhone, setTempClientPhone] = useState('');
    const [tempClientEmail, setTempClientEmail] = useState('');

    const { salons, isLoading: isSalonsLoading, error: salonsError } = useSalonContext();
    const { createAppointment } = useCreateAppointment();
    const { updateAppointment } = useUpdateAppointment();
    const { deleteAppointment } = useDeleteAppointment();
    const { services, setSalonIdInServices } = useServiceContext();
    const { categories, setSalonIdInCategories } = useCategoriesContext();

    // 选择的员工ID，用于过滤
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | 'all'>('all');

    // 初始化沙龙相关的上下文
    React.useEffect(() => {
        setSalonIdInServices(id);
        setSalonIdInCategories(id);
    }, [id, setSalonIdInServices, setSalonIdInCategories]);

    // 处理添加预约
    const handleAddAppointment = useCallback(() => {
        setIsEditing(false);
        // 重置所有表单字段
        setAppointmentId('');
        setCategoryId('');
        setServiceId('');
        setServiceName('');
        setServiceDescription('');
        setServicePrice(0);
        setPhone('');
        setDate(new Date());
        setTime(new Date());
        setEmployeeId(null);
        setNote('');
        setEmployeeName('');
        setServiceDuration(0);
        setTempClientFirstName('');
        setTempClientLastName('');
        setTempClientPhone('');
        setTempClientEmail('');
        setAddModalVisible(true);
    }, []);

    // 处理保存预约
    const handleSaveAppointment = useCallback(async () => {
        if (!tempClientFirstName.trim()) {
            setErrorMessage(t('客户名字是必填项'));
            return;
        }
        if (!tempClientLastName.trim()) {
            setErrorMessage(t('客户姓氏是必填项'));
            return;
        }
        if (!serviceId.trim()) {
            setErrorMessage(t('服务项目是必填项'));
            return;
        }

        if (!phone.trim()) {
            setErrorMessage(t('电话号码是必填项'));
            return;
        }
        if (!/^\d{10}$/.test(phone.trim())) {
            setErrorMessage(t('请输入有效的10位电话号码'));
            return;
        }

        try {
            const combinedDateTime = new Date(date);
            combinedDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
            const formattedAppointmentDate = format(combinedDateTime, "yyyy-MM-dd'T'HH:mm:ssxxx");
            const appointmentData = {
                salonId: id,
                appointmentDate: formattedAppointmentDate,
                serviceId,
                serviceName,
                serviceDescription,
                servicePrice,
                serviceDuration,
                tempClient: {
                    firstName: tempClientFirstName,
                    lastName: tempClientLastName,
                    phone: tempClientPhone,
                    email: tempClientEmail
                },
                categoryId,
                status: 'confirmed',
                note,
                employeeId: employeeId?._id
            };

            if (isEditing && selectedAppointment) {
                updateAppointment(
                    { ...appointmentData, _id: selectedAppointment._id },
                    {
                        onSuccess: () => {
                            // 预约数据的重新获取由 AllAppointment 处理
                        }
                    }
                );
            } else {
                createAppointment(appointmentData, {
                    onSuccess: () => {
                        // 预约数据的重新获取由 AllAppointment 处理
                    }
                });
            }
            setAddModalVisible(false);
            setEditModalVisible(false);
            setErrorMessage(null);
        } catch (error) {
            console.error('保存预约时出错:', error);
            setErrorMessage(t('保存预约失败。请稍后再试。'));
        }
    }, [
        tempClientFirstName,
        tempClientLastName,
        serviceId,
        phone,
        date,
        time,
        employeeId,
        serviceName,
        serviceDescription,
        servicePrice,
        serviceDuration,
        tempClientPhone,
        tempClientEmail,
        categoryId,
        note,
        id,
        isEditing,
        selectedAppointment,
        updateAppointment,
        createAppointment,
        t
    ]);

    // 确认删除预约
    const handleDeleteConfirm = useCallback(async (appointmentId: string) => {
        try {
            deleteAppointment(appointmentId, {
                onSuccess: () => {
                    setDeleteModalVisible(false);
                    setAppointmentIdToDelete(null);
                    // 预约数据的重新获取由 AllAppointment 处理
                },
                onError: () => {
                    setErrorMessage(t('删除预约失败。请稍后再试。'));
                }
            });
        } catch (error) {
            console.error('删除预约时出错:', error);
            setErrorMessage(t('删除预约失败。请稍后再试。'));
        }
    }, [deleteAppointment, t]);

    // 取消删除预约
    const handleDeleteCancel = useCallback(() => {
        setDeleteModalVisible(false);
        setAppointmentIdToDelete(null);
    }, []);

    // 触发删除预约
    const handleDeleteAppointment = useCallback((appointmentId: string) => {
        setAppointmentIdToDelete(appointmentId);
        setDeleteModalVisible(true);
    }, []);

    // 处理编辑预约
    const handleEditAppointment = useCallback((appointment: Appointment) => {
        setAppointmentId(appointment._id);
        setCategoryId(appointment.categoryId || '');
        setServiceId(typeof appointment.serviceId === 'string' ? appointment.serviceId : appointment.serviceId?._id || '');
        setServiceName(appointment.serviceName || '');
        setServiceDescription(appointment.serviceDescription || '');
        setServicePrice(appointment.servicePrice || 0);
        setPhone(appointment.tempClient?.phone || '');
        setDate(parseISO(appointment.appointmentDate));
        setTime(parseISO(appointment.appointmentDate));
        setEmployeeId(appointment.employeeId || null);
        setNote(appointment.note || '');
        setEmployeeName(`${appointment.employeeId?.firstName || ''} ${appointment.employeeId?.lastName || ''}`);
        setServiceDuration(appointment.serviceDuration || 0);
        setTempClientFirstName(appointment.tempClient?.firstName || '');
        setTempClientLastName(appointment.tempClient?.lastName || '');
        setTempClientPhone(appointment.tempClient?.phone || '');
        setTempClientEmail(appointment.tempClient?.email || '');
        setSelectedAppointment(appointment);
        setIsEditing(true);
        setEditModalVisible(true);
    }, []);

    // 选择员工进行过滤
    const handleEmployeeSelect = useCallback((employeeId: string | 'all') => {
        setSelectedEmployeeId(employeeId);
    }, []);

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

    const salon = salons?.find(salon => salon._id === id);

    return (
        <LinearGradient
            colors={[
                '#FFDEE9',
                '#B5FFFC',
                '#D4FFEA',
                '#E9FFFE',
                '#FFF4E0',
                '#FFDDC1',
            ]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
        >
            <AllAppointment salonId={id} selectedEmployeeId={selectedEmployeeId}>
                {({ items, isLoading, error, employees }) => (
                    <>
                        <Agenda
                            items={items}
                            loadItemsForMonth={() => { /* AllAppointment 已经处理数据加载 */ }}
                            selected={selectedDate}
                            onDayPress={(day: DateObject) => {
                                setSelectedDate(day.dateString);
                            }}
                            renderItem={(item: Appointment, firstItemInDay: boolean) => (
                                <AppointmentCardModal
                                    key={item._id}
                                    appointment={item}
                                    onEdit={handleEditAppointment}
                                    onDelete={handleDeleteAppointment}
                                />
                            )}
                            renderEmptyDate={() => (
                                <StyledView className="flex-1 justify-center items-center p-5">
                                    <StyledText className="text-center text-gray-500">
                                        {t('当天没有预约')}
                                    </StyledText>
                                </StyledView>
                            )}
                            renderEmptyData={() => (
                                <StyledView className="flex-1 justify-center items-center p-5">
                                    <StyledText className="text-center text-gray-500">
                                        {t('请选择一个日期')}
                                    </StyledText>
                                </StyledView>
                            )}
                            theme={calendarTheme}
                            style={{
                                backgroundColor: 'transparent',
                                shadowColor: 'black',
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.2,
                                shadowRadius: 10,
                                elevation: 5,
                            }}
                        />

                        {/* 员工选择器 */}
                        <EmployeeSelector
                            employees={employees}
                            selectedEmployeeId={selectedEmployeeId}
                            onSelect={handleEmployeeSelect}
                        />

                        {/* 删除预约模态框 */}
                        <DeleteAppointModal
                            visible={deleteModalVisible}
                            appointmentId={appointmentIdToDelete}
                            onConfirm={handleDeleteConfirm}
                            onCancel={handleDeleteCancel}
                        />

                        {/* 添加预约模态框 */}
                        {addModalVisible && (
                            <AppointmentModal
                                visible={addModalVisible}
                                closeModal={() => setAddModalVisible(false)}
                                newAppointment={{
                                    clientFirstName: tempClientFirstName,
                                    clientLastName: tempClientLastName,
                                    serviceId,
                                    serviceName,
                                    serviceDuration,
                                    phone,
                                    date,
                                    time,
                                    employeeName,
                                    note
                                }}
                                setNewAppointment={setAppointmentId} // 确保你有这个状态更新函数
                                errorMessage={errorMessage}
                                services={services} // 确保 services 结构正确
                                categories={categories}
                                employees={employees}
                                handleSaveAppointment={handleSaveAppointment}
                                handleServiceSelect={() => { /* 定义此函数 */ }}
                                handleEmployeeSelect={handleEmployeeSelect}
                                serviceModalVisible={serviceModalVisible}
                                setServiceModalVisible={setServiceModalVisible}
                                employeeModalVisible={employeeModalVisible}
                                setEmployeeModalVisible={setEmployeeModalVisible}
                                selectedDate={selectedDate}
                                setShowDatePicker={() => { /* 根据需要定义 */ }}
                                showDatePicker={false} // 根据需要定义状态
                                showTimePicker={false} // 根据需要定义状态
                                setShowTimePicker={() => { /* 根据需要定义 */ }}
                                formatTime={(date: Date) => format(date, 'HH:mm')} // 示例格式化函数
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                loadingEmployees={isLoading} // 根据实际加载状态调整
                                employeeError={error} // 根据实际错误状态调整
                            />
                        )}

                        {/* 编辑预约模态框 */}
                        {editModalVisible && selectedAppointment && (
                            <AppointmentDetailsModal
                                visible={editModalVisible}
                                appointment={selectedAppointment}
                                onClose={() => setEditModalVisible(false)}
                                onSave={handleSaveAppointment}
                                // 传递其他必要的 props
                            />
                        )}
                        {/* 根据需要添加其他模态框 */}
                    </>
                )}
            </AllAppointment>
        </LinearGradient>
    );
};

export default memo(SalonAppointments);
