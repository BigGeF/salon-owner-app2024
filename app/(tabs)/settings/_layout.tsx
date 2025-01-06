import { Stack } from 'expo-router';

export default function HomeStack() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false, title: "Settings" }} />
            <Stack.Screen name="my-salons" options={{ headerShown: false, title: "My Salons" }} />
            <Stack.Screen name="add-edit-salon" options={{ title: 'Salon Details' }} />
            <Stack.Screen name="owner-profile" options={{ headerShown: false, title: 'Owner Profile' }} />
        </Stack>
    );
}
