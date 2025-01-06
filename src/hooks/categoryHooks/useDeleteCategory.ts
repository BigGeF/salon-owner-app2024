import { useMutation } from '@tanstack/react-query';
import { deleteCategoryById } from '@/api/CategoriesAPI'; // Ensure this API function is implemented

interface DeleteCategoryParams {
    salonId: string;
    categoryId: string;
}

export const useDeleteCategory = () => {
    //const queryClient = useQueryClient();

    const deleteCategory = async ({ salonId, categoryId }: DeleteCategoryParams): Promise<void> => {
        console.log("useDeleteCategory: - salonId: ", salonId);
        console.log("useDeleteCategory: - categoryId: ", categoryId);
        return await deleteCategoryById(salonId, categoryId);
    };

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: async () => {
            console.log("Category Deletion Success");
            //await queryClient.invalidateQueries({ queryKey: ['categories'] });
            //await queryClient.refetchQueries({ queryKey: ['categories'] });
        },
        onError: (error: Error) => {
            // Handle the error (e.g., show a notification)
            console.error('Error deleting category:', error);
        },
    });
};
