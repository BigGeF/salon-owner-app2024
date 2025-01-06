import React, { useMemo, useCallback } from 'react';
import { Modal, View, TouchableOpacity, TouchableWithoutFeedback, type ModalProps } from 'react-native';
import { styled } from 'nativewind';
import { useThemeColor } from '@/hooks/themeHooks/useThemeColor';
import { Colors } from "@/constants/Colors";
import ThemedIcon from "./ThemedIcon";

// Define the props for ThemedModal, extending ModalProps for basic modal functionality
interface ThemedModalProps extends ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    lightBgColor?: string;
    darkBgColor?: string;
    bgColorName?: keyof typeof Colors;
}

// Create a styled version of View using NativeWind for modal content styling
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

const ThemedModal: React.FC<ThemedModalProps> = ({
                                                     onClose,
                                                     children,
                                                     lightBgColor,
                                                     darkBgColor,
                                                     bgColorName = 'modalBgColor',  // Default background color name from theme
                                                     ...rest
                                                 }) => {
    // Memoize the background color to avoid unnecessary recalculations
    const themeBgColor = useThemeColor({ light: lightBgColor, dark: darkBgColor }, bgColorName);

    // Memoize the onClose handler to prevent re-creation on each render
    const handleOnClose = useCallback(() => {
        onClose();
    }, [onClose]);

    return (
        <Modal
            transparent={true}  // Allow the modal background to be styled
            {...rest}  // Spread other ModalProps
        >
            {/* Handle background tap to close the modal */}
            <TouchableWithoutFeedback onPress={handleOnClose}>
                <StyledView className="flex-1 justify-center items-center p-5 bg-blackTransparent">
                    {/* Prevent closing when touching inside the modal */}
                    <TouchableWithoutFeedback>
                        <StyledView className={`bg-white dark:bg-slate-800 w-full p-5 rounded-xl shadow-lg`} style={{ backgroundColor: themeBgColor }}>
                            <StyledTouchableOpacity onPress={handleOnClose} className="absolute top-3 right-3">
                                <ThemedIcon iconType='ant' name="close" size={30} />
                            </StyledTouchableOpacity>
                            <StyledView className='pt-5 pb-2'>
                                {children}
                            </StyledView>
                        </StyledView>
                    </TouchableWithoutFeedback>
                </StyledView>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ThemedModal;
