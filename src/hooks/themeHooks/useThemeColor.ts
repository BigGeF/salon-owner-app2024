/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import {useColorScheme} from 'nativewind';

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors
) {
    const {colorScheme} = useColorScheme();

    if (colorScheme === 'light'){
        return props.light ? props.light : Colors[colorName].light;
    }else{
        return props.dark ? props.dark : Colors[colorName].dark;
    }
}
