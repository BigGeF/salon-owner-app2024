import api from './api';
import { Client } from '@/types';
import {AxiosRequestConfig} from "axios";

// Function to add a client by salon ID
export const addClientBySalonId = async (salonId: string, clientData: Partial<Client>): Promise<Client> => {
    //console.log("Sending Add Client Request from ClientAPI");

    try {
        const response = await api.post('/clients', {
            salonId,
            ...clientData,
        });
        return response.data;
    } catch (error) {
        console.error('Error adding client:', error);
        throw new Error('Network response was not ok');
    }
};

// Function to get services by salon ID
export const getClientsBySalonId = async (salonId: string) => {
    //console.log("Sending Clients Request from ClientAPI");
    try {
        const response = await api.get(`/clients/salon/${salonId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching clients:', error);
        throw new Error('Network response was not ok, from ClientAPI.ts file');
    }
};

// Function to edit a client by salon ID
export const updateClientBySalonId = async (salonId: string, clientId: string, clientData: Partial<Client>): Promise<Client> => {
    //console.log("Sending Edit Client Request from ClientAPI");

    try {
        const response = await api.put(`/clients/${clientId}`, {
            salonId,
            ...clientData,
        });
        return response.data;
    } catch (error) {
        console.error('Error editing client:', error);
        throw new Error('Network response was not ok');
    }
};

// Function to delete a client by salon ID
export const deleteClientBySalonId = async (salonId: string, clientId: string): Promise<any> => {
    //console.log("Sending Delete Client Request from ClientAPI");

    try {
        const requestConfig: AxiosRequestConfig = {};
        requestConfig.data = { salonId: salonId };
        const response = await api.delete(`/clients/${clientId}`, requestConfig);
        return response.data;
    } catch (error) {
        console.error('Error deleting client:', error);
        throw new Error('Network response was not ok');
    }
};