import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback } from 'react';
import { useCategoriesQuery } from '@/hooks/categoryHooks/useCategoriesQuery';
import { Category } from '@/types';

interface CategoriesContextType {
    categories: Category[];
    refetchCategories: () => void;
    categoriesIsLoading: boolean;
    isCategoriesError: boolean;
    categoriesError: Error | null;
    setSalonIdInCategories: (id: string) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [salonId, setSalonIdInCategories] = useState<string>('');
    const { data: categories = [], refetch: refetchCategoriesRaw, isLoading: categoriesIsLoading, isError: isCategoriesError, error: categoriesError } = useCategoriesQuery();

    // Memoize the refetchCategories function
    const refetchCategories = useCallback(() => {
        refetchCategoriesRaw();
    }, [refetchCategoriesRaw]);

    // Memoize the setSalonIdInCategories function
    const setSalonId = useCallback((id: string) => {
        setSalonIdInCategories(id);
    }, []);

    useEffect(() => {
        if (salonId) {
            refetchCategories();
        }
    }, [salonId, refetchCategories]);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        categories,
        refetchCategories,
        categoriesIsLoading,
        isCategoriesError,
        categoriesError,
        setSalonIdInCategories: setSalonId,
    }), [categories, refetchCategories, categoriesIsLoading, isCategoriesError, categoriesError, setSalonId]);

    return (
        <CategoriesContext.Provider value={contextValue}>
            {children}
        </CategoriesContext.Provider>
    );
};

export const useCategoriesContext = () => {
    const context = useContext(CategoriesContext);
    if (context === undefined) {
        throw new Error('useCategoriesContext must be used within a CategoriesProvider');
    }
    return context;
};
