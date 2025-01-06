import { useState } from 'react';
import { createEmployee } from '@/api/employeeAPI';
import { Employee } from '@/types';
import {MutationStatus} from "@tanstack/react-query";

export const useCreateEmployee = () => {
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<MutationStatus>('idle');

    const handleCreateEmployee = async (salonId: string, employeeData: Partial<Employee>) => {
        setStatus('pending');
        try {
            return await createEmployee(salonId, employeeData);
        } catch (err: any) {
            setStatus('error');
            setError(err.message || 'Failed to create employee');
            throw err;
        } finally {
            setStatus('idle');
        }
    };

    return { handleCreateEmployee, status, error };
};
