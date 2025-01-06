import {useState} from "react";
import { deleteEmployee } from '@/api/employeeAPI';
import {MutationStatus} from "@tanstack/react-query";

export const useDeleteEmployee = () => {
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<MutationStatus>('idle');

    const useHandleDeleteEmployee = async (employeeId: string) => {
        setStatus('pending');

        try {
            await deleteEmployee(employeeId);
        } catch (err: any) {
            setStatus('error');
            setError(err.message || 'Failed to delete employee');
            throw err;
        } finally {
            setStatus('pending');
        }
    };

    return { useHandleDeleteEmployee, status, error };
}