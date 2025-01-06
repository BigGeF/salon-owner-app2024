import { Service } from '@/types';
import {AxiosRequestConfig} from 'axios';
import api from './api';

// Function to get services by salon ID
export const getServicesBySalonId = async (salonId: string) => {
    //console.log("Sending Services Request from ServiceAPI");

    try {
        const response = await api.get(`/services/salon/${salonId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching services:', error);
        throw new Error('Network response was not ok, from servicesAPI.ts file');
    }
};

// Function to add a service by owner ID
export const addServiceByOwnerId = async (salonId: string, serviceData: Partial<Service>) => {
    //console.log("Sending Add Service Request from ServicesAPI");

    try {
        const response = await api.post('/services/', {
            salonId,
            ...serviceData,
        });
        return response.data;
    } catch (error) {
        console.error('Error adding service:', error);
        throw new Error('Network response was not ok');
    }
};

// Function to update a service by service ID
export const updateServiceById = async (salonId: string, serviceId: string, serviceData: Partial<Service>) => {
    //console.log("Sending Update Service Request from ServicesAPI");
    try {
        const response = await api.put(`/services/${serviceId}`, {
            salonId,
            serviceId,
            ...serviceData,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating service:', error);
        throw new Error('Network response was not ok');
    }
};

// Function to add a service by owner ID
export const deleteServiceById = async (salonId: string, serviceId: string) => {
    //console.log("Sending Delete Service Request from ServicesAPI");
    try {
        const requestConfig: AxiosRequestConfig = {};
        requestConfig.data = { salonId: salonId };
        const response = await api.delete(`/services/${serviceId}`, requestConfig);
        return response.data;
    } catch (error) {
        console.error('Error deleting service:', error);
        throw new Error('Network response was not ok');
    }
};

