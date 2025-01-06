// validationHelpers.ts
import { countryCodes } from './countryCodes';

// Utility function for checking error visibility
export const isErrorVisible = (error?: string): boolean => !!error && error.trim() !== '';


// -------------- String rules -------------------
// If minLength is included, text must be at least minLength characters long
// If no minLength included, text must be at least 1 character long
export const validateString = (text: string, minLength: number = 2) : boolean => {
    return text.trim().length >= minLength;
};


// -------------- Mobile Number rules -------------------
// Must consist only of digits (0-9).
// Must be between 10 and 15 characters long (inclusive).
// No letters, special characters, or spaces are allowed.
export const validateMobileNumber = (number: string) : boolean => {
    const re = /^[0-9]{10,15}$/; // Adjust regex as needed
    return re.test(number);
};


// -------------- Password rules -------------------
// Must contain at least one letter (either uppercase or lowercase).
// Must contain at least one digit (0-9).
// Must be at least 8 characters long.
// Can only contain letters (A-Z, a-z) and digits (0-9); no special characters are allowed.
export const validatePassword = (password: string) : boolean => {
    //const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const re = /^[A-Za-z\d]{8,16}$/;
    return re.test(password);
};


// -------------- Email rules -------------------
// Must contain one or more characters, followed by @ plus one or more characters
// followed by . plus one or more characters
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


// Validation function to check if the countryCode is valid
export const validateCountryCode = (countryCode: string): boolean => {
    return countryCodes.some(country => country.dialCode === countryCode);
};