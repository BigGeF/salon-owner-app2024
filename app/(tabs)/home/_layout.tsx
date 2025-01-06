// salon-owner-app/app/(tabs)/home/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

export default function HomeStack() {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="salon-home"
                    options={{
                    title: 'Home Screen', headerShown: false
                    }}
                />
                <Stack.Screen
                    name="salon-details"
                    options={{
                      title: 'Salon Details', headerShown: false
                    }}
                />
                <Stack.Screen
                    name="service-menu"
                    options={{
                    title: 'Services',  headerShown: false
                    }}
                />
                <Stack.Screen
                    name="appointments/get-appointments"
                    options={{
                    title: 'Appointments', headerShown: false
                    }}
                />
                <Stack.Screen
                    name="appointments/add-edit-appointment"
                    options={{
                      title: 'Add/Edit Appointment', headerShown: false
                    }}
                />
                <Stack.Screen
                    name="add-edit-employees"
                    options={{
                    title: 'Employees', headerShown: false
                    }}
                />
                <Stack.Screen
                    name="clients"
                    options={{
                      title: 'Clients', headerShown: false
                    }}
                />
            </Stack>
        </>
    );
}

// salon-owner-app/app/(tabs)/home/_layout.tsx