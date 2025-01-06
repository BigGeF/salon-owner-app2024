import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Modal, TouchableWithoutFeedback, Animated, Easing, View, Dimensions, ModalProps, Platform } from 'react-native';
import { styled } from 'nativewind';

// Get the device window height dynamically
const { height: windowHeight } = Dimensions.get('window');

const typeStyles = {
    'bottom': {
        overlay: 'flex-1 bg-black/30 backdrop-blur-lg justify-end items-center',
        view: 'w-full bg-white dark:bg-gray-800 rounded-t-3xl p-5'
    },
    'centered': {
        overlay: 'flex-1 bg-black/50 backdrop-blur-lg justify-center items-center p-5',
        view: 'w-full bg-white dark:bg-gray-800 rounded-2xl py-8 px-5'
    },
    'cornerTopRight': {
        overlay: 'flex-1 bg-black/30 backdrop-blur-lg justify-start items-end p-5', // Align to top-right
        view: ' bg-white dark:bg-gray-800 rounded-md p-4 mt-5 mr-8' // Adjust width and position
    },
};

const shadowStyles = Platform.select({
    ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 5,
    },
    android: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 20,
    },
});

interface DynamicModalProps extends ModalProps {
    type?: keyof typeof typeStyles;
    visible: boolean;
    onClose: () => void;
    views: Array<{ component: React.ReactNode; key: string }>;
    currentView: string;
    animationDuration?: number;
}

const AnimatedStyledView = styled(Animated.View);
const StyledOverlay = styled(View);

const DynamicModal: React.FC<DynamicModalProps> = ({
                                                       type = "bottom",
                                                       visible,
                                                       onClose,
                                                       views,
                                                       currentView,
                                                       animationDuration = 100,
                                                       animationType = 'fade',
                                                       ...rest
                                                   }) => {
    const [isModalVisible, setIsModalVisible] = useState(visible);
    const translateY = useRef(new Animated.Value(windowHeight)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setIsModalVisible(true);

            if (animationType === 'slide') {
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: animationDuration,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }).start();
            }

            Animated.timing(opacity, {
                toValue: 1,
                duration: animationDuration,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            handleClose();
        }
    }, [visible, animationType, animationDuration]);

    const handleClose = useCallback(() => {
        if (animationType === 'slide') {
            Animated.timing(translateY, {
                toValue: windowHeight,
                duration: animationDuration,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }).start();
        }

        Animated.timing(opacity, {
            toValue: 0,
            duration: animationDuration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        }).start(() => {
            onClose();
            setIsModalVisible(false);
        });
    }, [animationType, animationDuration, translateY, opacity, onClose]);

    const renderCurrentView = useMemo(() => {
        const current = views.find((view) => view.key === currentView);
        return current ? current.component : null;
    }, [views, currentView]);

    const overlayClassName = useMemo(() => typeStyles[type].overlay, [type]);
    const viewClassName = useMemo(() => typeStyles[type].view, [type]);

    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="none"
            onRequestClose={handleClose}
            {...rest}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <StyledOverlay className={overlayClassName}>
                    <TouchableWithoutFeedback>
                        <AnimatedStyledView
                            className={viewClassName}
                            style={[
                                { transform: [{ translateY }], opacity, maxHeight: windowHeight * 0.85 },
                                shadowStyles,
                            ]}
                        >
                            {renderCurrentView}
                        </AnimatedStyledView>
                    </TouchableWithoutFeedback>
                </StyledOverlay>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default DynamicModal;
