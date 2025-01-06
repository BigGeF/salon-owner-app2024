//salon-owner-app/app/(tabs)/home/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthStack() {
    return (
        <Stack screenOptions={{ headerShown: false}}>
            <Stack.Screen name="loading" options={{ headerShown: false}}/>
            <Stack.Screen name="splash" options={{ headerShown: false}}/>
            <Stack.Screen name="check-email" options={{ title: 'Enter Email', headerShown: false,}}/>
            <Stack.Screen name="check-password" options={{ title: 'Enter Password', headerShown: false,}}/>
        </Stack>
    );
}
