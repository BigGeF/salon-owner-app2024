import { Appointment } from '@/types';
import api from './api'; // Ensure this import points to your axios instance configuration

// Function to get all appointments
export const getAllAppointments = async (): Promise<Appointment[]> => {
    try {
        const response = await api.get('/appointments');
        return response.data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw new Error('Network response was not ok, error from AppointmentAPI.ts file');
    }
};

// Function to get appointments by salon ID
export const getAppointmentsBySalonId = async (salonId: string, startDate?: string, endDate?: string): Promise<Appointment[]> => {
    
    try {
        // Build the base URL
        let url = `/appointments/salon/${salonId}`;

        // Check if startDate or endDate exist and append them as query parameters
        const queryParams = [];
        if (startDate) {
            queryParams.push(`startDate=${startDate}`);
        }
        if (endDate) {
            queryParams.push(`endDate=${endDate}`);
        }

        // If there are query parameters, append them to the URL
        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }

        // Make the API call
        const response = await api.get(url);
        
        
        return response.data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw new Error('Network response was not ok, error from AppointmentAPI.ts file');
    }
};

// Function to create an appointment
export const createAppointment = async (appointmentData: Partial<Appointment>): Promise<Appointment> => {
    console.log('From appointmentAPI Appointment Data:', appointmentData);

    try {
        const response = await api.post('/appointments', appointmentData);
        return response.data;
    } catch (error) {
        //const errorText = error.response ? error.response.data : error.message;
        //console.error('Response Status:', error.response ? error.response.status : 'unknown');
        console.error('Response Text:', error);
        //throw new Error(`Network response was not ok: ${error.response ? error.response.status : 'unknown'} - ${errorText}`);
        throw new Error('Network response was not ok');
    }
};

// Function to update an appointment
export const updateAppointment = async (appointmentData: Partial<Appointment>): Promise<Appointment> => {
    console.log("Appointment Data:  ", appointmentData);

    try {
        const response = await api.put(`/appointments/${appointmentData._id}`, appointmentData);
        return response.data;
    } catch (error) {
        console.error('Error updating appointment:', error);
        //throw new Error(`Network response was not ok: ${error.response ? error.response.status : 'unknown'}`);
        throw new Error('Network response was not ok');
    }
};

// Function to delete an appointment
export const deleteAppointment = async (appointmentId: string): Promise<void> => {
    try {
        const response = await api.delete(`/appointments/${appointmentId}`);

        // if (response.status !== 200) {
        //     throw new Error('Network response was not ok from appointmentApi delete!');
        // }
    } catch (error) {
        console.error('Error deleting appointment:', error);
        throw new Error('Network response was not ok from appointmentApi delete!');
    }
};
