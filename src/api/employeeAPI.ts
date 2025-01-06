import api from './api';
import { Employee } from '@/types';

export const createEmployee = async (salonId: string, employeeData: Partial<Employee>) => {
    try {
        const response = await api.post(`/employees`, { salonId, ...employeeData });
        return response.data;
    } catch (error) {

        throw error;
    }
};

export const getAllEmployees = async () => {
    try {
        const response = await api.get(`/employees`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getEmployeeById = async (employeeId: string) => {
    try {
        const response = await api.get(`/employees/${employeeId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateEmployee = async (employeeId: string, updatedData: Partial<Employee>) => {
    try {
        const response = await api.put(`/employees/${employeeId}`, updatedData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteEmployee = async (employeeId: string) => {
    try {
        const response = await api.delete(`/employees/${employeeId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getEmployeesBySalonId = async (salonId: string) => {
    try {
        const response = await api.get(`/employees/salons/${salonId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
