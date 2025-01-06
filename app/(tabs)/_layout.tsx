import React from 'react';
import { Tabs } from 'expo-router';
import ThemedIcon from "../../src/components/themed/ThemedIcon";
import {useThemeColor} from "../../src/hooks/themeHooks/useThemeColor";

export default function TabsLayout() {

    const tabTextThemeColor = useThemeColor({}, 'inputPlaceholderText');
    const tabBgThemeColor = useThemeColor({}, 'navTabBackground');

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: tabTextThemeColor,  // Color for active tab icons and text
                tabBarInactiveTintColor: 'gray', // Color for inactive tab icons and text
                headerShown: false,              // Hides the header if not needed
                tabBarShowLabel: true,           // Shows labels for tabs
                tabBarLabelStyle: {
                    fontWeight: '600',
                    fontSize: 12
                },
                tabBarStyle: {
                    backgroundColor: tabBgThemeColor,    // Background color of the tab bar
                    borderTopColor: 'transparent', // Optional: Removes the top border color
                    height: 60,
                    paddingBottom: 5,
                    paddingTop: 5
                },
            }}
        >
       
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <ThemedIcon iconType='ant' name="home" size={28} lightColor={focused ? 'black' : 'gray'} darkColor={focused? 'white' : 'gray'}/>,
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ focused }) => <ThemedIcon iconType='ant' name="setting" size={28} lightColor={focused ? 'black' : 'gray'} darkColor={focused? 'white' : 'gray'}/>,
                }}
            />
        </Tabs>
    );
}




// import React from 'react';
// import { Tabs } from 'expo-router';
// import ThemedIcon from "../../src/components/themed/ThemedIcon";
// import { useThemeColor } from "../../src/hooks/themeHooks/useThemeColor";

// export default function TabsLayout() {
//     const tabTextThemeColor = useThemeColor({}, 'inputPlaceholderText');
//     const tabBgThemeColor = useThemeColor({}, 'navTabBackground');

//     return (
//         <Tabs
//             screenOptions={{
//                 tabBarActiveTintColor: tabTextThemeColor,  // Color for active tab icons and text
//                 tabBarInactiveTintColor: 'gray', // Color for inactive tab icons and text
//                 headerShown: false,              // Hides the header if not needed
//                 tabBarShowLabel: true,           // Shows labels for tabs
//                 tabBarLabelStyle: {
//                     fontWeight: '600',
//                     fontSize: 12
//                 },
//                 tabBarStyle: {
//                     backgroundColor: tabBgThemeColor,    // Background color of the tab bar
//                     borderTopColor: 'transparent', // Optional: Removes the top border color
//                     height: 60,
//                     paddingBottom: 5,
//                     paddingTop: 5
//                 },
//             }}
//         >
//             <Tabs.Screen
//                 name="home"
//                 options={{
//                     title: 'Home',
//                     tabBarIcon: ({ focused }) => (
//                         <ThemedIcon
//                             iconType='ant'
//                             name="home"
//                             size={28}
//                             lightColor={focused ? 'black' : 'gray'}
//                             darkColor={focused ? 'white' : 'gray'}
//                         />
//                     ),
//                 }}
//             />

//             <Tabs.Screen
//                 name="settings"
//                 options={{
//                     title: 'Settings',
//                     tabBarIcon: ({ focused }) => (
//                         <ThemedIcon
//                             iconType='ant'
//                             name="setting"
//                             size={28}
//                             lightColor={focused ? 'black' : 'gray'}
//                             darkColor={focused ? 'white' : 'gray'}
//                         />
//                     ),
//                 }}
//             />

//             <Tabs.Screen
//                 name="ai-assistance"
//                 options={{
//                     title: 'AI Assistance',
//                     tabBarIcon: ({ focused }) => (
//                         <ThemedIcon
//                             iconType='ant'
//                             name="direction"
//                             size={28}
//                             lightColor={focused ? 'black' : 'gray'}
//                             darkColor={focused ? 'white' : 'gray'}
//                         />
//                     ),
//                 }}
//             />
//         </Tabs>
//     );
// }