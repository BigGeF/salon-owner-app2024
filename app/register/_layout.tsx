//salon-owner-app/app/(tabs)/home/_layout.tsx
import { Stack } from 'expo-router';

export default function RegisterStack() {
    return (
        <Stack screenOptions={{ headerShown: false}}>
            <Stack.Screen name="register-account" options={{ headerShown: false}}/>
        </Stack>
    );
}
