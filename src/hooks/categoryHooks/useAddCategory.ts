import { useMutation } from '@tanstack/react-query';
import { addCategoryBySalonId } from '@/api/CategoriesAPI';
import { Category } from '@/types';

interface AddCategoryParams {
    salonId: string;
    categoryData: Category;
}

export const useAddCategory = () => {
    //const queryClient = useQueryClient();

    const addNewCategory = async ({ salonId, categoryData }: AddCategoryParams): Promise<Category> => {
        //console.log("useAddCategory: trying to add new category");
        //console.log(categoryData);
        return await addCategoryBySalonId(salonId, categoryData);
    };

    return useMutation({
        mutationFn: addNewCategory,
        onSuccess: async () => {
            //await queryClient.invalidateQueries({ queryKey: ['categories'] });
            //await queryClient.refetchQueries({ queryKey: ['categories'] });
        },
        onError: (error: Error) => {
            console.error('Error adding category:', error);
        },
    });
};
