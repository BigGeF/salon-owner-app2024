import { useMutation } from '@tanstack/react-query';
import { editCategoryById } from '@/api/CategoriesAPI';
import { Category } from '@/types';

interface EditCategoryParams {
    categoryId: string;
    salonId: string;
    categoryData: Category;
}

export const useEditCategory = () => {
    //const queryClient = useQueryClient();

    const editCategory = async ({ categoryId, salonId, categoryData }: EditCategoryParams): Promise<Category> => {
        //console.log("Cat ID: ", categoryId);
        //console.log("Cat Data: ", categoryData);
        return await editCategoryById(categoryId, salonId, categoryData);
    };

    return useMutation({
        mutationFn: editCategory,
        onSuccess: async () => {
            console.log("useEditCategory: Editing Category Success");
            //await queryClient.invalidateQueries({ queryKey: ['categories'] });
            //await queryClient.refetchQueries({ queryKey: ['categories'] });
        },
        onError: (error: Error) => {
            console.error('Error editing category:', error);
        },
    });
};
