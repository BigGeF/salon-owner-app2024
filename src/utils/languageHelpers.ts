export const getLanguageName = (languageCode: string): string => {
    // Define a mapping of language codes to language names
    const languageMap: { [key: string]: string } = {
        en: 'English',
        es: 'Español',
        fr: 'French',
        de: 'German',
        it: 'Italian',
        pt: 'Portuguese',
        zh: '中文',
        ja: 'Japanese',
        ko: 'Korean',
        ru: 'Russian',
        ar: 'Arabic',
        hi: 'Hindi',
        bn: 'Bengali',
        pa: 'Punjabi',
        ta: 'Tamil',
        te: 'Telugu',
        vi: 'Tiếng Việt',
        tr: 'Turkish',
        // Add more languages as needed
    };

    // Return the corresponding language name or a default value if not found
    return languageMap[languageCode] || 'Unknown Language';
};