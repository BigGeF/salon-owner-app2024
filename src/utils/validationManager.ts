import { useState, useCallback } from 'react';

// Define a type for the combined validation and error message configuration
type ValidationConfig<T> = {
    [K in keyof T]: {
        validate: (value: T[K]) => boolean;
        errorMessage: string;
    };
};

// Generic types for errors
type ValidationErrors<T> = {
    [K in keyof T]?: string;
};

export const useValidationManager = <T extends Record<string, any>>() => {
    // State to store errors
    const [errors, setErrors] = useState<ValidationErrors<T>>({});
    // State to store the validation configuration
    const [config, setConfig] = useState<ValidationConfig<T> | null>(null);

    // Function to set the validation configuration
    const configureValidation = useCallback((validationConfig: ValidationConfig<T>) => {
        setConfig(validationConfig);
    }, []);

    // Function to validate a single field
    const validateField = useCallback(
        (key: keyof T, value: T[keyof T]) => {
            if (!config) {
                console.warn('Validation configuration has not been set.');
                return '';
            }

            const { validate, errorMessage } = config[key];
            if (!validate(value)) {
                setErrors((prevErrors) => ({ ...prevErrors, [key]: errorMessage }));
                return errorMessage;
            } else {
                setErrors((prevErrors) => {
                    const newErrors = { ...prevErrors };
                    delete newErrors[key]; // Use delete to remove the key safely
                    return newErrors;
                });
                return '';
            }
        },
        [config]
    );

    // Function to validate all fields at once
    const validateAllFields = useCallback(
        (data: T) => {
            if (!config) {
                console.warn('Validation configuration has not been set.');
                return false;
            }

            let newErrors: ValidationErrors<T> = {};
            let hasError = false;

            for (const key in config) {
                const { validate, errorMessage } = config[key];
                if (!validate(data[key])) {
                    newErrors[key] = errorMessage;
                    hasError = true;
                }
            }

            setErrors(newErrors);
            return !hasError;
        },
        [config]
    );

    // Adjusted handleBlur function to not rely on the event object
    const handleBlur = useCallback(
        (key: keyof T, value: T[keyof T]) => {
            validateField(key, value);  // Pass value directly
        },
        [validateField]
    );

    // Function to reset all errors while preserving configuration
    const resetErrors = useCallback(() => {
        if (config) {
            const newErrors: ValidationErrors<T> = {};
            setErrors(newErrors);
        }
    }, [config]);

    return {
        errors,
        configureValidation,
        validateField,
        validateAllFields,
        handleBlur,
        resetErrors, // Expose the resetErrors function
    };
};
