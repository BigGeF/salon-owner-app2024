import { useState, useEffect } from 'react';
import api from '@/api/api';
import { Employee } from '@/types';

export const useGetEmployeesBySalonId = (salonId: string, refreshKey: number) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/employees?salonId=${salonId}`);
                setEmployees(response.data);
            } catch (err) {
                setError('Failed to fetch employees');
            } finally {
                setLoading(false);
            }
        };

        void fetchEmployees();
    }, [salonId, refreshKey]);
    
    return { employees, loading, error };
};
