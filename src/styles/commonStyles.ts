
export const calendarTheme = (mode: 'dark' | 'light') => {
    const darkTheme = {
        selectedDayBackgroundColor: 'blue',
        selectedDayTextColor: 'white',
        todayTextColor: '#FF5722',
        dayTextColor: '#ffffff',
        dotColor: '#FF5722',
        selectedDotColor: '#ffffff',
        arrowColor: '#FF5722',
        monthTextColor: '#ffffff',
        textDayFontWeight: '300' as '300' | 'bold' | 'normal',
        textMonthFontWeight: 'bold' as 'bold' | 'normal',
        textDayHeaderFontWeight: '500' as '500' | 'bold' | 'normal',
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 16,
        backgroundColor: '#121212',
        calendarBackground: '#121212',
    };

    const lightTheme = {
        selectedDayBackgroundColor: 'blue',
        selectedDayTextColor: 'white',
        todayTextColor: 'red',
        dayTextColor: 'black',
        dotColor: 'pink',
        selectedDotColor: 'yellow',
        arrowColor: 'pink',
        monthTextColor: 'gray',
        textDayFontWeight: '300' as '300' | 'bold' | 'normal',
        textMonthFontWeight: 'bold' as 'bold' | 'normal',
        textDayHeaderFontWeight: '500' as '500' | 'bold' | 'normal',
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 16,
        backgroundColor: '#ffffff',
        calendarBackground: '#ffffff',
    };

    return mode === 'dark' ? darkTheme : lightTheme;
};