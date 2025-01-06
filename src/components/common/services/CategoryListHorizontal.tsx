import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import ThemedButton from '@/components/themed/ThemedButton';
import { Category } from '@/types';
import { useTranslation } from 'react-i18next';

interface CategoryListHorizontalProps {
    categories: Category[];
    selectedCategoryID: string;
    setSelectedCategoryID: (id: string) => void;
}

const CategoryListHorizontal: React.FC<CategoryListHorizontalProps> = ({
                                                                           categories,
                                                                           selectedCategoryID,
                                                                           setSelectedCategoryID,
                                                                       }) => {
    const { t } = useTranslation();

    // Memoize the handleOnPress function to prevent re-creation on each render
    const handlePress = useCallback(
        (id: string) => {
            setSelectedCategoryID(id);
        },
        [setSelectedCategoryID]
    );

    return (
        <FlatList
            data={[{ _id: 'all', salonId: '', name: t('category.categoryListHorizontal.allCategories') }, ...categories]}
            renderItem={({ item }) => (
                <ThemedButton
                    key={item._id}
                    text={item.name}
                    type='primary'
                    textColorName={selectedCategoryID === item._id ? 'primaryButtonText' : 'greyButtonText'}
                    bgColorName={selectedCategoryID === item._id ? 'primaryButtonBG' : 'greyButtonBG'}
                    handleOnPress={() => handlePress(item._id)} // Use memoized function
                />
            )}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 5 }}
        />
    );
};

// Wrap in React.memo to prevent unnecessary re-renders
export default React.memo(CategoryListHorizontal);
