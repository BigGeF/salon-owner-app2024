import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';

interface RegistrationData {
    email?: string;
    password?: string;
    [key: string]: any;
}

interface RegistrationContextProps {
    registrationData: RegistrationData;
    setRegistrationData: (data: RegistrationData) => void;
}

export const RegistrationContext = createContext<RegistrationContextProps | undefined>(undefined);

export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [registrationData, setRegistrationDataRaw] = useState<RegistrationData>({});

    // Memoize the setRegistrationData function
    const setRegistrationData = useCallback((data: RegistrationData) => {
        setRegistrationDataRaw(prevData => ({ ...prevData, ...data }));
    }, []);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        registrationData,
        setRegistrationData,
    }), [registrationData, setRegistrationData]);

    return (
        <RegistrationContext.Provider value={contextValue}>
            {children}
        </RegistrationContext.Provider>
    );
};

export const useRegistration = (): RegistrationContextProps => {
    const context = useContext(RegistrationContext);
    if (!context) {
        throw new Error('useRegistration must be used within a RegistrationProvider');
    }
    return context;
};
