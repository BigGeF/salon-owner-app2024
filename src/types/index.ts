export interface Salon {
    _id: string;
    ownerUid: string;
    name: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    contact: {
        phone: string;
        email: string;
    };
    employees: string[];
    services: string[];
}

export interface Owner {
    _id: string;
    firebaseUid:string
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
    role: string;
    __v: number;
}

export interface Client {
    _id: string;
    firstName: string;
    lastName?: string;
    email?: string;
    phone: string;
    role: string;
    salonId: string;
}

export interface Service {
    _id: string;
    salonId: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    duration: number; // In minutes
}

export interface ServiceAndCat {
    _id: string;
    salonId: string;
    categoryId: {
        _id: string;
        salonId: string;
        name: string;
    };
    name: string;
    description: string;
    price: number;
    duration: number; // In minutes
}

export interface Employee {
    _id: string;
    salonId: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: string;
    schedule: {
        day: string;
        startTime: string; // For example, "09:00"
        endTime: string;   // For example, "17:00"
    }[];
}

export interface Appointment {
    _id: string;
    salonId: string;
    appointmentDate: string;
    type: 'walk-in' | 'return-client' | 'new-client';
    employee?: {
        id?: string;
        firstName: string;
        lastName: string;
    };
    service: {
        id: string;
        name: string;
        price: number;
        duration: number;
    };
    client: {
        id?: string;
        firstName: string;
        lastName?: string;
        phone: string;
    }
    note?: string;
    status: 'confirmed' | 'cancelled' | 'completed';
    paymentId?: string;
    createdAt?: string;
    updatedAt?: string;
}

// export interface Appointment {
//     _id: string;
//     salonId: string;
//     employeeId:  string;
//     employeeFullName:string;
//     serviceId: string;
//     serviceName: string;
//     serviceDescription: string;
//     servicePrice: number;
//     serviceDuration: number; // In minutes
//     appointmentDate: string; // The full date of the appointment
//     status: 'confirmed' | 'cancelled' | 'completed';
//     paymentId: string;
//     clientId?: string;
//     categoryId?: string;
//     tempClient?: {
//       firstName: string;
//       lastName?: string;
//       phone: string;
//       email?: string;
//     };
//     note?: string;
//     employeeName?:string
// }

export interface Category {
    _id: string;
    salonId: string;
    name: string;
}

export interface UserConfig {
    language: string;
    theme: 'light' | 'dark' | 'automatic';
    // Add more settings later, such as notification preferences, font size, etc.
    // notificationsEnabled?: boolean;
}
