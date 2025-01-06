import { ColorSchemeName } from 'react-native';

export const applyTheme = (
    itemValue: 'light' | 'dark' | 'automatic',
    phoneTheme: ColorSchemeName,
    setColorScheme: (scheme: 'light' | 'dark') => void
) => {
    if (itemValue === 'automatic') {
        if (phoneTheme === 'light') {
            setColorScheme('light');
        } else if (phoneTheme === 'dark') {
            setColorScheme('dark');
        }
    } else {
        setColorScheme(itemValue);
    }
};
