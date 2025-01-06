import 'intl-pluralrules';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './src/locales/en.json';
import es from './src/locales/es.json';
import zh from './src/locales/zh.json';
import vi from './src/locales/vi.json';

const resources = {
  en: {
    translation: en
  },
  zh: {
    translation: zh
  },
  es: {
    translation: es
  },
  vi: {
    translation: vi
  }
  // en: {
  //   translation: {
  //     "salon": {
  //       "details": "Salon Details"
  //     },
  //     "Phone": "Phone",
  //     "Note": "Note",
  //     "Select Service": "Select Service",
  //     "Select Employee": "Select Employee",
  //     "Date & Time": "Date & Time",
  //     "Add Appointment": "Add Appointment",
  //     "Salon Details": "Salon Details",
  //     "Add/Edit Salon": "Add/Edit Salon",
  //     "Services": "Services",
  //     "Appointments": "Appointments",
  //     "Employees": "Employees",
  //     "Please select a date": "Please select a date",
  //     "Service Price": "Service Price",
  //     "Client Name": "Client Name",
  //     "Search services": "Search services",
  //     "Save Appointment": "Save Appointment",
  //     "Cancel": "Cancel",
  //     "Loading": "Loading",
  //     "Error loading employees": "Error loading employees",
  //     "Pick a date": "Pick a date"
  //   }
  // },
  // zh: {
  //   translation: {
  //     "Phone": "电话",
  //     "Note": "备注",
  //     "Select Service": "选择服务",
  //     "Select Employee": "选择员工",
  //     "Date & Time": "日期与时间",
  //     "Add Appointment": "添加预约",
  //     "Salon Details": "沙龙详情",
  //     "Add/Edit Salon": "添加/编辑沙龙",
  //     "Services": "服务",
  //     "Appointments": "预约",
  //     "Employees": "员工",
  //     "Please select a date": "请选择一个日期",
  //     "Service Price": "服务价格",
  //     "Client Name": "客户姓名",
  //     "Search services": "搜索服务",
  //     "Save Appointment": "保存预约",
  //     "Cancel": "取消",
  //     "Loading": "加载中",
  //     "Error loading employees": "加载员工时出错",
  //     "Pick a date": "选择日期",
  //   }
  // },
  // vi: {
  //   translation: {
  //     "Phone": "Điện thoại",
  //     "Note": "Ghi chú",
  //     "Select Service": "Chọn dịch vụ",
  //     "Select Employee": "Chọn nhân viên",
  //     "Date & Time": "Ngày & Giờ",
  //     "Add Appointment": "Thêm cuộc hẹn",
  //     "Salon Details": "Chi tiết Salon",
  //     "Add/Edit Salon": "Thêm/Chỉnh sửa Salon",
  //     "Services": "Dịch vụ",
  //     "Appointments": "Cuộc hẹn",
  //     "Employees": "Nhân viên",
  //     "Please select a date": "Vui lòng chọn một ngày",
  //     "Service Price": "Giá dịch vụ",
  //     "Client Name": "Tên khách hàng",
  //     "Search services": "Tìm kiếm dịch vụ",
  //     "Save Appointment": "Lưu cuộc hẹn",
  //     "Cancel": "Hủy",
  //     "Loading": "Đang tải",
  //     "Error loading employees": "Lỗi khi tải nhân viên",
  //     "Pick a date": "Chọn ngày",
  //   }
  // },
  // es: {
  //   translation: es,
  //   translation: {
  //     "Phone": "Teléfono",
  //     "Note": "Nota",
  //     "Select Service": "Seleccionar servicio",
  //     "Select Employee": "Seleccionar empleado",
  //     "Date & Time": "Fecha y hora",
  //     "Add Appointment": "Agregar cita",
  //     "Salon Details": "Detalles del salón",
  //     "Add/Edit Salon": "Agregar/Editar salón",
  //     "Services": "Servicios",
  //     "Appointments": "Citas",
  //     "Employees": "Empleados",
  //     "Please select a date": "Por favor seleccione una fecha",
  //     "Service Price": "Precio del servicio",
  //     "Client Name": "Nombre del cliente",
  //     "Search services": "Buscar servicios",
  //     "Save Appointment": "Guardar cita",
  //     "Cancel": "Cancelar",
  //     "Loading": "Cargando",
  //     "Error loading employees": "Error al cargar empleados",
  //     "Pick a date": "Seleccione una fecha",
  //   }
  // },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // 默认语言
    fallbackLng: 'en', // 当无法找到翻译时的回退语言

    interpolation: {
      escapeValue: false // react already safes from xss
    },

  });

export default i18n;
