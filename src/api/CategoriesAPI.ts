import { Category } from '@/types';
import api from './api';

// Function to get categories by salon ID
export const getCategoriesBySalonId = async (salonId: string): Promise<Category[]> => {
    //console.log("Sending Categories Request from CategoryAPI");
    try {
        const response = await api.get(`/categories/salon/${salonId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw new Error('Failed to fetch categories');
    }
};

// Function to add a category by salon ID
export const addCategoryBySalonId = async (salonId: string, categoryData: Category): Promise<Category> => {
    //console.log("Sending Add Category Request from CategoryAPI");
    try {
        const response = await api.post('/categories/', {
            categoryData,
            salonId,
        });
        return response.data;
    } catch (error) {
        console.error('Error adding category:', error);
        throw new Error('Failed to add category');
    }
};

// Function to edit a category by ID
export const editCategoryById = async (id: string, salonId: string, categoryData: Category): Promise<Category> => {
    try {
        const response = await api.put(`/categories/${id}`, {
            categoryData,
            salonId,
        });
        return response.data;
    } catch (error) {
        console.error('Error editing category:', error);
        throw new Error('Failed to edit category');
    }
};

export const deleteCategoryById = async (salonId: string, categoryId: string) => {
    //console.log("Sending Delete Category Request from CategoriesAPI");
    try {
        const response = await api.delete(`/categories/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw new Error('Network response was not ok');
    }
};
