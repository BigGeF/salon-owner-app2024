// AppContextProvider.tsx

// Providers
// import {OwnerProvider} from "@/context/OwnerContext";
import {SalonProvider} from "@/context/SalonContext";
import {DefaultSalonIdProvider} from "@/context/DefaultSalonIdContext";
import {ServiceProvider} from "@/context/ServicesContext";
import {CategoriesProvider} from "@/context/CategoriesContext";
import {ClientProvider} from "@/context/ClientContext";
import {AppointmentProvider} from "@/context/Appointment/AppointmentContext";
import {EmployeesProvider} from "@/context/EmployeesContext";
import {RegistrationProvider} from "@/context/RegistrationContext";
import {AuthProvider} from "@/context/AuthContext";
import {combineComponents} from "@/utils/combineComponents";
// import {OwnerIdProvider} from "@/context/OwnerIdContext";
import {UserConfigProvider} from "@/context/UserConfigContext";
import {SelectedAppointmentProvider} from "@/context/Appointment/SelectedAppointmentContext";

const providers = [
    RegistrationProvider,
    AuthProvider,
    // OwnerIdProvider,
    UserConfigProvider,
    // OwnerProvider,
    SalonProvider,
    DefaultSalonIdProvider,
    ServiceProvider,
    CategoriesProvider,
    ClientProvider,
    AppointmentProvider,
    EmployeesProvider,
    SelectedAppointmentProvider
]
export const AppContextProvider = combineComponents(...providers);